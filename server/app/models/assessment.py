from app.extensions import db
from datetime import datetime
from enum import Enum

class CategoryType(str, Enum):
    TECHNICAL = "technical"
    COMMUNICATION = "communication"
    SOFT = "soft"
    CREATIVITY = "creativity"

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class ProgramType(str, Enum):
    WMAD = "wmad"
    BIA = "bia"
    DM = "dm"
    ISM = "ism"
    SMP = "smp"

class Assessment(db.Model):
    __tablename__ = 'assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    program = db.Column(db.String(10))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    overall_score = db.Column(db.Float)
    overall_level = db.Column(db.String(20))
    
    categories = db.relationship('AssessmentCategory', backref='assessment', cascade='all, delete-orphan')

class AssessmentCategory(db.Model):
    __tablename__ = 'assessment_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id'))
    category_name = db.Column(db.String(50))
    score = db.Column(db.Float)
    level = db.Column(db.String(20))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    
    skills = db.relationship('AssessmentSkill', backref='category', cascade='all, delete-orphan')

class AssessmentSkill(db.Model):
    __tablename__ = 'assessment_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('assessment_categories.id'))
    skill_name = db.Column(db.String(50))
    score = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

class LearningPath(db.Model):
    __tablename__ = 'learning_paths'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id'))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    
    courses = db.relationship('RecommendedCourse', backref='learning_path', cascade='all, delete-orphan')
    phases = db.relationship('LearningPhase', backref='learning_path', cascade='all, delete-orphan')

class RecommendedCourse(db.Model):
    __tablename__ = 'recommended_courses'
    
    id = db.Column(db.Integer, primary_key=True)
    learning_path_id = db.Column(db.Integer, db.ForeignKey('learning_paths.id'))
    name = db.Column(db.String(200))
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    priority = db.Column(db.String(20))
    duration = db.Column(db.String(50))
    platform = db.Column(db.String(100))
    certification_available = db.Column(db.Boolean, default=False)
    deadline = db.Column(db.Date)

class LearningPhase(db.Model):
    __tablename__ = 'learning_phases'
    
    id = db.Column(db.Integer, primary_key=True)
    learning_path_id = db.Column(db.Integer, db.ForeignKey('learning_paths.id'))
    phase_name = db.Column(db.String(100))
    duration = db.Column(db.String(50))
    focus = db.Column(db.Text)
    sequence_order = db.Column(db.Integer)
    
    goals = db.relationship('PhaseGoal', backref='phase', cascade='all, delete-orphan')

class PhaseGoal(db.Model):
    __tablename__ = 'phase_goals'
    
    id = db.Column(db.Integer, primary_key=True)
    phase_id = db.Column(db.Integer, db.ForeignKey('learning_phases.id'))
    goal_description = db.Column(db.Text)
