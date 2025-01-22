from app.extensions import db
from datetime import datetime

class FAQ(db.Model):
    __tablename__ = 'faqs'
    
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    answers = db.relationship('FAQAnswer', backref='faq', lazy=True)

    @staticmethod
    def add_default_faqs():
        default_faqs = [
            {
                'question': 'What is EnlightenED?',
                'answer': 'EnlightenED is an educational platform that connects students with learning opportunities and internships.'
            },
            {
                'question': 'How do I get started?',
                'answer': 'Simply register for an account and start exploring our courses and opportunities.'
            },
            {
                'question': 'What courses are available?',
                'answer': 'We offer a wide range of technical and professional development courses.'
            }
        ]

        for faq_data in default_faqs:
            if not FAQ.query.filter_by(question=faq_data['question']).first():
                faq = FAQ(
                    question=faq_data['question'],
                    answer=faq_data['answer']
                )
                db.session.add(faq)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

class FAQAnswer(db.Model):
    __tablename__ = 'faq_answers'
    
    id = db.Column(db.Integer, primary_key=True)
    faq_id = db.Column(db.Integer, db.ForeignKey('faqs.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, default=0)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)