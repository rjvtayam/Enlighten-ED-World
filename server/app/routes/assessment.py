from flask import Blueprint, jsonify, request, current_app, render_template, redirect, url_for, flash, session
from flask_login import login_required, current_user
from app.extensions import db, csrf
from app.models.assessment import (
    Assessment, 
    AssessmentCategory, 
    AssessmentSkill, 
    CategoryType, 
    SkillLevel, 
    ProgramType
)
from app.utils.skill_assessment import SkillAssessment
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from http import HTTPStatus
from typing import Dict, Any, List, Optional
from flask_wtf import FlaskForm
from dateutil import parser
from datetime import date
import os
from functools import lru_cache
from pathlib import Path

assessment = Blueprint('assessment', __name__, url_prefix='/assessment')
skill_assessor = SkillAssessment()

class AssessmentForm(FlaskForm):
    """Form for the initial assessment"""
    class Meta:
        csrf = True  # Enable CSRF protection

def has_completed_assessment():
    """Check if user has completed an assessment"""
    if not current_user.is_authenticated:
        return False
        
    assessment = Assessment.query.filter_by(
        user_id=current_user.id,
        is_completed=True
    ).first()
    return assessment is not None

@assessment.route('/initial_assessment', methods=['GET'])
@login_required
def initial_assessment():
    """Show initial assessment form"""
    if has_completed_assessment():
        if request.referrer and 'login' not in request.referrer and 'oauth' not in request.referrer:
            flash('You have already completed your initial assessment.', 'info')
        return redirect(url_for('main.index'))
    
    form = AssessmentForm()
    return render_template('assessment/initial_assessment.html', form=form)

