from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from app.extensions import db
from app.models.faq import FAQ, FAQAnswer

faq = Blueprint('faq', __name__, url_prefix='/api/faqs')

@faq.route('/')
def get_faqs():
    try:
        # Check if we have any FAQs, if not add defaults
        if FAQ.query.count() == 0:
            FAQ.add_default_faqs()
        
        faqs = FAQ.query.all()
        
        # Format response based on user authentication
        faq_list = []
        for faq_item in faqs:
            faq_data = {
                'id': faq_item.id,
                'question': faq_item.question,
                'answer': faq_item.answer,
            }
            
            if current_user.is_authenticated:
                answers = FAQAnswer.query.filter_by(faq_id=faq_item.id).all()
                faq_data['user_answers'] = [{
                    'id': answer.id,
                    'answer': answer.answer,
                    'created_at': answer.created_at.isoformat()
                } for answer in answers]
            
            faq_list.append(faq_data)
            
        return jsonify({
            'success': True,
            'faqs': faq_list,
            'is_authenticated': current_user.is_authenticated
        })
    except Exception as e:
        current_app.logger.error(f"Error getting FAQs: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get FAQs'
        }), 500

@faq.route('/<int:faq_id>/answer', methods=['POST'])
@login_required
def add_answer(faq_id):
    try:
        data = request.get_json()
        if not data or 'answer' not in data:
            return jsonify({
                'success': False,
                'error': 'Answer is required'
            }), 400
            
        answer = FAQAnswer(
            faq_id=faq_id,
            user_id=current_user.id,
            answer=data['answer']
        )
        
        db.session.add(answer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Answer submitted successfully'
        })
    except Exception as e:
        current_app.logger.error(f"Error adding answer: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Failed to submit answer'
        }), 500