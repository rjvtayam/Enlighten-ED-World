from app.extensions import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime, timedelta
from sqlalchemy.dialects.postgresql import UUID
import ipaddress

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID for Flask-Login"""
    try:
        return User.query.get(int(user_id))
    except Exception as e:
        print(f"Error loading user: {e}")
        return None

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    student_id = db.Column(db.String(20), unique=True)
    user_type = db.Column(db.String(20), default='student')
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(UUID(as_uuid=True), default=uuid.uuid4)
    reset_token = db.Column(UUID(as_uuid=True))
    reset_token_expiry = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    last_login = db.Column(db.DateTime(timezone=True))
    profile_image_url = db.Column(db.String(255))
    bio = db.Column(db.Text)
    has_completed_assessment = db.Column(db.Boolean, default=False)

    # Relationships
    login_attempts = db.relationship('LoginAttempt', backref='user', lazy=True)
    sessions = db.relationship('UserSession', backref='user', lazy=True)
    oauth_accounts = db.relationship('OAuthAccount', backref='user', lazy=True)

    @staticmethod
    def create_user(username, email, password, student_id=None, user_type='student'):
        """Create a new user with enhanced validation"""
        try:
            user = User(
                username=username,
                email=email.lower(),
                student_id=student_id,
                user_type=user_type,
                has_completed_assessment=False
            )
            
            if password:
                user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            return user.verification_token
            
        except Exception as e:
            db.session.rollback()
            raise e

    def set_password(self, password):
        """Set hashed password"""
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)

    def record_login_attempt(self, ip_address, success=True):
        """Record login attempt"""
        attempt = LoginAttempt(
            user_id=self.id,
            ip_address=str(ipaddress.ip_address(ip_address)),
            success=success
        )
        db.session.add(attempt)
        db.session.commit()

    def create_session(self, ip_address, user_agent):
        """Create new user session"""
        session = UserSession(
            user_id=self.id,
            ip_address=str(ipaddress.ip_address(ip_address)),
            user_agent=user_agent,
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.session.add(session)
        db.session.commit()
        return session

    @classmethod
    def get_by_email(cls, email):
        """Get user by email (case insensitive)"""
        return cls.query.filter(cls.email.ilike(email)).first()

    @classmethod
    def get_by_student_id(cls, student_id):
        """Get user by student ID"""
        return cls.query.filter_by(student_id=student_id).first()

    def update_profile(self, **kwargs):
        """Update user profile"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def update_last_login(self):
        """Update user's last login time"""
        self.last_login = datetime.utcnow()
        db.session.commit()

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'user_type': self.user_type,
            'is_verified': self.is_verified,
            'profile_image_url': self.profile_image_url,
            'has_completed_assessment': self.has_completed_assessment
        }

    def get_id(self):
        """Return the user ID as a unicode string."""
        return str(self.id)

    def is_active(self):
        """True, as all users are active."""
        return True

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False

    def is_authenticated(self):
        """True, as all users are authenticated."""
        return True

    def get_assessment_status(self):
        """Get the current assessment status"""
        return bool(self.has_completed_assessment)

    def mark_assessment_completed(self):
        """Mark the assessment as completed"""
        self.has_completed_assessment = True
        db.session.add(self)
        db.session.commit()

# Supporting Models
class LoginAttempt(db.Model):
    __tablename__ = 'login_attempts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    ip_address = db.Column(db.String(45), nullable=False)
    attempted_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    success = db.Column(db.Boolean, default=False)

class UserSession(db.Model):
    __tablename__ = 'user_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    session_token = db.Column(UUID(as_uuid=True), default=uuid.uuid4)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    last_activity = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

class OAuthAccount(db.Model):
    __tablename__ = 'oauth_accounts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    provider = db.Column(db.String(20), nullable=False)
    provider_user_id = db.Column(db.String(100), nullable=False)
    access_token = db.Column(db.Text)
    refresh_token = db.Column(db.Text)
    expires_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('provider', 'provider_user_id', name='uq_oauth_provider_id'),
    ) 