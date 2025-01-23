from flask import current_app
import requests
from datetime import datetime, timedelta
import logging
from app.models.user import User, OAuthAccount
from app.extensions import db, get_google_client, get_github_client
from urllib.parse import urlencode
import json

logger = logging.getLogger(__name__)

# OAuth endpoints
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
GITHUB_API_URL = "https://api.github.com"

def get_google_provider_cfg():
    """Get Google's provider configuration"""
    try:
        return requests.get(GOOGLE_DISCOVERY_URL).json()
    except Exception as e:
        logger.error(f"Failed to get Google provider config: {e}")
        return None

def get_google_user_info(access_token: str) -> dict:
    """Get Google user info using access token"""
    try:
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Error getting Google user info: {str(e)}")
        raise

def get_github_user_info(access_token: str) -> dict:
    """Get GitHub user info and email using OAuth2Session"""
    try:
        github_client = get_github_client()
        
        # Get user profile
        response = github_client.get(f'{GITHUB_API_URL}/user')
        response.raise_for_status()
        user_data = response.json()
        
        # Get user email
        email_response = github_client.get(f'{GITHUB_API_URL}/user/emails')
        email_response.raise_for_status()
        emails = email_response.json()
        
        primary_email = next(
            (email['email'] for email in emails if email['primary'] and email['verified']),
            None
        )
        
        if not primary_email:
            raise ValueError("No verified primary email found in GitHub account")
            
        user_data['email'] = primary_email
        return user_data
    except Exception as e:
        logger.error(f"Error getting GitHub user info: {str(e)}")
        raise

def handle_oauth_user(provider: str, user_data: dict, access_token: str, refresh_token: str = None) -> User:
    """Handle OAuth user creation/update for both providers"""
    try:
        # Get provider-specific data
        if provider == 'google':
            provider_user_id = user_data['sub']
            email = user_data['email']
            username = user_data.get('name', email.split('@')[0])
            profile_image = user_data.get('picture')
        else:  # github
            provider_user_id = str(user_data['id'])
            email = user_data['email']
            username = user_data.get('login', email.split('@')[0])
            profile_image = user_data.get('avatar_url')

        # Check if OAuth account exists
        oauth_account = OAuthAccount.query.filter_by(
            provider=provider,
            provider_user_id=provider_user_id
        ).first()

        if oauth_account:
            # Update existing OAuth account
            oauth_account.access_token = access_token
            if refresh_token:
                oauth_account.refresh_token = refresh_token
            user = oauth_account.user
            
            # Ensure user is verified and update profile
            if not user.is_verified:
                user.is_verified = True
            if profile_image:
                user.profile_image_url = profile_image
        else:
            # Check if user exists with this email
            user = User.query.filter_by(email=email).first()
            
            if not user:
                # Create new user
                user = User(
                    username=username,
                    email=email,
                    is_verified=True,
                    profile_image_url=profile_image
                )
                db.session.add(user)
                db.session.flush()  # Get user.id
            
            # Create new OAuth account
            oauth_account = OAuthAccount(
                user_id=user.id,
                provider=provider,
                provider_user_id=provider_user_id,
                access_token=access_token,
                refresh_token=refresh_token
            )
            db.session.add(oauth_account)
        
        # Update user's last login
        user.last_login = datetime.utcnow()
        
        # Commit all changes
        db.session.commit()
        return user
            
    except Exception as e:
        logger.error(f"Error handling OAuth user: {str(e)}")
        db.session.rollback()
        raise

def verify_oauth_state(state: str, stored_state: str) -> bool:
    """Verify OAuth state token"""
    try:
        if not state or not stored_state:
            logger.error("Missing state or stored_state")
            return False
            
        # Simple string comparison for state verification
        return state == stored_state
            
    except Exception as e:
        logger.error(f"Error verifying OAuth state: {str(e)}")
        return False
