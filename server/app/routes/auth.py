from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify, current_app
from flask_login import login_user, logout_user, login_required, current_user
from app.models.user import User, OAuthAccount
from app.extensions import db, mail, csrf, get_google_client, get_github_client
from flask_mail import Message
import uuid
import re
import logging
import secrets
from urllib.parse import urlencode, parse_qs, urlparse
import hashlib
import base64
import requests
from oauthlib.oauth2 import WebApplicationClient
import json
from datetime import datetime, timedelta

#OAuth
from app.utils.oauth import (
    get_google_user_info,
    get_github_user_info,
    handle_oauth_user,
    verify_oauth_state,
    get_google_provider_cfg
)

from app.utils.email import send_reset_password_email

logger = logging.getLogger(__name__)

# Create blueprint
auth = Blueprint('auth', __name__, url_prefix='/auth')

# OAuth configurations
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
GITHUB_API_URL = "https://api.github.com/user"

def get_google_provider_cfg():
    """Get Google's provider configuration"""
    try:
        return requests.get(GOOGLE_DISCOVERY_URL).json()
    except Exception as e:
        logger.error(f"Failed to get Google provider config: {e}")
        return None

def generate_oauth_state(provider):
    """Generate and store OAuth state token"""
    state = secrets.token_urlsafe(32)
    session[f'{provider}_oauth_state'] = state
    return state

def get_google_auth_url(state):
    """Generate Google OAuth URL using WebApplicationClient"""
    client = get_google_client()
    
    # Get Google provider configuration
    google_provider_cfg = get_google_provider_cfg()
    if not google_provider_cfg:
        raise Exception("Failed to get Google provider configuration")
        
    # Get authorization endpoint
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    
    # Prepare request URI
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=current_app.config['GOOGLE_CALLBACK_URL'],
        scope=["openid", "email", "profile"],
        state=state,
        prompt="consent"
    )
    
    logger.info(f"Generated auth URL: {request_uri}")
    return request_uri

def handle_google_callback(code, state):
    """Handle the token exchange with Google"""
    try:
        # Get Google provider configuration
        google_provider_cfg = get_google_provider_cfg()
        if not google_provider_cfg:
            raise Exception("Failed to get Google provider configuration")
            
        # Get token endpoint
        token_endpoint = google_provider_cfg["token_endpoint"]
        logger.info(f"Token endpoint: {token_endpoint}")
        
        # Log OAuth configuration for debugging
        current_app.logger.info("OAuth Configuration:")
        current_app.logger.info(f"Client ID: {current_app.config['GOOGLE_CLIENT_ID']}")
        current_app.logger.info(f"Callback URL: {current_app.config['GOOGLE_CALLBACK_URL']}")
        current_app.logger.info(f"Token Endpoint: {token_endpoint}")

        # Get OAuth client
        client = get_google_client()
        
        # Fetch token
        token = client.fetch_token(
            token_endpoint,
            client_secret=current_app.config['GOOGLE_CLIENT_SECRET'],
            authorization_response=request.url
        )
        
        logger.info(f"Token Response Status: Success")
        
        # Get user info endpoint from Google's discovery document
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        
        # Get user info using the access token
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        
        if userinfo_response.status_code != 200:
            logger.error(f"Failed to get user info: {userinfo_response.text}")
            raise Exception("Failed to get user information from Google")
            
        userinfo = userinfo_response.json()
        logger.info(f"User Info: {json.dumps(userinfo, indent=2)}")
        
        # Return the tokens and user info
        return {
            'access_token': client.token['access_token'],
            'refresh_token': client.token.get('refresh_token'),
            'id_token': client.token.get('id_token'),
            'userinfo': userinfo
        }
        
    except Exception as e:
        logger.error(f"Error in handle_google_callback: {str(e)}")
        raise

