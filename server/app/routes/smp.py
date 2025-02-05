from flask import Blueprint, render_template
from flask_login import login_required

smp = Blueprint('smp', __name__)

@smp.route('/courses/smp/beginner')
@login_required
def smp_beginner():
    """Render SMP beginner course index and templates"""
    return render_template('courses/SMP/beginner/index.html')

@smp.route('/courses/smp/intermediate')
@login_required
def smp_intermediate():
    """Render SMP intermediate course index and templates"""
    return render_template('courses/SMP/intermediate/index.html')

@smp.route('/courses/smp/advanced')
@login_required
def smp_advanced():
    """Render SMP advanced course index and templates"""
    return render_template('courses/SMP/advanced/index.html')