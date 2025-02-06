from flask import Blueprint, render_template

user_dashboard_bp = Blueprint('user_dashboard', __name__)

@user_dashboard_bp.route('/dashboard')
def user_dashboard():
    """
    Render the user dashboard page
    """
    return render_template('user/dashboard.html')