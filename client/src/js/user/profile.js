// Enhanced File Upload Validation
function validateFileUpload(file, maxSizeInMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        showNotification(`File size exceeds ${maxSizeInMB}MB limit`, 'error');
        return false;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload an image (JPEG, PNG, GIF)', 'error');
        return false;
    }

    return true;
}

// Enhanced File Upload Handlers
function initializeFileUploads() {
    const avatarInput = document.getElementById('avatarInput');
    const coverInput = document.getElementById('coverInput');

    if (avatarInput) {
        avatarInput.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Validate file before upload
                if (!validateFileUpload(file)) {
                    this.value = ''; // Clear the input
                    return;
                }

                const formData = new FormData();
                formData.append('avatar', file);
                
                try {
                    showLoadingState(avatarInput.closest('.profile-avatar'));
                    
                    const response = await fetch('/update-avatar', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        // Update avatar image
                        const avatarImg = document.querySelector('.profile-avatar img');
                        if (avatarImg) {
                            avatarImg.src = data.avatar_url;
                        }
                        showNotification('Avatar updated successfully', 'success');
                    } else {
                        showNotification(data.error || 'Failed to update avatar', 'error');
                    }
                } catch (error) {
                    console.error('Avatar upload error:', error);
                    showNotification('Network error. Please try again.', 'error');
                } finally {
                    hideLoadingState(avatarInput.closest('.profile-avatar'));
                }
            }
        });
    }

    if (coverInput) {
        coverInput.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Validate file before upload
                if (!validateFileUpload(file)) {
                    this.value = ''; // Clear the input
                    return;
                }

                const formData = new FormData();
                formData.append('cover', file);
                
                try {
                    showLoadingState(document.querySelector('.cover-photo'));
                    
                    const response = await fetch('/update-cover', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        // Update cover photo
                        const coverPhoto = document.querySelector('.cover-photo');
                        if (coverPhoto) {
                            coverPhoto.style.backgroundImage = `url('${data.cover_url}')`;
                        }
                        showNotification('Cover photo updated successfully', 'success');
                    } else {
                        showNotification(data.error || 'Failed to update cover photo', 'error');
                    }
                } catch (error) {
                    console.error('Cover photo upload error:', error);
                    showNotification('Network error. Please try again.', 'error');
                } finally {
                    hideLoadingState(document.querySelector('.cover-photo'));
                }
            }
        });
    }
}

// Enhanced Form Validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('invalid');
            isValid = false;
        } else {
            emailField.classList.remove('invalid');
        }
    }

    return isValid;
}

// Enhanced Form Submission Handler
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form before submission
            if (!validateForm(this)) {
                showNotification('Please fill out all required fields correctly', 'error');
                return;
            }

            const formData = new FormData(this);
            const url = this.getAttribute('action');
            
            try {
                showLoadingState(this);
                
                const response = await fetch(url, {
                    method: this.method,
                    body: formData,
                    headers: {
                        'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
                    }
                });

                const data = await response.json();
                
                if (response.ok) {
                    showNotification('Profile updated successfully', 'success');
                    // Optionally update UI with new data
                    updateProfileData(data);
                } else {
                    showNotification(data.error || 'Update failed', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Network error. Please try again.', 'error');
            } finally {
                hideLoadingState(this);
            }
        });
    });
}

// Add CSS for invalid form fields
function addInvalidFieldStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .invalid {
            border: 2px solid var(--error-color) !important;
            animation: shake 0.3s;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    addInvalidFieldStyles();
    initializeFileUploads();
    initializeForms();
    
    // Initialize tab switching
    initializeTabs();
    
    // Initialize form submissions
    initializeForms();
    
    // Initialize modals
    initializeModals();
    
    // Initialize password inputs
    initializePasswordInputs();
    
    initializeSmoothScroll();
    initializeScrollAnimations();
    
    // Initialize charts for the active tab
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        if (activeTab.id === 'study-progress') {
            initializeStudyCharts();
        } else if (activeTab.id === 'overview') {
            initializeSkillCharts();
        }
    }
});

