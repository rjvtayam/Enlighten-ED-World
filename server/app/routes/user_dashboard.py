from flask import Blueprint, render_template

user_dashboard = Blueprint('user_dashboard', __name__)

@user_dashboard.route('/dashboard')
def user_dashboard():
    """
    Render the user dashboard page
    """
    return render_template('user/dashboard.html')