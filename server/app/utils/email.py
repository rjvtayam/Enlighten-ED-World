from flask import render_template, current_app, url_for
from flask_mail import Message
from app.extensions import mail

def send_verification_email(email, username, token):
    verification_url = url_for('auth.verify_email', 
                             token=token, 
                             _external=True)
    
    msg = Message('Verify Your Email - Enlighten ED',
                 recipients=[email])
    
    msg.html = render_template('email/verify_email.html',
                             username=username,
                             verification_url=verification_url)
    try:
        mail.send(msg)
    except Exception as e:
        # Log the error
        print(f"Error sending verification email: {e}")
        raise

def send_reset_password_email(email, username, token):
    reset_url = url_for('auth.reset_password', 
                       token=token, 
                       _external=True)
    
    msg = Message('Reset Your Password - Enlighten ED',
                 recipients=[email])
    
    msg.html = render_template('email/reset_password.html',
                             username=username,
                             reset_url=reset_url)
    try:
        mail.send(msg)
    except Exception as e:
        # Log the error
        print(f"Error sending reset password email: {e}")
        raise 