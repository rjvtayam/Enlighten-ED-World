-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table with verification fields
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    student_id VARCHAR(20) UNIQUE,
    user_type VARCHAR(20) CHECK (user_type IN ('student', 'teacher')) DEFAULT 'student',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token UUID DEFAULT uuid_generate_v4(),
    reset_token UUID,
    reset_token_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_image_url VARCHAR(255),
    bio TEXT,
    has_completed_assessment BOOLEAN DEFAULT FALSE
);

-- Login Attempts Table (for security)
CREATE TABLE login_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE
);

-- User Sessions Table (for managing active sessions)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token UUID DEFAULT uuid_generate_v4(),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OAuth Accounts Table (for linking multiple OAuth providers)
CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider, provider_user_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_login_attempts_user_id ON login_attempts(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider ON oauth_accounts(provider, provider_user_id);

-- Two Factor Authentication Table
CREATE TABLE two_factor_auth (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    secret_key VARCHAR(32) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    author_title VARCHAR(100) NOT NULL,
    author_institution VARCHAR(100) NOT NULL,
    testimonial_text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    author_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- FAQ Tables structure
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faq_answers (
    id SERIAL PRIMARY KEY,
    faq_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faq_id) REFERENCES faqs (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Add trigger for FAQ updated_at
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_answers_updated_at
    BEFORE UPDATE ON faq_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Remove duplicate indexes (these were defined twice)
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_student_id;
DROP INDEX IF EXISTS idx_login_attempts_user;

-- Default FAQs based on capstone objectives
INSERT INTO faqs (question, answer, category) VALUES 
(
    'How does EnlightenED assess my current skills?',
    'EnlightenED uses a comprehensive skill assessment system that evaluates your technical competencies through interactive tests, project submissions, and practical exercises. This assessment helps create your personalized skill profile, which is then used to recommend suitable courses and OJT placements.',
    'Skill Assessment'
),
(
    'How are course recommendations personalized to my needs?',
    'Our AI-powered system analyzes your skill assessment results, learning goals, and industry requirements to recommend courses that will help bridge your skill gaps. The recommendations are continuously updated based on your progress and changing industry demands.',
    'Course Recommendations'
),
(
    'How does the OJT matching system work?',
    'The system matches you with OJT opportunities by comparing your skill profile, interests, and course completions with the requirements of our partner companies. This ensures that you''re placed in an environment where you can apply your skills effectively and continue learning.',
    'OJT Placement'
),
(
    'How can I track my skill improvement over time?',
    'EnlightenED provides a detailed skill tracking dashboard that shows your progress through various assessments, course completions, and practical exercises. You can view your skill growth in different areas and identify areas that need more focus.',
    'Progress Tracking'
),
(
    'What makes EnlightenED different from other learning platforms?',
    'EnlightenED is uniquely designed to bridge the gap between academic learning and industry requirements. Our platform not only provides targeted course recommendations but also ensures practical application through carefully matched OJT placements, creating a complete learning-to-employment pathway.',
    'Platform Features'
);

-- Drop existing assessment-related tables if they exist
DROP TABLE IF EXISTS skill_details CASCADE;
DROP TABLE IF EXISTS skill_category_scores CASCADE;
DROP TABLE IF EXISTS skill_assessments CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS recommended_courses CASCADE;

-- Create new simplified assessment tables
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    program VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    overall_score FLOAT,
    overall_level VARCHAR(20),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE assessment_categories (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    category_name VARCHAR(50) NOT NULL,
    score FLOAT CHECK (score >= 0 AND score <= 100),
    level VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_skills (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES assessment_categories(id) ON DELETE CASCADE,
    skill_name VARCHAR(50) NOT NULL,
    score INTEGER CHECK (score >= 1 AND score <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessment_categories_assessment_id ON assessment_categories(assessment_id);
CREATE INDEX idx_assessment_skills_category_id ON assessment_skills(category_id);