def handle_auth_response(status, message, redirect_url=None):
    """Helper function to handle both HTML and JSON responses for auth routes"""
    print(f"Handle auth response - Status: {status}, Message: {message}, Redirect: {redirect_url}")
    print(f"Is authenticated: {current_user.is_authenticated if not current_user.is_anonymous else False}")
    
    response_data = {
        'success': status == 'success',
        'message': message,
        'redirect': redirect_url
    }
    
    # If it's an AJAX request, return JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        response = jsonify(response_data)
        print(f"Sending JSON response: {response_data}")
        return response
    
    # Otherwise, flash message and redirect
    flash(message, status)
    if redirect_url:
        return redirect(redirect_url)
    return redirect(url_for('auth.login' if status == 'success' else request.endpoint))

def generate_verification_token():
    return uuid.uuid4()  # Convert UUID to string

def send_verification_email(user_email, username, token):
    try:
        verification_url = url_for('auth.verify_email', token=str(token), _external=True)
        msg = Message('Verify Your Enlighten ED Account',
                    recipients=[user_email])
        msg.html = render_template('email/verify_email.html',
                                username=username,
                                verification_url=verification_url)
        mail.send(msg)
    except Exception as e:
        current_app.logger.error(f"Error sending email: {str(e)}")
        raise

def generate_pkce_challenge():
    code_verifier = secrets.token_urlsafe(96)
    code_challenge = hashlib.sha256(code_verifier.encode()).digest()
    return code_verifier, base64.urlsafe_b64encode(code_challenge).decode().rstrip('=')

def verify_oauth_state(state, provider):
    """Verify OAuth state token"""
    try:
        if not state:
            logger.error("No state parameter received")
            return False
        
        stored_state = session.get(f'{provider}_oauth_state')
        if not stored_state:
            logger.error(f"No stored state found for {provider}")
            return False
            
        # Compare the states before clearing
        matches = state == stored_state
        if not matches:
            logger.error(f"State mismatch - Received: {state}, Stored: {stored_state}")
        
        # Clear the stored state only if it matches to prevent replay attacks
        if matches:
            session.pop(f'{provider}_oauth_state', None)
            session.modified = True
            
        return matches
        
    except Exception as e:
        logger.error(f"Error verifying OAuth state: {str(e)}")
        return False

