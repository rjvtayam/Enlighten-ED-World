from app.extensions import db
from datetime import datetime

class Testimonial(db.Model):
    __tablename__ = 'testimonials'

    id = db.Column(db.Integer, primary_key=True)
    author_name = db.Column(db.String(100), nullable=False)
    author_title = db.Column(db.String(100), nullable=False)
    author_institution = db.Column(db.String(100), nullable=False)
    testimonial_text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    author_image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))

    @classmethod
    def get_all(cls):
        return cls.query.order_by(cls.created_at.desc()).all()

    @classmethod
    def add_testimonial(cls, **kwargs):
        testimonial = cls(**kwargs)
        try:
            db.session.add(testimonial)
            db.session.commit()
            return testimonial
        except Exception as e:
            db.session.rollback()
            raise e 