@assessment.route('/submit_assessment', methods=['POST'])
@login_required
def submit_assessment():
    try:
        # Logging and debugging
        current_app.logger.info("=== Assessment Submission Start ===")
        current_app.logger.info(f"User ID: {current_user.id}")
        current_app.logger.info(f"Form Data: {dict(request.form)}")
        
        # Get and validate program and major
        program = request.form.get('program', '').upper()
        major = request.form.get('major', '').upper()
        
        # Validate program and major
        if not program or not validate_major(program):
            current_app.logger.error(f"Invalid program: {program}")
            flash('Invalid program selection', 'error')
            return redirect(url_for('assessment.initial_assessment'))
        
        if not major or not validate_major(major):
            current_app.logger.error(f"Invalid major: {major}")
            flash('Invalid major selection', 'error')
            return redirect(url_for('assessment.initial_assessment'))
        
        # Collect skill scores
        skill_categories = ['technical', 'communication', 'soft', 'creativity']
        category_scores = {}
        
        for category in skill_categories:
            category_skills = [
                key for key in request.form.keys() 
                if key.startswith(f'skill_{category}_')
            ]
            
            if category_skills:
                skill_scores = []
                for skill in category_skills:
                    value = request.form.get(skill)
                    try:
                        skill_scores.append(int(value))
                    except (ValueError, TypeError):
                        current_app.logger.warning(f"Invalid score for {skill}")
                
                # Calculate category score
                avg_score = sum(skill_scores) / len(skill_scores) if skill_scores else 0
                category_scores[category] = round(avg_score * 33.33, 2)  # Convert to percentage
        
        # Determine overall score and skill level
        overall_score = sum(category_scores.values()) / len(category_scores)
        
        # Determine skill level
        if overall_score < 40:
            skill_level = 'Beginner'
        elif overall_score < 70:
            skill_level = 'Intermediate'
        else:
            skill_level = 'Advanced'
        
        # Get course recommendations
        recommendations = get_course_recommendations(overall_score, major)
        
        # Prepare detailed results
        category_results = [
            {
                'name': category.capitalize() + ' Skills', 
                'score': round(score, 2),  # Round to 2 decimal places
                'description': f'Proficiency in {category} skills'
            } for category, score in category_scores.items()
        ]
        
        # Prepare radar chart data
        skills_radar_data = {
            'labels': list(category_scores.keys()),
            'scores': [round(score, 2) for score in category_scores.values()]  # Round scores
        }
        
        # Create assessment record
        assessment = Assessment(
            user_id=current_user.id,
            program=program,
            major=major,
            assessment_date=datetime.utcnow().date()
        )
        db.session.add(assessment)
        
        # Commit to database
        db.session.commit()
        
        # Log successful submission
        current_app.logger.info(f"Assessment submitted successfully for user {current_user.id}")
        
        # Store results in session for results page
        assessment_results_data = {
            'overall_score': round(overall_score, 2),
            'skill_level': skill_level,
            'category_results': category_results,
            'recommended_courses': recommendations.get('courses', []),
            'skills_radar_data': skills_radar_data,
            'category_scores': category_scores,
            'assessment_id': assessment.id,
            'program': program,  
            'major': major      
        }
        session['assessment_results'] = assessment_results_data
        
        # Return JSON response instead of redirecting
        return jsonify({
            'success': True,
            **assessment_results_data
        })
    
    except Exception as e:
        # Comprehensive error handling
        current_app.logger.error(f"Error in submit_assessment: {str(e)}")
        current_app.logger.exception("Full traceback:")
        
        # Rollback any database changes
        db.session.rollback()
        
        return jsonify({
            'success': False,
            'message': 'An unexpected error occurred during assessment submission',
            'error': str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

def validate_major(major):
    """Validate if major is valid for the selected program"""
    try:
        # Convert to uppercase to match option values
        major = major.upper()
        
        # BSIT Majors
        bsit_majors = ['WMAD', 'AMG', 'NETWORKING', 'SMP']
        
        # BSCS Majors
        bscs_majors = ['GRAPHICS', 'INTELLIGENT_SYSTEMS']
        
        # BSIS Majors
        bsis_majors = ['BUSINESS_ANALYTICS', 'ENTERPRISE_SYSTEMS', 
                       'IS_SECURITY', 'DATA_MANAGEMENT']
        
        # Program Types
        program_types = ['BSIT', 'BSCS', 'BSIS']
        
        # Check if the major is valid
        return (major in bsit_majors or 
                major in bscs_majors or 
                major in bsis_majors or 
                major in program_types)
    except Exception as e:
        current_app.logger.error(f"Error validating major: {str(e)}")
        return False

@lru_cache(maxsize=10)
def get_course_info(major: str) -> dict:
    """Get cached course information for a major"""
    return {
        'WMAD': {
            'name': 'Web & Mobile App Development',
            'description': 'Build modern web and mobile applications using the latest technologies and frameworks.',
            'image': '/public/images/courses/wmad-course.jpg'
        },
        'AMG': {
            'name': 'Animation & Motion Graphics',
            'description': 'Master the art of animation and motion graphics design with industry-standard tools and techniques.',
            'image': '/public/images/courses/amg-course.jpg'
        },
        'NETAD': {
            'name': 'Network Administration',
            'description': 'Learn advanced network infrastructure, security, and system administration skills.',
            'image': '/public/images/courses/netad-course.jpg'
        },
        'SMP': {
            'name': 'Service Management Program',
            'description': 'Become a social media expert with skills in content creation, strategy, and analytics.',
            'image': '/public/images/courses/smp-course.jpg'
        }
    }.get(major.upper(), {})

def get_course_recommendations(overall_score: float, major: str) -> dict:
    """Get course recommendations based on assessment score and user's major"""
    current_app.logger.info(f"Getting course recommendations - Score: {overall_score}, Major: {major}")
    
    # Determine level based on score
    if overall_score < 40:
        level = 'beginner'
        level_text = 'Beginner'
    elif overall_score < 70:
        level = 'intermediate'
        level_text = 'Intermediate'
    else:
        level = 'advanced'
        level_text = 'Advanced'
    
    current_app.logger.info(f"Determined level: {level_text} ({overall_score}%)")
    
    # Get course info from cache
    course_info = get_course_info(major)
    if not course_info:
        current_app.logger.error(f"No course information found for major: {major}")
        return {
            'score': overall_score,
            'level': level_text,
            'courses': []
        }
    
    # Get course recommendations only for the selected major
    recommendations = []
    template_path = Path(current_app.root_path).parent.parent / 'client' / 'src' / 'pages' / 'courses' / major.upper() / level / 'index.html'
    
    if template_path.exists():
        current_app.logger.info(f"Found course template: {template_path}")
        recommendations.append({
            'code': major.upper(),
            'name': course_info['name'],
            'description': course_info['description'],
            'image': course_info['image'],
            'level': level_text,
            'url': url_for('main.course_page', course_code=major.lower(), level=level)
        })
    else:
        current_app.logger.warning(f"Course template not found: {template_path}")
    
    result = {
        'score': overall_score,
        'level': level_text,
        'courses': recommendations
    }
    
    current_app.logger.info(f"Returning recommendations: {result}")
    return result

@assessment.route('/results')
@login_required
def assessment_results():
    """Show assessment results"""
    try:
        latest_assessment = Assessment.query.filter_by(
            user_id=current_user.id,
            is_completed=True
        ).order_by(Assessment.created_at.desc()).first()
        
        if not latest_assessment:
            flash('No assessment found.', 'error')
            return redirect(url_for('assessment.initial_assessment'))
            
        return render_template('assessment/assessment_results.html', 
                             assessment=latest_assessment.to_dict())
                             
    except Exception as e:
        current_app.logger.error(f'Error retrieving assessment results: {str(e)}')
        flash('Error retrieving assessment results.', 'error')
        return redirect(url_for('main.index'))

# API Endpoints
@assessment.route('/', methods=['POST'])
def create_assessment():
    """Create a new assessment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'program', 'major']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), HTTPStatus.BAD_REQUEST
        
        # Validate program type
        try:
            program = data['program'].lower() if data['program'] else None  # Convert to lowercase
            if not program:
                raise ValueError("Program is required")
            
            program_type = ProgramType[program.upper()]  # Use uppercase for enum lookup
            if not program_type:
                raise ValueError(f"Invalid program type: {program}")
            current_app.logger.info(f"Program type validated: {program_type.value}")  # Use .value to get lowercase
            
            # Create assessment
            assessment = Assessment(
                user_id=data['user_id'],
                program=program_type.value,  # Use value directly, already lowercase
                major=data['major'],
                assessment_date=datetime.utcnow().date()
            )
            
            # Process categories and skills
            if 'categories' in data:
                for category_data in data['categories']:
                    category = AssessmentCategory(
                        assessment_id=assessment.id,
                        category_name=category_data['name'],
                        weight=category_data.get('weight', 1.0)
                    )
                    
                    # Process skills for this category
                    if 'skills' in category_data:
                        skills_data = {}
                        for skill_data in category_data['skills']:
                            skill = AssessmentSkill(
                                category_id=category.id,
                                skill_name=skill_data['name'],
                                score=skill_data['score'],
                                description=skill_data.get('description')
                            )
                            category.skills.append(skill)
                            skills_data[skill.skill_name] = skill.score
                        
                        # Calculate category score and level
                        category.score = category.calculate_score()
                        category.level = category.determine_level()
                    
                    assessment.categories.append(category)
            
            # Calculate overall assessment metrics
            assessment.overall_score = assessment.calculate_overall_score()
            assessment.overall_level = assessment.calculate_overall_level()
            
            # Get learning recommendations
            skills_by_category = {
                CategoryType(cat.category_name): {
                    skill.skill_name: skill.score for skill in cat.skills
                }
                for cat in assessment.categories
            }
            
            recommendations = skill_assessor.analyze_skills(skills_by_category)
            assessment.recommended_courses = recommendations
            
            # Save to database
            db.session.add(assessment)
            db.session.commit()
            
            return jsonify(assessment.to_dict()), HTTPStatus.CREATED
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Database error: {str(e)}")
            return jsonify({'error': 'Database error occurred'}), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        current_app.logger.error(f"Error creating assessment: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@assessment.route('/<int:assessment_id>', methods=['GET'])
def get_assessment(assessment_id: int):
    """Get assessment by ID"""
    try:
        assessment = Assessment.query.get_or_404(assessment_id)
        return jsonify(assessment.to_dict()), HTTPStatus.OK
    except Exception as e:
        current_app.logger.error(f"Error retrieving assessment: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@assessment.route('/<int:assessment_id>', methods=['PUT'])
def update_assessment(assessment_id: int):
    """Update assessment"""
    try:
        assessment = Assessment.query.get_or_404(assessment_id)
        data = request.get_json()
        
        # Update basic fields
        for field in ['program', 'major']:
            if field in data:
                setattr(assessment, field, data[field])
        
        # Update categories and skills
        if 'categories' in data:
            # Remove existing categories
            for category in assessment.categories:
                db.session.delete(category)
            
            # Add new categories
            for category_data in data['categories']:
                category = AssessmentCategory(
                    assessment_id=assessment.id,
                    category_name=category_data['name'],
                    weight=category_data.get('weight', 1.0)
                )
                
                if 'skills' in category_data:
                    skills_data = {}
                    for skill_data in category_data['skills']:
                        skill = AssessmentSkill(
                            category_id=category.id,
                            skill_name=skill_data['name'],
                            score=skill_data['score'],
                            description=skill_data.get('description')
                        )
                        category.skills.append(skill)
                        skills_data[skill.skill_name] = skill.score
                    
                    category.score = category.calculate_score()
                    category.level = category.determine_level()
                
                assessment.categories.append(category)
            
            # Recalculate overall metrics
            assessment.overall_score = assessment.calculate_overall_score()
            assessment.overall_level = assessment.calculate_overall_level()
            
            # Update recommendations
            skills_by_category = {
                CategoryType(cat.category_name): {
                    skill.skill_name: skill.score for skill in cat.skills
                }
                for cat in assessment.categories
            }
            assessment.recommended_courses = skill_assessor.analyze_skills(skills_by_category)
        
        assessment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(assessment.to_dict()), HTTPStatus.OK
        
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Database error: {str(e)}")
        return jsonify({'error': 'Database error occurred'}), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        current_app.logger.error(f"Error updating assessment: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@assessment.route('/<int:assessment_id>', methods=['DELETE'])
def delete_assessment(assessment_id: int):
    """Delete assessment"""
    try:
        assessment = Assessment.query.get_or_404(assessment_id)
        db.session.delete(assessment)
        db.session.commit()
        return '', HTTPStatus.NO_CONTENT
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting assessment: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@assessment.route('/user/<int:user_id>', methods=['GET'])
def get_user_assessments(user_id: int):
    """Get all assessments for a user"""
    try:
        assessments = Assessment.query.filter_by(user_id=user_id).all()
        return jsonify([assessment.to_dict() for assessment in assessments]), HTTPStatus.OK
    except Exception as e:
        current_app.logger.error(f"Error retrieving user assessments: {str(e)}")
        return jsonify({'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@assessment.route('/get_programs_and_majors', methods=['GET'])
def get_programs_and_majors():
    """Retrieve available programs and their majors"""
    try:
        # Use the ProgramType enum to dynamically generate programs and majors
        programs_and_majors = {
            'BSIT': [
                {'value': 'WMAD', 'label': 'Web and Mobile App Development'},
                {'value': 'SMP', 'label': 'Service Management Program'},
                {'value': 'AMG', 'label': 'Animation and Motion Graphics'},
                {'value': 'NETAD', 'label': 'Network Administration'}
            ],
            'BSCS': [
                {'value': 'GRAPHICS', 'label': 'Graphics and Visualization'},
                {'value': 'INTELLIGENT_SYSTEMS', 'label': 'Intelligent Systems'}
            ],
            'BSIS': [
                {'value': 'BUSINESS_ANALYTICS', 'label': 'Business Analytics'},
                {'value': 'ENTERPRISE_SYSTEMS', 'label': 'Enterprise Systems Management'},
                {'value': 'DIGITAL_TRANSFORMATION', 'label': 'Digital Transformation'},
                {'value': 'IT_GOVERNANCE', 'label': 'IT Governance'}
            ]
        }
        
        return jsonify({
            'status': 'success',
            'programs_and_majors': programs_and_majors
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving programs and majors: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Unable to retrieve programs and majors'
        }), 500

@assessment.route('/get_recommended_courses', methods=['POST'])
@login_required
def get_recommended_courses():
    """Fetch recommended courses based on assessment results"""
    try:
        # Get data from the request or session
        data = request.get_json() or session.get('assessment_results', {})
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No assessment results found'
            }), 400
        
        # Extract necessary information
        program = data.get('program', '').upper()
        major = data.get('major', '').upper()
        overall_score = data.get('overall_score', 0)
        
        # Determine skill level
        if overall_score < 40:
            level = 'beginner'
        elif overall_score < 70:
            level = 'intermediate'
        else:
            level = 'advanced'
        
        # Path to course templates
        courses_base_path = Path(current_app.root_path).parent.parent / 'client' / 'src' / 'pages' / 'courses' / major
        
        # Find course files
        recommended_courses = []
        if courses_base_path.exists() and courses_base_path.is_dir():
            level_path = courses_base_path / level
            
            if level_path.exists():
                # Get all HTML files in the level directory
                course_files = list(level_path.glob('*.html'))
                
                for course_file in course_files:
                    # Extract course details from filename or content
                    course_name = course_file.stem
                    recommended_courses.append({
                        'code': course_name.upper(),
                        'name': course_name.replace('_', ' ').title(),
                        'level': level.capitalize(),
                        'url': f'/courses/{program.lower()}/{major.lower()}/{level}/{course_name}'
                    })
        
        # Log and return results
        current_app.logger.info(f"Recommended Courses for {major} at {level} level: {recommended_courses}")
        
        return jsonify({
            'success': True,
            'program': program,
            'major': major,
            'level': level.capitalize(),
            'courses': recommended_courses
        })
    
    except Exception as e:
        current_app.logger.error(f"Error fetching recommended courses: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error fetching recommended courses',
            'error': str(e)
        }), 500