def handle_oauth_login(provider, oauth_id, email, username, full_name, access_token, refresh_token=None):
    """Handle OAuth login for both Google and GitHub"""
    try:
        # First try to find user by OAuth credentials
        user = User.query.filter_by(oauth_provider=provider, oauth_id=oauth_id).first()
        
        if not user:
            # If not found by OAuth, try to find by email
            user = User.query.filter_by(email=email).first()
            
            if user:
                # Update existing user with OAuth info
                user.oauth_provider = provider
                user.oauth_id = oauth_id
            else:
                # Create new user
                user = User(
                    username=username,
                    email=email,
                    oauth_provider=provider,
                    oauth_id=oauth_id,
                    is_verified=True,
                    has_completed_assessment=False  # Explicitly set for new users
                )
                db.session.add(user)
                db.session.flush()  # Get user.id
        
        # Update or create OAuth account
        oauth_account = user.oauth_accounts.filter_by(provider=provider).first()
        if oauth_account:
            # Update existing OAuth account
            oauth_account.access_token = access_token
            oauth_account.refresh_token = refresh_token
            oauth_account.provider_user_id = oauth_id
        else:
            # Create new OAuth account
            oauth_account = OAuthAccount(
                user_id=user.id,
                provider=provider,
                provider_user_id=oauth_id,
                access_token=access_token,
                refresh_token=refresh_token
            )
            db.session.add(oauth_account)
        
        # Commit changes
        db.session.commit()
        
        # Log in user
        login_user(user)
        user.update_last_login()
        
        logger.info(f"Successfully logged in user: {user.email}")
        return user
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"OAuth login error: {str(e)}")
        raise

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # If already logged in, redirect to index
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        try:
            email = request.form.get('email')
            password = request.form.get('password')
            remember = bool(request.form.get('remember'))
            next_url = request.args.get('next') or url_for('main.index')

            current_app.logger.info(f"Login attempt for email: {email}")

            if not email or not password:
                flash('Email and password are required', 'error')
                return redirect(url_for('auth.login'))

            user = User.query.filter_by(email=email.lower()).first()
            current_app.logger.debug(f"User found: {user is not None}")
            
            if user and user.verify_password(password):
                current_app.logger.debug("Password verified successfully")
                
                # Check if email is verified
                if not user.is_verified:
                    current_app.logger.warning(f"Unverified email attempt: {email}")
                    flash('Please verify your email before logging in.', 'warning')
                    try:
                        if user.verification_token:
                            send_verification_email(user.email, user.username, user.verification_token)
                    except Exception as e:
                        current_app.logger.error(f"Failed to resend verification email: {str(e)}")
                    return render_template('auth/login.html')

                try:
                    # Record successful login attempt
                    user.record_login_attempt(request.remote_addr, success=True)
                    
                    # Clear any existing session data
                    session.clear()
                    current_app.logger.debug("Session cleared")
                    
                    # Create a new session ID
                    session['_id'] = secrets.token_urlsafe(32)
                    session['_fresh'] = True
                    session.permanent = True
                    current_app.logger.debug("New session created")
                    
                    # Update last login time and commit
                    user.last_login = datetime.utcnow()
                    db.session.commit()
                    current_app.logger.debug("Last login time updated")
                    
                    # Create user session record
                    user_session = user.create_session(
                        ip_address=request.remote_addr,
                        user_agent=request.user_agent.string
                    )
                    current_app.logger.debug(f"User session created: {user_session.id}")
                    
                    # Log the user in with remember me
                    login_success = login_user(user, remember=remember, fresh=True)
                    if not login_success:
                        raise Exception("Failed to create user session")
                    current_app.logger.debug("User logged in successfully")
                    
                    # Store user info in session
                    session['user_id'] = user.id
                    session['email'] = user.email
                    session['login_time'] = datetime.utcnow().isoformat()
                    session['session_id'] = str(user_session.session_token)
                    
                    # Force session save
                    session.modified = True
                    current_app.logger.info(f"Login successful for user: {email}")
                    
                    # Check if assessment is needed
                    if not user.has_completed_assessment:
                        assessment_url = url_for('assessment.initial_assessment')  # Updated route name
                        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                            return jsonify({
                                'success': True,
                                'redirect': assessment_url,
                                'message': 'Welcome! Please complete the assessment to personalize your learning journey.'
                            })
                        else:
                            flash('Welcome! Please complete the assessment to personalize your learning journey.', 'info')
                            return redirect(assessment_url)
                    
                    # Return JSON response for AJAX or redirect for form submit
                    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return jsonify({
                            'success': True,
                            'redirect': next_url,
                            'message': 'Login successful'
                        })
                    else:
                        return redirect(next_url)
                    
                except Exception as e:
                    db.session.rollback()
                    current_app.logger.error(f"Session/login error for {email}: {str(e)}")
                    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return jsonify({
                            'success': False,
                            'message': 'An error occurred during login'
                        }), 500
                    else:
                        flash('An error occurred during login. Please try again.', 'error')
                        return render_template('auth/login.html')
            else:
                # Record failed login attempt
                if user:
                    user.record_login_attempt(request.remote_addr, success=False)
                current_app.logger.warning(f"Invalid login attempt for email: {email}")
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({
                        'success': False,
                        'message': 'Invalid email or password'
                    }), 401
                else:
                    flash('Invalid email or password', 'error')
                    return render_template('auth/login.html')

        except Exception as e:
            current_app.logger.error(f"Unexpected login error: {str(e)}")
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({
                    'success': False,
                    'message': 'An unexpected error occurred'
                }), 500
            else:
                flash('An unexpected error occurred. Please try again.', 'error')
                return render_template('auth/login.html')

    # GET request - show login form
    return render_template('auth/login.html')

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        student_id = request.form.get('student_id')
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('user_type', 'student')  

        if not all([student_id, username, email, password]):
            flash('All fields are required', 'error')
            return redirect(url_for('auth.register'))

        # Validate student ID format (XXXX-XXXX)
        if not re.match(r'^\d{4}-\d{4}$', student_id):
            flash('Invalid student ID format. Please use XXXX-XXXX format.', 'error')
            return redirect(url_for('auth.register'))

        try:
            # Check if user already exists
            if User.query.filter_by(email=email).first():
                flash('Email already registered', 'error')
                return redirect(url_for('auth.register'))
            if User.query.filter_by(student_id=student_id).first():
                flash('Student ID already registered', 'error')
                return redirect(url_for('auth.register'))
            if User.query.filter_by(username=username).first():
                flash('Username already taken', 'error')
                return redirect(url_for('auth.register'))

            # Create new user
            user = User(
                username=username,
                email=email,
                student_id=student_id,
                user_type=role,
                has_completed_assessment=False  # Explicitly set for new users
            )
            user.set_password(password)
            
            # Save to database
            db.session.add(user)
            db.session.commit()
            
            # Send verification email
            verification_token = uuid.uuid4()
            send_verification_email(email, username, str(verification_token))
            
            # Store email in session and redirect
            session['registration_email'] = email
            return redirect(url_for('auth.verify_success'))
                
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Registration error: {str(e)}")
            flash('Registration failed. Please try again.', 'error')
            return redirect(url_for('auth.register'))

    return render_template('auth/register.html')

