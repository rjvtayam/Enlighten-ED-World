from flask import Flask, Blueprint, render_template, session
from dotenv import load_dotenv
from app.extensions import db, mail, login_manager, csrf, migrate, init_oauth
from .config.config import config as app_config, get_database_url
from flask_session import Session
import os
from app.routes.faq import faq
from app.routes.assessment import assessment, has_completed_assessment
import logging
from datetime import timedelta, datetime
import redis

# Load environment variables
load_dotenv()

def create_app(config_name='default'):
    # Get root path from environment or use current directory
    root_path = os.getenv('ROOT_PATH', os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    server_path = os.path.join(root_path, 'server')
    client_path = os.path.join(root_path, 'client')
    
    app = Flask(
        __name__,
        template_folder=os.path.join(root_path, 'client', 'src', 'pages'),
        static_folder=os.path.join(root_path, 'client', 'src'),  # Point to client/src where CSS/JS files are
        static_url_path=''  # Keep empty URL path for simpler URLs
    )
    
    # Register a second static folder for public assets
    public_bp = Blueprint('public', __name__, 
                         static_folder=os.path.join(root_path, 'client', 'public'),
                         static_url_path='/public')
    app.register_blueprint(public_bp)
    
    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG if app.debug else logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Load configuration
    app.config.from_object(app_config[config_name])
    app_config[config_name].init_app(app) if hasattr(app_config[config_name], 'init_app') else None
    
    # Set a strong secret key
    app.secret_key = os.getenv('SECRET_KEY', 'enlighten-ed-super-secret-key-2024')
    
    # Explicitly set database URL
    database_url = get_database_url()
    if database_url:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        app.logger.info(f"Using database URL: {database_url}")
    else:
        app.logger.error("No database URL configured!")
    
    # Session configuration
    app.config.update(
        # Session configuration
        SESSION_TYPE=os.getenv('SESSION_TYPE', 'redis'),
        SESSION_PERMANENT=True,
        PERMANENT_SESSION_LIFETIME=timedelta(days=7),
        
        # Redis configuration
        SESSION_REDIS=redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379')),
        
        # Session cookie settings
        SESSION_COOKIE_NAME='enlighten_ed_session',
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=os.getenv('SESSION_COOKIE_SECURE', 'false').lower() == 'true',
        SESSION_COOKIE_SAMESITE='Lax',
        
        # Session protection
        SESSION_USE_SIGNER=True,
        SESSION_KEY_PREFIX='enlighten_ed_session:',
        
        # Flask-Login settings
        REMEMBER_COOKIE_DURATION=timedelta(days=7),
        REMEMBER_COOKIE_HTTPONLY=True,
        REMEMBER_COOKIE_SECURE=os.getenv('REMEMBER_COOKIE_SECURE', 'false').lower() == 'true',
        REMEMBER_COOKIE_SAMESITE='Lax',
        
        # CSRF protection
        WTF_CSRF_ENABLED=True,
        WTF_CSRF_SECRET_KEY=os.getenv('WTF_CSRF_SECRET_KEY', app.secret_key)
    )
    
    # Initialize Redis and test connection
    try:
        redis_client = app.config['SESSION_REDIS']
        redis_client.ping()
        app.logger.info("Redis connection successful")
        
        # Initialize Flask-Session
        Session(app)
        app.logger.info("Flask-Session initialized successfully")
        
        # Test session
        with app.test_request_context():
            session['test'] = 'test_value'
            app.logger.info(f"Test session data: {session}")
            if 'test' in session:
                app.logger.info("Session test successful")
            else:
                app.logger.error("Session test failed")
    except Exception as e:
        app.logger.error(f"Session initialization error: {str(e)}")
        raise
    
    # Initialize other extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    csrf.init_app(app)
    login_manager.init_app(app)
    init_oauth(app)
    
    # Register blueprints
    from app.routes.auth import auth
    from app.routes.main import main
    from app.routes.admin import admin
    from app.routes.assessment import assessment
    from app.routes.faq import faq
    from app.routes.testimonials import testimonials
    from .routes.user_dashboard import user_dashboard
    
    app.register_blueprint(auth)
    app.register_blueprint(main)
    app.register_blueprint(admin)
    app.register_blueprint(assessment, url_prefix='/assessment')
    app.register_blueprint(faq)
    app.register_blueprint(testimonials)
    app.register_blueprint(user_dashboard)

    # COURSES BLUEPRINTS
    from app.routes.wmad import wmad
    from app.routes.smp import smp
    from app.routes.netad import netad
    from app.routes.amg import amg
    
    app.register_blueprint(wmad)
    app.register_blueprint(smp)
    app.register_blueprint(netad)
    app.register_blueprint(amg)

    
    # Context processors
    @app.context_processor
    def utility_processor():
        return {
            'has_completed_assessment': has_completed_assessment
        }
    
    # Log configuration for debugging
    app.logger.info(f"Config name: {config_name}")
    app.logger.info(f"Debug mode: {app.debug}")
    app.logger.info(f"Testing mode: {app.testing}")
    app.logger.info(f"Session type: {app.config.get('SESSION_TYPE')}")
    app.logger.info(f"Database URL: {app.config.get('SQLALCHEMY_DATABASE_URI')}")
    app.logger.info(f"Template folder: {app.template_folder}")
    app.logger.info(f"Static folder: {app.static_folder}")
        
    return app

# Create the app instance
app = create_app()
