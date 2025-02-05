from flask import Blueprint, render_template, flash, redirect, url_for
from flask_login import login_required, current_user
from app.models.assessment import SkillLevel, Assessment

wmad = Blueprint('wmad', __name__, url_prefix='/wmad')

@wmad.route('/WMAD/beginner/pre-assessment', methods=['GET'])
@login_required
def beginner_pre_assessment():
    return render_template('courses/WMAD/beginner/pre-assessment.html')

@wmad.route('/WMAD/beginner/post-assessment', methods=['GET'])
@login_required
def beginner_post_assessment():
    return render_template('courses/WMAD/beginner/post-assessment.html')

@wmad.route('/recommend_courses', methods=['GET'])
@login_required
def recommend_courses():
    """
    Recommend WMAD courses based on user's skill assessment level
    """
    # Retrieve user's overall skill level from their last assessment
    user_assessment = Assessment.query.filter_by(user_id=current_user.id).order_by(Assessment.created_at.desc()).first()
    
    if not user_assessment:
        flash('Please complete the initial assessment first.', 'warning')
        return redirect(url_for('assessment.initial_assessment'))
    
    # Determine course recommendation based on skill level
    if user_assessment.overall_skill_level == SkillLevel.BEGINNER:
        return render_template('courses/WMAD/beginner/index.html')
    elif user_assessment.overall_skill_level == SkillLevel.INTERMEDIATE:
        return render_template('courses/WMAD/intermediate/index.html')
    elif user_assessment.overall_skill_level == SkillLevel.ADVANCED:
        return render_template('courses/WMAD/advanced/index.html')
    else:
        flash('Unable to determine skill level. Please retake the assessment.', 'error')
        return redirect(url_for('assessment.initial_assessment'))