@auth.route('/verify-success')
def verify_success():
    email = session.get('registration_email')
    if not email:
        flash('Please register first', 'info')
        return redirect(url_for('auth.register'))
    
    # Show the success page
    return render_template('email/verify_success.html', email=email)

@auth.route('/verify-email/<token>')
def verify_email(token):
    try:
        # Convert string token to UUID for query
        token_uuid = uuid.UUID(token)
        user = User.query.filter_by(verification_token=token_uuid).first()
        
        if not user:
            flash('Invalid or expired verification link.', 'error')
            return redirect(url_for('auth.login'))
            
        if user.is_verified:
            flash('Email already verified. Please login.', 'info')
            return redirect(url_for('auth.login'))
            
        # Verify user
        user.is_verified = True
        user.verification_token = None  # Clear the token after verification
        db.session.commit()
        
        flash('Email verified successfully! You can now login.', 'success')
        return redirect(url_for('auth.login'))
        
    except ValueError as e:
        flash('Invalid verification link.', 'error')
        return redirect(url_for('auth.login'))
    except Exception as e:
        current_app.logger.error(f"Email verification error: {str(e)}")
        flash('Email verification failed. Please try again.', 'error')
        return redirect(url_for('auth.login'))

@auth.route('/google/login')
def google_login():
    """Initiate Google OAuth login"""
    try:
        # Get Google provider configuration
        google_provider_cfg = get_google_provider_cfg()
        if not google_provider_cfg:
            raise Exception("Failed to get Google provider configuration")

        # Get authorization endpoint
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]
        logger.info(f"Authorization endpoint: {authorization_endpoint}")

        # Generate state once and store it
        state = generate_oauth_state('google')
        logger.info(f"Generated state: {state}")
        
        # Get OAuth client
        client = get_google_client()
        if not client:
            raise Exception("Google OAuth client not initialized")
        
        # Generate authorization URL using authorization_url method
        authorization_url, _ = client.authorization_url(
            authorization_endpoint,
            state=state,
            access_type="offline",  # Get refresh token
            prompt="consent",       # Force consent screen
            include_granted_scopes="true",  # Enable incremental authorization
            scope=["openid", "email", "profile"]
        )
        
        logger.info(f"Generated auth URL: {authorization_url}")
        return redirect(authorization_url)

    except Exception as e:
        logger.error(f"Google login initiation error: {str(e)}")
        flash('Unable to initiate Google login', 'error')
        return redirect(url_for('auth.login'))

