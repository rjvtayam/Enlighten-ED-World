from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app.models.testimonial import Testimonial
from app.extensions import db
import os

testimonials = Blueprint('testimonials', __name__, url_prefix='/api/testimonials')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@testimonials.route('/', methods=['GET'])
def get_testimonials():
    try:
        testimonials = Testimonial.get_all()
        return jsonify({
            'success': True,
            'testimonials': [
                {
                    'id': t.id,
                    'author_name': t.author_name,
                    'author_title': t.author_title,
                    'author_institution': t.author_institution,
                    'testimonial_text': t.testimonial_text,
                    'rating': t.rating,
                    'author_image': t.author_image,
                    'created_at': t.created_at.isoformat()
                } for t in testimonials
            ]
        })
    except Exception as e:
        current_app.logger.error(f"Error getting testimonials: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get testimonials'
        }), 500

@testimonials.route('/', methods=['POST'])
@login_required
def create_testimonial():
    try:
        data = request.form
        author_name = data.get('author_name')
        author_title = data.get('author_title')
        author_institution = data.get('author_institution')
        testimonial_text = data.get('testimonial_text')
        rating = data.get('rating')
        
        if not all([author_name, author_title, author_institution, testimonial_text, rating]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        author_image = None
        if 'author_image' in request.files:
            file = request.files['author_image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                author_image = filename
        
        testimonial = Testimonial(
            author_name=author_name,
            author_title=author_title,
            author_institution=author_institution,
            testimonial_text=testimonial_text,
            rating=int(rating),
            author_image=author_image
        )
        
        db.session.add(testimonial)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Testimonial created successfully'
        })
    except Exception as e:
        current_app.logger.error(f"Error creating testimonial: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Failed to create testimonial'
        }), 500