// Tab Switching
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.profile-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.profile-content .tab-content');

    // Show initial tab
    const initialTab = window.location.hash ? 
        window.location.hash.slice(1) : 'overview';
    
    function showTab(tabId) {
        // Hide all tab contents first
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        
        // Remove active class from all buttons
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content and activate button
        const selectedContent = document.getElementById(tabId);
        const selectedBtn = document.querySelector(`.profile-tabs [data-tab="${tabId}"]`);
        
        if (selectedContent && selectedBtn) {
            selectedContent.style.display = 'block';
            setTimeout(() => {
                selectedContent.classList.add('active');
            }, 10);
            selectedBtn.classList.add('active');
            
            // Initialize charts if this is the study progress tab
            if (tabId === 'study-progress') {
                initializeStudyCharts();
            }
            
            // Initialize skill charts if this is the overview tab
            if (tabId === 'overview') {
                initializeSkillCharts();
            }
        }
    }

    // Add click handlers to tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = btn.dataset.tab;
            showTab(tabId);
            history.pushState(null, '', `#${tabId}`);
        });
    });

    // Show initial tab
    showTab(initialTab);

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const tabId = window.location.hash.slice(1) || 'overview';
        showTab(tabId);
    });
}

// Modal Handling
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });

        // Close button functionality
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal.id));
        }
    });

    // Initialize form submissions
    document.querySelectorAll('.modal-form').forEach(form => {
        form.addEventListener('submit', handleModalFormSubmit);
    });
}

async function handleModalFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Changes saved successfully!', 'success');
            updateProfileData(data.profile);
            closeModal(form.closest('.modal').id);
        } else {
            throw new Error(data.error || 'Failed to save changes');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
}

function updateProfileData(profileData) {
    // Update profile information in real-time
    const elements = {
        fullName: document.querySelector('.profile-name h1'),
        headline: document.querySelector('.headline'),
        bio: document.querySelector('.bio-content'),
        location: document.querySelector('.location'),
        email: document.querySelector('.email'),
        avatar: document.querySelector('.profile-avatar img'),
        coverPhoto: document.querySelector('.cover-photo')
    };

    if (profileData.full_name) elements.fullName.textContent = profileData.full_name;
    if (profileData.headline) elements.headline.textContent = profileData.headline;
    if (profileData.bio) elements.bio.textContent = profileData.bio;
    if (profileData.location) {
        elements.location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${profileData.location}`;
    }
    if (profileData.email) elements.email.textContent = profileData.email;
    if (profileData.avatar_url) {
        elements.avatar.src = `/static/uploads/${profileData.avatar_url}`;
    }
    if (profileData.cover_image_url) {
        elements.coverPhoto.style.backgroundImage = `url('/static/uploads/${profileData.cover_image_url}')`;
    }
}

// Password Management
function initializePasswordInputs() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength checker
    const newPasswordInput = document.querySelector('input[name="new_password"]');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', checkPasswordStrength);
    }
}

function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Remove existing classes
    strengthBar.className = 'strength-bar';
    
    if (password.length === 0) {
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Update UI based on strength
    if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Medium';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong';
    }
}

// Add smooth scrolling to profile sections
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize intersection observer for animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.content-section, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Add these functions for chart initialization
function initializeSkillCharts() {
    // Initialize skill category chart
    const ctx = document.getElementById('mainSpiderChart');
    if (ctx) {
        const data = {
            labels: Object.keys(skillCategories),
            datasets: [{
                data: Object.values(skillCategories).map(cat => cat.percentage),
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)'
            }]
        };

        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function initializeStudyCharts() {
    // Initialize study time chart
    const timeCtx = document.getElementById('studyTimeChart');
    if (timeCtx) {
        const studyTimeChart = new Chart(timeCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: [4, 3.5, 5, 2, 4.5, 6, 3],
                    borderColor: 'rgba(99, 102, 241, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Initialize task completion chart
    const taskCtx = document.getElementById('taskCompletionChart');
    if (taskCtx) {
        const taskChart = new Chart(taskCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tasks Completed',
                    data: [3, 4, 2, 5, 3, 1, 4],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

function initializeProfileAnimations() {
    // Animate stats counting
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        animateValue(stat, 0, target, 2000);
    });

    // Initialize skill tags animation
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 100}ms`;
    });

    // Initialize timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 200}ms`;
    });
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Enhanced tab switching with smooth transitions
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.profile-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.profile-content .tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    content.classList.remove('active');
                }, 300);
            });

            // Add active classes with animation
            btn.classList.add('active');
            const selectedContent = document.getElementById(target);
            setTimeout(() => {
                selectedContent.classList.add('active');
                selectedContent.style.opacity = '1';
                selectedContent.style.transform = 'translateY(0)';
            }, 300);
        });
    });
}

