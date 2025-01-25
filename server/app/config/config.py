import os
from datetime import timedelta
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

load_dotenv()

def get_database_url():
    """Get database URL and handle Render's postgres:// format"""
    # Try Render's database URL first
    database_url = os.getenv('RENDER_DATABASE_URL')
    if not database_url:
        # Fall back to regular DATABASE_URL
        database_url = os.getenv('DATABASE_URL')
    
    # Convert postgres:// to postgresql:// if needed
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    return database_url

class Config:
    """Base configuration class"""
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # CSRF Protection
    WTF_CSRF_ENABLED = True
    WTF_CSRF_SECRET_KEY = os.getenv('SECRET_KEY')
    WTF_CSRF_TIME_LIMIT = 3600  # 1 hour
    
    # PostgreSQL Database Config
    SQLALCHEMY_DATABASE_URI = get_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'max_overflow': 20,
        'pool_timeout': 30,
        'pool_recycle': 1800,
        'pool_pre_ping': True,
        'connect_args': {
            'sslmode': 'require',
            'connect_timeout': 30,
            'keepalives': 1,
            'keepalives_idle': 30,
            'keepalives_interval': 10,
            'keepalives_count': 5
        }
    }
    
    # Email Configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')
    
    # OAuth Configuration
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_CALLBACK_URL = os.getenv('GOOGLE_CALLBACK_URL', 'https://enlighten-ed-world-hgv2.onrender.com/auth/google/callback')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
    GITHUB_CALLBACK_URL = os.getenv('GITHUB_CALLBACK_URL', 'https://enlighten-ed-world-hgv2.onrender.com/auth/github/callback')
    
    # Session Configuration
    SESSION_TYPE = 'redis'
    SESSION_REDIS = None  # Will be set in init_app
    SESSION_USE_SIGNER = True
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_KEY_PREFIX = 'enlighten_ed_session:'
    
    # Session Cookie Configuration
    SESSION_COOKIE_NAME = 'enlighten_ed_session'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Remember Me Cookie Configuration
    REMEMBER_COOKIE_DURATION = timedelta(days=7)
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SAMESITE = 'Lax'
    
    # Admin configurations
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
    ADMIN_PRIVILEGE_KEY = os.getenv('ADMIN_PRIVILEGE_KEY')

    @staticmethod
    def init_app(app):
        """Initialize application with specific settings"""
        # Initialize Redis connection for sessions
        if os.getenv('REDIS_URL'):
            import redis
            app.config['SESSION_REDIS'] = redis.from_url(os.getenv('REDIS_URL'))
            app.logger.info("Redis session storage configured")
        else:
            app.logger.warning("No REDIS_URL found, sessions will use filesystem")
            app.config['SESSION_TYPE'] = 'filesystem'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False
    OAUTHLIB_INSECURE_TRANSPORT = True
    ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_DOMAIN = '.enlighten-ed-world-hgv2.onrender.com'
    ENV = 'production'

# Dictionary mapping environment names to config classes
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}