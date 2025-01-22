from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
from app.models.user import User
from app.extensions import db
import logging

logger = logging.getLogger(__name__)

admin = Blueprint('admin', __name__, url_prefix='/admin')

@admin.before_request
def check_admin():
    if not current_user.is_authenticated or not current_user.is_admin:
        flash('You do not have permission to access this page.', 'error')
        return redirect(url_for('main.index'))

@admin.route('/')
@login_required
def dashboard():
    return render_template('admin/dashboard.html')

@admin.route('/users')
@login_required
def users():
    users = User.query.all()
    return render_template('admin/users.html', users=users)

@admin.route('/users/<int:user_id>', methods=['GET', 'POST'])
@login_required
def edit_user(user_id):
    user = User.query.get_or_404(user_id)
    if request.method == 'POST':
        try:
            user.name = request.form.get('name')
            user.email = request.form.get('email')
            user.is_admin = 'is_admin' in request.form
            user.is_verified = 'is_verified' in request.form
            db.session.commit()
            flash('User updated successfully', 'success')
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            flash('Error updating user', 'error')
            db.session.rollback()
    return render_template('admin/edit_user.html', user=user)
