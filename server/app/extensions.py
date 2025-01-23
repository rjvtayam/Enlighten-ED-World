from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import WebApplicationClient
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
login_manager = LoginManager()

# Configure login manager
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.session_protection = 'strong'
login_manager.refresh_view = 'auth.login'
login_manager.needs_refresh_message = 'Please log in again to confirm your identity.'

csrf = CSRFProtect()

# OAuth Clients
oauth_clients = {
    'google': None,
    'github': None
}

def init_oauth(app):
    """Initialize OAuth clients"""
    global oauth_clients
    
    # Initialize Google client with correct scopes
    oauth_clients['google'] = OAuth2Session(
        app.config['GOOGLE_CLIENT_ID'],
        redirect_uri=app.config['GOOGLE_CALLBACK_URL'],
        scope=[
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    )
    
    if not oauth_clients['github']:
        oauth_clients['github'] = OAuth2Session(
            app.config['GITHUB_CLIENT_ID'],
            redirect_uri=app.config['GITHUB_CALLBACK_URL'],
            scope=['user:email']
        )
    
    # Allow OAuth over HTTP in development
    if app.config['ENV'] == 'development':
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    
    return oauth_clients

def get_google_client():
    """Get the Google OAuth client"""
    if not oauth_clients['google']:
        raise RuntimeError("Google OAuth client not initialized")
    return oauth_clients['google']

def get_github_client():
    """Get the GitHub OAuth client"""
    return oauth_clients['github']

@login_manager.unauthorized_handler
def unauthorized():
    from flask import flash, redirect, url_for, request
    flash('You must be logged in to view this page.', 'warning')
    return redirect(url_for('auth.login', next=request.url))