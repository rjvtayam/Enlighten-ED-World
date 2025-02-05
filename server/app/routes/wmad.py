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

# Additional BEGINNER Course Routes
@wmad.route('/WMAD/beginner/basic_elements', methods=['GET'])
@login_required
def beginner_basic_elements():
    return render_template('courses/WMAD/beginner/basic_elements.html')

@wmad.route('/WMAD/beginner/control_flow', methods=['GET'])
@login_required
def beginner_control_flow():
    return render_template('courses/WMAD/beginner/control_flow.html')

@wmad.route('/WMAD/beginner/dom', methods=['GET'])
@login_required
def beginner_dom():
    return render_template('courses/WMAD/beginner/dom.html')

@wmad.route('/WMAD/beginner/events', methods=['GET'])
@login_required
def beginner_events():
    return render_template('courses/WMAD/beginner/events.html')

@wmad.route('/WMAD/beginner/form_input', methods=['GET'])
@login_required
def beginner_form_input():
    return render_template('courses/WMAD/beginner/form_input.html')

@wmad.route('/WMAD/beginner/form_project', methods=['GET'])
@login_required
def beginner_form_project():
    return render_template('courses/WMAD/beginner/form_project.html')

@wmad.route('/WMAD/beginner/function', methods=['GET'])
@login_required
def beginner_function():
    return render_template('courses/WMAD/beginner/function.html')

@wmad.route('/WMAD/beginner/intro_css', methods=['GET'])
@login_required
def beginner_intro_css():
    return render_template('courses/WMAD/beginner/intro_css.html')

@wmad.route('/WMAD/beginner/intro_html', methods=['GET'])
@login_required
def beginner_intro_html():
    return render_template('courses/WMAD/beginner/intro_html.html')

@wmad.route('/WMAD/beginner/intro_js', methods=['GET'])
@login_required
def beginner_intro_js():
    return render_template('courses/WMAD/beginner/intro_js.html')

@wmad.route('/WMAD/beginner/landingpage', methods=['GET'])
@login_required
def beginner_landingpage():
    return render_template('courses/WMAD/beginner/landingpage.html')

@wmad.route('/WMAD/beginner/layout_box', methods=['GET'])
@login_required
def beginner_layout_box():
    return render_template('courses/WMAD/beginner/layout_box.html')

@wmad.route('/WMAD/beginner/media', methods=['GET'])
@login_required
def beginner_media():
    return render_template('courses/WMAD/beginner/media.html')

@wmad.route('/WMAD/beginner/responsive_design', methods=['GET'])
@login_required
def beginner_responsive_design():
    return render_template('courses/WMAD/beginner/responsive_design.html')

@wmad.route('/WMAD/beginner/select_properties', methods=['GET'])
@login_required
def beginner_select_properties():
    return render_template('courses/WMAD/beginner/select_properties.html')

@wmad.route('/WMAD/beginner/variable', methods=['GET'])
@login_required
def beginner_variable():
    return render_template('courses/WMAD/beginner/variable.html')

@wmad.route('/WMAD/beginner/web_basics', methods=['GET'])
@login_required
def beginner_web_basics():
    return render_template('courses/WMAD/beginner/web_basics.html')

@wmad.route('/WMAD/beginner/project_review', methods=['GET'])
@login_required
def beginner_project_review():
    return render_template('courses/WMAD/beginner/project_review.html')

@wmad.route('/WMAD/beginner/development_setup', methods=['GET'])
@login_required
def beginner_development_setup():
    return render_template('courses/WMAD/beginner/development_setup.html')