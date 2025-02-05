from flask import Blueprint, render_template
from flask_login import login_required

amg = Blueprint('amg', __name__)

@amg.route('/courses/amg/beginner')
@login_required
def amg_beginner():
    """Render AMG beginner course index and templates"""
    return render_template('courses/AMG/beginner/index.html')

@amg.route('/courses/amg/intermediate')
@login_required
def amg_intermediate():
    """Render AMG intermediate course index and templates"""
    return render_template('courses/AMG/intermediate/index.html')

@amg.route('/courses/amg/advanced')
@login_required
def amg_advanced():
    """Render AMG advanced course index and templates"""
    return render_template('courses/AMG/advanced/index.html')