// Add these functions to your profile.js
function toggleBioEdit() {
    const displayEl = document.getElementById('bioDisplay');
    const editEl = document.getElementById('bioEdit');
    const bioText = document.getElementById('bioText');

    displayEl.style.display = 'none';
    editEl.style.display = 'block';
    bioText.focus();
}

async function saveBio() {
    const bioText = document.getElementById('bioText').value;
    const displayEl = document.getElementById('bioDisplay');
    const editEl = document.getElementById('bioEdit');
    const saveBtn = editEl.querySelector('button[onclick="saveBio()"]');
    
    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const response = await fetch('/update-bio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ bio: bioText })
        });

        const data = await response.json();
        if (data.success) {
            displayEl.innerHTML = data.bio || 'No bio added yet.';
            displayEl.style.display = 'block';
            editEl.style.display = 'none';
            showNotification('Bio updated successfully', 'success');
        } else {
            throw new Error(data.error || 'Failed to update bio');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to update bio', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Save';
    }
}

function cancelBioEdit() {
    const displayEl = document.getElementById('bioDisplay');
    const editEl = document.getElementById('bioEdit');
    
    displayEl.style.display = 'block';
    editEl.style.display = 'none';
}

async function deleteBio() {
    if (!confirm('Are you sure you want to delete your bio?')) return;

    try {
        const response = await fetch('/delete-bio', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('bioDisplay').innerHTML = 'No bio added yet.';
            document.getElementById('bioText').value = '';
            cancelBioEdit();
            showNotification('Bio deleted successfully', 'success');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to delete bio', 'error');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Account Management Functions
function exportUserData() {
    fetch('/export-user-data')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user-data.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('error', 'Failed to export data. Please try again.');
        });
}

function deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
        fetch('/deactivate-account', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/logout';
            } else {
                showNotification('error', data.error || 'Failed to deactivate account.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('error', 'An error occurred. Please try again.');
        });
    }
}

function deleteAccount() {
    if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
        const password = prompt('Please enter your password to confirm:');
        if (password) {
            fetch('/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/logout';
                } else {
                    showNotification('error', data.error || 'Failed to delete account.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('error', 'An error occurred. Please try again.');
            });
        }
    }
}

// 2FA Setup
function initiate2FASetup() {
    fetch('/generate-2fa-setup')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('qrCode').src = data.qr_code;
                document.getElementById('secretKey').textContent = data.secret_key;
                openEditModal('setup2FA');
            } else {
                showNotification('error', data.error || 'Failed to setup 2FA');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('error', 'Failed to initiate 2FA setup');
        });
}

function copySecretKey() {
    const secretKey = document.getElementById('secretKey').textContent;
    navigator.clipboard.writeText(secretKey)
        .then(() => showNotification('success', 'Secret key copied to clipboard'))
        .catch(() => showNotification('error', 'Failed to copy secret key'));
}

function downloadRecoveryCodes() {
    const codes = Array.from(document.querySelectorAll('#recoveryCodes code'))
        .map(code => code.textContent)
        .join('\n');
    
    const blob = new Blob([codes], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

// Form validation
function validatePasswordForm(form) {
    const newPassword = form.querySelector('input[name="new_password"]').value;
    const confirmPassword = form.querySelector('input[name="confirm_password"]').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('error', 'Passwords do not match');
        return false;
    }
    
    return true;
}

function validateEmailForm(form) {
    const newEmail = form.querySelector('input[name="new_email"]').value;
    const confirmEmail = form.querySelector('input[name="confirm_email"]').value;
    
    if (newEmail !== confirmEmail) {
        showNotification('error', 'Email addresses do not match');
        return false;
    }
    
    return true;
}