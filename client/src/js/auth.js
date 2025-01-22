document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Initialize form validation
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        initializeFormValidation(form);
    });

    // Initialize password toggles
    initializePasswordToggles();

    // Initialize user/admin toggle if on login page
    initializeUserAdminToggle();

    initializeAdminLogin();
}

function initializeFormValidation(form) {
    const inputs = form.querySelectorAll('input[required]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Store original button text
    if (submitBtn) {
        submitBtn.dataset.originalText = submitBtn.innerHTML;
    }

    // Add validation on input
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate all required inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showError('Please fill in all required fields correctly.');
            return;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }

        // Submit the form
        const formData = new FormData(form);
        submitForm(form, formData);
    });
}

function submitForm(form, formData) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    // Get CSRF token from meta tag or form
    let csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (!csrfToken) {
        csrfToken = form.querySelector('input[name="csrf_token"]')?.value;
    }
    if (!csrfToken) {
        console.error('CSRF token not found');
        showError('Security token missing. Please refresh the page and try again.');
        return;
    }

    fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams(formData),
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.redirected) {
            window.location.href = response.url;
            return null;
        }
        return response.json().catch(() => response.text());
    })
    .then(data => {
        if (data === null) {
            // Emit auth success event before redirect
            window.dispatchEvent(new Event('authSuccess'));
            return;
        }

        if (typeof data === 'object') {
            // Handle JSON response
            if (data.success) {
                // Emit auth success event
                window.dispatchEvent(new Event('authSuccess'));
                
                if (data.message) {
                    showSuccess(data.message);
                }
                if (data.redirect) {
                    setTimeout(() => window.location.href = data.redirect, 1000);
                }
            } else {
                showError(data.message || 'An error occurred');
            }
        } else {
            // Handle HTML response
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            
            // Handle flash messages
            handleFlashMessages(doc);

            // Check for form errors
            const formErrors = doc.querySelectorAll('.error-message, .alert-error');
            if (formErrors.length > 0) {
                formErrors.forEach(error => {
                    showError(error.textContent.trim());
                });
            }
        }

        // Reset form on success
        if (data.success || doc?.querySelector('.alert-success')) {
            form.reset();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
        }
    });
}

function handleFlashMessages(doc) {
    const flashMessages = doc.querySelectorAll('.alert');
    const flashContainer = document.getElementById('flash-messages');
    
    if (flashContainer) {
        flashContainer.innerHTML = '';
        
        flashMessages.forEach(flash => {
            const message = flash.textContent.trim();
            const isSuccess = flash.classList.contains('alert-success');
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${isSuccess ? 'success' : 'error'} fade-in`;
            alertDiv.innerHTML = `
                <div class="alert-content">
                    <i class="fas fa-${isSuccess ? 'check' : 'exclamation'}-circle"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="alert-close" onclick="this.parentElement.remove()">&times;</button>
            `;
            
            flashContainer.appendChild(alertDiv);
        });
    }
}

function validateInput(input) {
    const value = input.value.trim();
    const formGroup = input.closest('.form-group');
    let isValid = true;
    let errorMessage = '';

    // Basic required field validation
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (input.type === 'email' && !validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    // Password validation
    else if (input.type === 'password' && input.name === 'password' && value.length < 8) {
        isValid = false;
        errorMessage = 'Password must be at least 8 characters long';
    }

    // Update UI
    if (formGroup) {
        formGroup.classList.toggle('has-error', !isValid);
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message if invalid
        if (!isValid) {
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = errorMessage;
            formGroup.appendChild(errorSpan);
        }
    }

    return isValid;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initializePasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleBtn = input.parentElement?.querySelector('.password-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const isHidden = input.type === 'password';
                input.type = isHidden ? 'text' : 'password';
                this.classList.toggle('password-hidden');
                this.classList.toggle('password-visible');
            });
        }
    });
}

function initializeUserAdminToggle() {
    const userToggle = document.querySelector('[data-form="user-form"]');
    const adminToggle = document.querySelector('[data-form="admin-form"]');
    
    if (!userToggle || !adminToggle) return;

    const userForm = document.getElementById('user-form');
    const adminForm = document.getElementById('admin-form');
    const userHeader = document.getElementById('userHeader');
    const adminHeader = document.getElementById('adminHeader');
    const socialSection = document.getElementById('social-section');

    userToggle.addEventListener('click', () => {
        userToggle.classList.add('active');
        adminToggle.classList.remove('active');
        userForm.style.display = 'block';
        adminForm.style.display = 'none';
        userHeader.style.display = 'block';
        adminHeader.style.display = 'none';
        socialSection.style.display = 'block';
    });

    adminToggle.addEventListener('click', () => {
        adminToggle.classList.add('active');
        userToggle.classList.remove('active');
        adminForm.style.display = 'block';
        userForm.style.display = 'none';
        adminHeader.style.display = 'block';
        userHeader.style.display = 'none';
        socialSection.style.display = 'none';
    });
}

function showError(message) {
    const flashContainer = document.getElementById('flash-messages');
    if (!flashContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error fade-in';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Clear existing messages
    flashContainer.innerHTML = '';
    flashContainer.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    const flashContainer = document.getElementById('flash-messages');
    if (!flashContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success fade-in';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Clear existing messages
    flashContainer.innerHTML = '';
    flashContainer.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function initializeAdminLogin() {
    const privilegeKeySection = document.getElementById('privilege-key-section');
    const adminCredentials = document.getElementById('admin-credentials');
    const verifyKeyBtn = document.getElementById('verifyKeyBtn');
    
    if (verifyKeyBtn) {
        verifyKeyBtn.addEventListener('click', async function() {
            const privilegeKey = document.getElementById('privilegeKey').value;
            
            if (!privilegeKey) {
                showError('Please enter the privilege key');
                return;
            }
            
            try {
                const response = await fetch('/auth/verify-privilege-key', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': document.querySelector('[name=csrf_token]').value
                    },
                    body: new URLSearchParams({
                        'privilege_key': privilegeKey
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show admin credentials form
                    privilegeKeySection.style.display = 'none';
                    adminCredentials.style.display = 'block';
                    showSuccess('Privilege key verified successfully');
                } else {
                    showError(data.message || 'Invalid privilege key');
                }
            } catch (error) {
                showError('Verification failed. Please try again.');
            }
        });
    }
}