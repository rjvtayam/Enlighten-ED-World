from flask import Blueprint, render_template
from flask_login import login_required

wmad = Blueprint('wmad', __name__, url_prefix='/wmad')

@wmad.route('/WMAD/beginner/pre-assessment', methods=['GET'])
@login_required
def beginner_pre_assessment():
    return render_template('courses/WMAD/beginner/pre-assessment.html')

@wmad.route('/WMAD/beginner/post-assessment', methods=['GET'])
@login_required
def beginner_post_assessment():
    return render_template('courses/WMAD/beginner/post-assessment.html')