@auth.route('/google/callback')
def google_callback():
    """Handle Google OAuth callback"""
    try:
        # Get state and code from request
        error = request.args.get('error')
        if error:
            raise Exception(f"Google OAuth error: {error}")

        # Get Google provider configuration
        google_provider_cfg = get_google_provider_cfg()
        if not google_provider_cfg:
            raise Exception("Failed to get Google provider configuration")
            
        token_endpoint = google_provider_cfg["token_endpoint"]
        
        # Get OAuth client
        client = get_google_client()
        if not client:
            raise Exception("Google OAuth client not initialized")
        
        # Fetch token using OAuth2Session
        token = client.fetch_token(
            token_endpoint,
            authorization_response=request.url,
            client_secret=current_app.config['GOOGLE_CLIENT_SECRET']
        )
        
        logger.info("Token fetched successfully")
        
        # Get user info endpoint from Google's discovery document
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        
        # Get user info using the OAuth2Session client
        resp = client.get(userinfo_endpoint)
        if resp.status_code != 200:
            raise Exception(f"Failed to get user info: {resp.text}")
            
        userinfo = resp.json()
        
        if not userinfo.get("email_verified"):
            raise Exception("Google account email not verified")
            
        # Handle OAuth user
        user = handle_oauth_user(
            provider='google',
            user_data=userinfo,
            access_token=token['access_token'],
            refresh_token=token.get('refresh_token')
        )
        
        # Login user
        login_user(user)
        
        # Check if assessment is needed
        if not user.has_completed_assessment:
            flash('Welcome! Please complete the assessment to personalize your learning journey.', 'info')
            return redirect(url_for('assessment.initial_assessment'))
            
        flash('Successfully logged in with Google!', 'success')
        return redirect(url_for('main.index'))

    except Exception as e:
        logger.error(f"Google callback error: {str(e)}")
        flash('Failed to complete Google authentication', 'error')
        return redirect(url_for('auth.login'))

@auth.route('/github/login')
def github_login():
    """Initiate GitHub OAuth login"""
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    try:
        # Generate state
        state = generate_oauth_state('github')
        logger.info(f"Generated state: {state}")
        
        # Get GitHub OAuth client
        client = get_github_client()
        if not client:
            raise Exception("GitHub OAuth client not initialized")
        
        # Generate authorization URL
        authorization_url, state = client.authorization_url(
            'https://github.com/login/oauth/authorize'
        )
        
        logger.info(f"Generated auth URL: {authorization_url}")
        return redirect(authorization_url)
        
    except Exception as e:
        logger.error(f"GitHub login initiation error: {str(e)}")
        flash('Unable to initiate GitHub login', 'error')
        return redirect(url_for('auth.login'))

