document.addEventListener('DOMContentLoaded', function() {
    console.log('Testimonial form script loaded');

    const testimonialSection = document.querySelector('#testimonials');
    const actionButton = document.querySelector('#testimonialActionBtn');
    const modal = document.getElementById('testimonialModal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('testimonialForm');
    const textArea = document.getElementById('testimonial_text');
    const charCount = document.querySelector('.char-count');
    const imageInput = document.getElementById('author_image');
    const imagePreview = document.querySelector('.image-preview');
    const ratingContainer = document.querySelector('.star-rating');
    const ratingInput = document.getElementById('rating');
    const stars = document.querySelectorAll('.star-rating .star');
    const loginUrl = testimonialSection ? testimonialSection.dataset.loginUrl : '/login';

    // Function to open modal
    function openTestimonialModal() {
        console.log('Opening modal');
        if (modal) {
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal element not found');
        }
    }

    // Function to close modal
    function closeTestimonialModal() {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
            resetForm();
        }
    }

    // Update button based on authentication state
    function updateActionButton(isAuthenticated) {
        if (!actionButton) {
            console.error('Action button not found');
            return;
        }
        
        console.log('Updating button state:', isAuthenticated);
        
        if (isAuthenticated) {
            const button = document.createElement('button');
            button.className = 'btn btn-primary testimonial-share-btn';
            button.innerHTML = '<i class="fas fa-comment-dots"></i> Share Your Experience';
            button.addEventListener('click', openTestimonialModal);
            
            // Clear existing content and append new button
            actionButton.innerHTML = '';
            actionButton.appendChild(button);
        } else {
            actionButton.innerHTML = `
                <a href="${loginUrl}" class="btn btn-primary testimonial-share-btn">
                    <i class="fas fa-sign-in-alt"></i> Login to Share Your Experience
                </a>
            `;
        }
    }

    // Check authentication status from server
    async function checkAuthenticationStatus() {
        try {
            const response = await fetch('/auth/status');
            if (!response.ok) {
                throw new Error('Failed to fetch auth status');
            }
            const data = await response.json();
            console.log('Auth status:', data);
            updateActionButton(data.is_authenticated);
            return data.is_authenticated;
        } catch (error) {
            console.error('Error checking authentication status:', error);
            updateActionButton(false);
            return false;
        }
    }

    // Initialize auth check
    function initializeAuth() {
        console.log('Initializing auth check');
        checkAuthenticationStatus();

        // Check auth status periodically
        setInterval(checkAuthenticationStatus, 5000);

        // Check when page becomes visible
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                console.log('Page became visible, checking auth');
                checkAuthenticationStatus();
            }
        });

        // Check when window gains focus
        window.addEventListener('focus', function() {
            console.log('Window gained focus, checking auth');
            checkAuthenticationStatus();
        });

        // Listen for auth success event
        window.addEventListener('authSuccess', function() {
            console.log('Auth success event received');
            checkAuthenticationStatus();
        });
    }

    // Initialize auth checking
    initializeAuth();

    // Close modal
    if (closeBtn) {
        closeBtn.onclick = closeTestimonialModal;
    }

    // Close on outside click
    window.onclick = function(event) {
        if (event.target === modal) {
            closeTestimonialModal();
        }
    };

    // Star rating functionality
    if (ratingContainer) {
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.rating;
                ratingInput.value = rating;
                updateStars(rating);
            });

            star.addEventListener('mouseover', () => {
                const rating = star.dataset.rating;
                highlightStars(rating);
            });

            star.addEventListener('mouseout', () => {
                const rating = ratingInput.value;
                highlightStars(rating);
            });
        });
    }

    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            const icon = star.querySelector('i');
            if (starRating <= rating) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }

    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            const icon = star.querySelector('i');
            if (starRating <= rating) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }

    // Character counter
    if (textArea) {
        textArea.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            if (charCount) {
                charCount.textContent = `${remaining} characters remaining`;
                charCount.classList.toggle('text-danger', remaining < 50);
            }
        });
    }

    // Image preview
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file && imagePreview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.style.backgroundImage = `url(${e.target.result})`;
                    imagePreview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (!validateForm()) {
                return;
            }
            
            const formData = new FormData(this);
            
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            if (csrfToken) {
                formData.append('csrf_token', csrfToken);
            }
            
            try {
                const response = await fetch('/api/testimonials', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to submit testimonial');
                }

                const result = await response.json();
                
                // Show success message
                showNotification('Testimonial submitted successfully!', 'success');
                
                // Close the modal
                closeTestimonialModal();
                
                // Add the new testimonial to the display
                const testimonialsGrid = document.querySelector('.testimonials-grid');
                if (testimonialsGrid) {
                    const testimonialData = {
                        author_name: formData.get('author_name'),
                        author_title: formData.get('author_title'),
                        author_institution: formData.get('author_institution'),
                        testimonial_text: formData.get('testimonial_text'),
                        rating: parseInt(formData.get('rating')),
                        author_image: formData.get('author_image') ? URL.createObjectURL(formData.get('author_image')) : '/static/images/default-avatar.png',
                        created_at: new Date().toISOString()
                    };
                    const newTestimonial = createTestimonialCard(testimonialData);
                    testimonialsGrid.insertBefore(newTestimonial, testimonialsGrid.firstChild);
                }
                
                // Reset the form
                resetForm();
            } catch (error) {
                console.error('Error:', error);
                showNotification(error.message || 'An error occurred while submitting the testimonial', 'error');
            }
        });
    }

    // Form validation
    function validateForm() {
        const requiredFields = ['author_name', 'author_title', 'author_institution', 'testimonial_text', 'rating'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!input || !input.value.trim()) {
                showNotification(`Please fill in ${field.replace('_', ' ')}`, 'error');
                isValid = false;
            }
        });

        // Validate testimonial length
        const testimonialText = form.querySelector('[name="testimonial_text"]').value.trim();
        if (testimonialText.length < 10) {
            showNotification('Testimonial must be at least 10 characters long', 'error');
            isValid = false;
        }

        // Validate rating
        const rating = parseInt(form.querySelector('[name="rating"]').value);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            showNotification('Please select a rating between 1 and 5 stars', 'error');
            isValid = false;
        }

        // Validate image if one is selected
        const imageFile = form.querySelector('[name="author_image"]').files[0];
        if (imageFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(imageFile.type)) {
                showNotification('Please upload a valid image file (JPG, PNG, or GIF)', 'error');
                isValid = false;
            }
            if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification('Image file size must be less than 5MB', 'error');
                isValid = false;
            }
        }

        return isValid;
    }

    // Create testimonial card
    function createTestimonialCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        
        card.innerHTML = `
            <div class="testimonial-quote">
                <i class="fas fa-quote-right"></i>
            </div>
            <div class="testimonial-content">
                <div class="testimonial-rating">
                    ${createStarRating(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.testimonial_text}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.author_image}" 
                    alt="${testimonial.author_name}" 
                    class="author-image"
                    onerror="this.src='/static/images/default-avatar.png'">
                <div class="author-info">
                    <h4 class="author-name">${testimonial.author_name}</h4>
                    <p class="author-title">${testimonial.author_title}</p>
                    <p class="author-institution">${testimonial.author_institution}</p>
                </div>
            </div>
        `;
        
        return card;
    }

    // Create star rating HTML
    function createStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star${i <= rating ? '' : ' far'}"></i>`;
        }
        return stars;
    }

    function resetForm() {
        if (form) {
            form.reset();
            if (imagePreview) {
                imagePreview.style.backgroundImage = '';
                imagePreview.classList.remove('has-image');
            }
            if (ratingInput) {
                ratingInput.value = '';
                updateStars(0);
            }
            if (charCount) {
                charCount.textContent = '500 characters remaining';
                charCount.classList.remove('text-danger');
            }
        }
    }

    // Show notification with improved styling
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.zIndex = '10000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease-in-out';
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});