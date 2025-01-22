from flask import render_template, Blueprint
from flask_login import login_required, current_user
from app.models.testimonial import Testimonial

main = Blueprint('main', __name__)

@main.route('/')
def index():
    try:
        testimonials = Testimonial.get_all()
        return render_template('index.html', testimonials=testimonials)
    except Exception as e:
        return str(e), 500

@main.route('/profile')
@login_required
def profile():
    user_data = {
        'username': current_user.username if current_user else '',
        'email': current_user.email if current_user else '',
        'user_type': 'student',  # You can modify this based on your user model
        'role': 'Student'  # You can modify this based on your user model
    }
    return render_template('profile.html', 
                         user_data=user_data,
                         user_profile={},
                         enrolled_courses=[],
                         completed_courses=[],
                         certificates=[])

@main.route('/terms-of-service')
def terms_of_service():
    return render_template('legal/terms-of-service.html')

@main.route('/privacy-policy')
def privacy_policy():
    return render_template('legal/privacy-policy.html')

@main.route('/cookie-policy')
def cookie_policy():
    return render_template('legal/cookie-policy.html')
