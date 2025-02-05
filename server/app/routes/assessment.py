from flask import Blueprint, jsonify, request, current_app, render_template, redirect, url_for, flash
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
        # Log request info for debugging
        current_app.logger.info("=== Assessment Submission Start ===")
        current_app.logger.info(f"User ID: {current_user.id}")
        current_app.logger.info(f"Content Type: {request.content_type}")
        current_app.logger.info(f"Headers: {dict(request.headers)}")
        
        # Validate CSRF token
        csrf_token = request.headers.get('X-CSRFToken')
        if not csrf_token:
            current_app.logger.error("Missing CSRF token")
            return jsonify({'error': 'Missing CSRF token'}), HTTPStatus.UNAUTHORIZED
        
        # Get form data
        program = request.form.get('program')
        major = request.form.get('major')
        
        current_app.logger.info(f"Form data: {request.form.to_dict()}")
        current_app.logger.info(f"Program: {program}")
        current_app.logger.info(f"Major: {major}")
        
        # Validate required fields
        if not program or not major:
            current_app.logger.error(f"Missing required fields - Program: {program}, Major: {major}")
            return jsonify({'error': 'Program and major are required'}), HTTPStatus.BAD_REQUEST
            
        # Validate major has available courses
        if not validate_major(major):
            current_app.logger.error(f"Invalid major or no course templates available: {major}")
            return jsonify({'error': f'No course templates available for major: {major}'}), HTTPStatus.BAD_REQUEST
        
        # Validate program type
        try:
            program = program.lower() if program else None
            if not program:
                raise ValueError("Program is required")
            
            # Try to get program type, if not found, just store the program as is
            try:
                program_type = ProgramType[program.upper()]
                program = program_type.value
            except KeyError:
                current_app.logger.warning(f"Program type {program.upper()} not found in enum, using as is")
                # Continue with the program value as provided
            
            current_app.logger.info(f"Program validated: {program}")
            
            # Validate major has available courses
            if not validate_major(major):
                current_app.logger.error(f"Invalid major or no course templates available: {major}")
                return jsonify({'error': f'No course templates available for major: {major}'}), HTTPStatus.BAD_REQUEST
        
        except ValueError as e:
            db.session.rollback()
            current_app.logger.error(f"Validation error: {str(e)}")
            return jsonify({
                'success': False,
                'error': str(e)
            }), HTTPStatus.BAD_REQUEST
            
        except SQLAlchemyError as e:
            db.session.rollback()
            current_app.logger.error(f"Database error: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'Database error occurred'
            }), HTTPStatus.INTERNAL_SERVER_ERROR
            
        except Exception as e:
            current_app.logger.error(f"Error in submit_assessment: {str(e)}")
            current_app.logger.exception("Full traceback:")
            return jsonify({
                'success': False,
                'error': 'An unexpected error occurred'
            }), HTTPStatus.INTERNAL_SERVER_ERROR
        
        # Collect skill scores
        scores = {}
        for category in ['technical', 'communication', 'soft', 'creativity']:
            category_scores = []
            for i in range(1, 4):
                score = request.form.get(f'skill_{category}_{i}')
                if not score:
                    raise ValueError(f"Missing score for {category} skill {i}")
                score = int(score)
                if score < 1 or score > 3:
                    raise ValueError(f"Score {score} out of range (1-3)")
                category_scores.append(score)
            scores[category] = category_scores

        # Initialize skill assessment and analyze
        skill_assessment = SkillAssessment()
        analysis_results = skill_assessment.analyze_skills(scores)

        # Create assessment
        assessment = Assessment(
            user_id=current_user.id,
            program=program,
            major=major,
            is_completed=True
        )
        db.session.add(assessment)
        db.session.flush()  # Get the assessment ID
        
        # Create categories and skills
        for category_name, category_scores in scores.items():
            category = AssessmentCategory(
                assessment_id=assessment.id,
                category_name=category_name,
                score=sum(category_scores) / len(category_scores)  # Average score
            )
            db.session.add(category)
            db.session.flush()
            
            # Add individual skills
            for i, score in enumerate(category_scores, 1):
                skill = AssessmentSkill(
                    category_id=category.id,
                    skill_name=f"{category_name}_{i}",
                    score=score
                )
                db.session.add(skill)
        
        # Calculate overall score and get recommendations
        all_scores = [score for scores_list in scores.values() for score in scores_list]
        overall_score = sum(all_scores) / len(all_scores)
        score_percentage = (overall_score / 3) * 100  # Convert to percentage
        
        # Get recommendations with score percentage
        recommendations = get_course_recommendations(score_percentage, major)
        
        # Calculate category scores (as percentages)
        category_scores = {}
        for category, scores_list in scores.items():
            category_scores[category] = (sum(scores_list) / len(scores_list)) / 3 * 100
        
        # Update user's assessment completion status
        current_user.has_completed_assessment = True
        
        # Save to database
        db.session.commit()
        current_app.logger.info(f"Assessment saved successfully with ID: {assessment.id}")
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'category_scores': category_scores,
            'assessment_id': assessment.id
        })
        
    except ValueError as e:
        db.session.rollback()
        current_app.logger.error(f"Validation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), HTTPStatus.BAD_REQUEST
        
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Database error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Database error occurred'
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
    except Exception as e:
        current_app.logger.error(f"Error in submit_assessment: {str(e)}")
        current_app.logger.exception("Full traceback:")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred'
        }), HTTPStatus.INTERNAL_SERVER_ERROR

def validate_major(major):
    """Validate if major has available course templates"""
    try:
        # Convert to uppercase to match folder names
        major = major.upper()
        
        # BSIT Majors
        bsit_majors = ['WMAD', 'SMP', 'AMG', 'NETAD']
        
        # BSCS Majors
        bscs_majors = ['GRAPHICS', 'INTELLIGENT_SYSTEMS']
        
        # BSIS Majors
        bsis_majors = ['BUSINESS_ANALYTICS', 'ENTERPRISE_SYSTEMS', 
                       'DIGITAL_TRANSFORMATION', 'IT_GOVERNANCE']
        
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
