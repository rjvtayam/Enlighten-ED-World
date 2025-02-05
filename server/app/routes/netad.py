from flask import Blueprint, render_template
from flask_login import login_required

netad = Blueprint('netad', __name__)

@netad.route('/courses/netad/beginner')
@login_required
def netad_beginner():
    """Render NETAD beginner course index and templates"""
    return render_template('courses/NETAD/beginner/index.html')

@netad.route('/courses/netad/intermediate')
@login_required
def netad_intermediate():
    """Render NETAD intermediate course index and templates"""
    return render_template('courses/NETAD/intermediate/index.html')

@netad.route('/courses/netad/advanced')
@login_required
def netad_advanced():
    """Render NETAD advanced course index and templates"""
    return render_template('courses/NETAD/advanced/index.html')