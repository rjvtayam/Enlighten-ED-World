from flask import Blueprint, render_template, flash, redirect, url_for
from flask_login import login_required, current_user
from app.models.assessment import SkillLevel, Assessment

wmad = Blueprint('wmad', __name__)

@wmad.route('/courses/WMAD/beginner')
@login_required
def wmad_beginner():
    """Render WMAD beginner course index and templates"""
    return render_template('courses/WMAD/beginner/index.html')

@wmad.route('/courses/WMAD/intermediate')
@login_required
def wmad_intermediate():
    """Render WMAD intermediate course index and templates"""
    return render_template('courses/WMAD/intermediate/index.html')

@wmad.route('/courses/WMAD/advanced')
@login_required
def wmad_advanced():
    """Render WMAD advanced course index and templates"""
    return render_template('courses/WMAD/advanced/index.html')

# BEGINNER Pre-Assessment and Post-Assessment
@wmad.route('/WMAD/beginner/pre-assessment', methods=['GET'])
@login_required
def beginner_pre_assessment():
    return render_template('courses/WMAD/beginner/pre-assessment.html')

@wmad.route('/WMAD/beginner/post-assessment', methods=['GET'])
@login_required
def beginner_post_assessment():
    return render_template('courses/WMAD/beginner/post-assessment.html')