@auth.route('/github/callback')
def github_callback():
    """Handle GitHub OAuth callback"""
    try:
        # Check for errors
        error = request.args.get('error')
        if error:
            raise Exception(f"GitHub OAuth error: {error}")

        # Get OAuth client
        client = get_github_client()
        if not client:
            raise Exception("GitHub OAuth client not initialized")
        
        # Fetch token using OAuth2Session
        token = client.fetch_token(
            'https://github.com/login/oauth/access_token',
            authorization_response=request.url,
            client_secret=current_app.config['GITHUB_CLIENT_SECRET']
        )
        
        logger.info("Token fetched successfully")
        
        # Get user info using the OAuth2Session client
        resp = client.get('https://api.github.com/user')
        if resp.status_code != 200:
            raise Exception(f"Failed to get user info: {resp.text}")
            
        user_data = resp.json()
        
        # Get user email (GitHub needs separate request for email)
        email_resp = client.get('https://api.github.com/user/emails')
        if email_resp.status_code != 200:
            raise Exception(f"Failed to get user emails: {email_resp.text}")
            
        emails = email_resp.json()
        primary_email = next((email['email'] for email in emails if email['primary'] and email['verified']), None)
        
        if not primary_email:
            raise Exception("No verified primary email found in GitHub account")
        
        user_data['email'] = primary_email
        
        # Handle OAuth user
        user = handle_oauth_user(
            provider='github',
            user_data=user_data,
            access_token=token['access_token']
        )
        
        # Login user
        login_user(user)
        
        # Check if assessment is needed
        if not user.has_completed_assessment:
            flash('Welcome! Please complete the assessment to personalize your learning journey.', 'info')
            return redirect(url_for('assessment.initial_assessment'))
            
        flash('Successfully logged in with GitHub!', 'success')
        return redirect(url_for('main.index'))

    except Exception as e:
        logger.error(f"GitHub callback error: {str(e)}")
        flash('Failed to complete GitHub authentication', 'error')
        return redirect(url_for('auth.login'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    # Clear admin session if exists
    session.pop('is_admin', None)
    return handle_auth_response('success', 'You have been logged out successfully.', url_for('main.index'))

@auth.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.get_by_email(email)
        
        if user:
            token = user.create_reset_token()
            send_reset_password_email(email, user.username, token)
            
        return handle_auth_response('success', 'If an account exists with that email, you will receive a password reset link.', url_for('auth.login'))
        
    return render_template('auth/forgot_password.html')

@auth.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    user = User.verify_reset_token(token)
    if not user:
        return handle_auth_response('error', 'Invalid or expired reset link')

    if request.method == 'POST':
        password = request.form.get('password')
        user.update_password(password)
        return handle_auth_response('success', 'Your password has been updated', url_for('auth.login'))
        
    return render_template('auth/reset_password.html', token=token)

@auth.route('/verify-privilege-key', methods=['POST'])
def verify_privilege_key():
    """Verify admin privilege key"""
    key = request.form.get('privilege_key')
    if not key:
        return jsonify({'success': False, 'message': 'Privilege key is required'}), 400
    
    try:
        # Compare with environment variable
        admin_privilege_key = current_app.config['ADMIN_PRIVILEGE_KEY']
        is_valid = key == admin_privilege_key
        
        return jsonify({
            'success': is_valid,
            'message': 'Key verified successfully' if is_valid else 'Invalid privilege key'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': 'Verification failed'}), 500

@auth.route('/admin-login', methods=['POST'])
def admin_login():
    """Handle admin login"""
    try:
        username = request.form.get('username')
        password = request.form.get('password')
        privilege_key = request.form.get('privilege_key')

        # Get admin credentials from environment variables
        admin_username = current_app.config['ADMIN_USERNAME']
        admin_password = current_app.config['ADMIN_PASSWORD']
        admin_privilege_key = current_app.config['ADMIN_PRIVILEGE_KEY']

        # First verify privilege key
        if privilege_key != admin_privilege_key:
            return handle_auth_response('error', 'Invalid privilege key')

        # Then verify admin credentials
        if username == admin_username and password == admin_password:
            # Create session for admin
            session['is_admin'] = True
            return handle_auth_response('success', 'Welcome back, Administrator!', url_for('admin.dashboard'))
        
        return handle_auth_response('error', 'Invalid admin credentials')

    except Exception as e:
        return handle_auth_response('error', 'Login failed. Please try again.')

@auth.route('/status')
def auth_status():
    """Check authentication status"""
    is_auth = current_user.is_authenticated
    user_data = None
    if is_auth:
        user_data = {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'user_type': current_user.user_type,
            'is_verified': current_user.is_verified,
            'profile_image_url': current_user.profile_image_url,
            'bio': current_user.bio,
            'has_completed_assessment': current_user.has_completed_assessment
        }
    return jsonify({
        'is_authenticated': is_auth,
        'user': user_data
    })