function initBannerSlider(sliderId, prevBtnId, nextBtnId) {
    const slider = document.getElementById(sliderId);
    const slides = slider.querySelectorAll('.banner-slide');
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    let currentSlide = 0;
    let startX;
    let isDragging = false;
    
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Touch events
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const walk = (x - startX) * 2;
        slider.style.transform = `translateX(calc(-${currentSlide * 100}% + ${walk}px))`;
    });
    
    slider.addEventListener('touchend', (e) => {
        isDragging = false;
        const x = e.changedTouches[0].clientX;
        const walk = x - startX;
        
        if (Math.abs(walk) > 100) {
            if (walk > 0) prevSlide();
            else nextSlide();
        } else {
            updateSlider();
        }
    });
    
    // Auto slide
    setInterval(nextSlide, 5000);
}

// Initialize both sliders
document.addEventListener('DOMContentLoaded', function() {
    const mainSlider = document.getElementById('bannerSlider');
    if (mainSlider) {
        initBannerSlider('bannerSlider', 'prevBtn', 'nextBtn');
    }

    const resourceSlider = document.getElementById('resourceBannerSlider');
    if (resourceSlider) {
        initBannerSlider('resourceBannerSlider', 'resourcePrevBtn', 'resourceNextBtn');
    }
}); 

function scrollCategories(direction) {
    const container = document.getElementById('categoriesGrid');
    const scrollAmount = 400; // Adjust this value to control scroll distance
    
    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Optional: Add auto-scroll functionality
function startAutoScroll() {
    const container = document.getElementById('categoriesGrid');
    let scrollDirection = 1;
    
    setInterval(() => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        // Change direction if we reach the end
        if (currentScroll >= maxScroll) scrollDirection = -1;
        if (currentScroll <= 0) scrollDirection = 1;
        
        container.scrollBy({
            left: 400 * scrollDirection,
            behavior: 'smooth'
        });
    }, 5000); // Scroll every 5 seconds
}

// Initialize auto-scroll when the page loads
document.addEventListener('DOMContentLoaded', () => {
    startAutoScroll();
}); 

// Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // Update every 16ms (60fps)
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

document.addEventListener('DOMContentLoaded', animateCounter); 

// Add this new function to handle program section visibility
function initProgramSections() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const programSection = entry.target;
            const programLabel = programSection.querySelector('.program-label');
            
            if (entry.isIntersecting) {
                programSection.classList.add('active');
                programLabel.style.opacity = '1';
                programLabel.style.transform = 'translateY(0)';
            } else {
                programSection.classList.remove('active');
                programLabel.style.opacity = '0';
                programLabel.style.transform = 'translateY(20px)';
            }
        });
    }, options);

    // Observe all program sections
    document.querySelectorAll('.program-section').forEach(section => {
        observer.observe(section);
    });
}

// Add this function to handle scroll navigation
function initProgramNavigation() {
    const categoriesGrid = document.querySelector('.categories-grid');
    const prevBtn = document.querySelector('.scroll-prev');
    const nextBtn = document.querySelector('.scroll-next');

    if (!categoriesGrid || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        const width = categoriesGrid.offsetWidth;
        categoriesGrid.scrollBy({
            left: -width,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        const width = categoriesGrid.offsetWidth;
        categoriesGrid.scrollBy({
            left: width,
            behavior: 'smooth'
        });
    });

    // Hide/show scroll buttons based on scroll position
    categoriesGrid.addEventListener('scroll', () => {
        const isAtStart = categoriesGrid.scrollLeft === 0;
        const isAtEnd = categoriesGrid.scrollLeft + categoriesGrid.offsetWidth >= categoriesGrid.scrollWidth;

        prevBtn.style.opacity = isAtStart ? '0' : '1';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'all';
        
        nextBtn.style.opacity = isAtEnd ? '0' : '1';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'all';
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBannerSlider();
    initScrollSpy();
    startAutoScroll();
    animateCounter();
    initProgramSections();
    initProgramNavigation();
}); 

// Add this to your existing initAboutAnimations function
function initCapabilityCards() {
    const cards = document.querySelectorAll('.capability-card');
    
    function shuffleCards() {
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = `shuffleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s backwards`;
        });
    }

    // Shuffle cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                shuffleCards();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe the capabilities section
    const capabilitiesSection = document.querySelector('.capabilities-section');
    if (capabilitiesSection) {
        observer.observe(capabilitiesSection);
    }
}

// Initialize the capability cards animation
document.addEventListener('DOMContentLoaded', initCapabilityCards); 

// Features section functionality
function initializeFeatures() {
    const featureItems = document.querySelectorAll('.feature-item');
    const mainImage = document.getElementById('mainFeatureImage');
    const mainTitle = document.getElementById('mainFeatureTitle');
    const mainDesc = document.getElementById('mainFeatureDesc');

    // Feature data
    const featureData = {
        1: {
            image: 'images/p_image1.png',
            title: 'Personalized Learning',
            description: 'Our AI-powered system creates personalized learning paths that adapt to your progress, ensuring efficient skill development aligned with industry requirements.'
        },
        2: {
            image: 'images/p_image2.png',
            title: 'Self-Paced Learning',
            description: 'Balance your studies with other commitments through our flexible learning platform, designed to accommodate your schedule while maintaining steady progress.'
        },
        3: {
            image: 'images/p_image3.jpg',
            title: 'Expert Support',
            description: 'Access real-time support from industry professionals and expert tutors who provide personalized guidance throughout your learning journey.'
        },
        4: {
            image: 'images/p_image4.png',
            title: 'Skill Assessment',
            description: 'Track your skill development through comprehensive assessments that identify strengths and areas for improvement.'
        },
        5: {
            image: 'images/p_image5.png',
            title: 'Industry-Aligned OJT',
            description: 'Get matched with OJT opportunities that align with your skills and career goals, providing valuable hands-on experience.'
        },
        6: {
            image: 'images/p_image6.png',
            title: 'Progress Tracking',
            description: 'Stay motivated with detailed progress tracking that shows your growth and accomplishments throughout your learning journey.'
        },
        7: {
            image: 'images/p_image7.png',
            title: 'Collaborative Learning',
            description: 'Engage with fellow learners in group projects and discussions, building both knowledge and professional networking skills.'
        },
        8: {
            image: 'images/p_image8.png',
            title: 'Certification',
            description: 'Receive industry-recognized certifications that validate your skills and enhance your professional credentials.'
        }
    };

    featureItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            featureItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get feature data
            const featureId = this.dataset.feature;
            const feature = featureData[featureId];
            
            // Animate content change
            mainImage.style.opacity = '0';
            document.querySelector('.feature-main-overlay').style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = `${window.location.origin}/public/${feature.image}`;
                mainTitle.textContent = feature.title;
                mainDesc.textContent = feature.description;
                
                mainImage.style.opacity = '1';
                document.querySelector('.feature-main-overlay').style.opacity = '1';
            }, 300);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFeatures();
}); 

// Features section read more functionality
function initializeReadMore() {
    const showMoreButtons = document.querySelectorAll('.show-more');
    
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.showcase-card');
            const hiddenText = card.querySelector('.hidden-text');
            const isActive = this.classList.contains('active');
            
            // Toggle button state and text
            if (isActive) {
                // Collapse
                this.classList.remove('active');
                this.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
                hiddenText.classList.remove('active');
            } else {
                // Expand
                this.classList.add('active');
                this.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
                hiddenText.classList.add('active');
            }
            
            // Optional: Close other open cards
            showMoreButtons.forEach(otherButton => {
                if (otherButton !== this && otherButton.classList.contains('active')) {
                    const otherCard = otherButton.closest('.showcase-card');
                    const otherHiddenText = otherCard.querySelector('.hidden-text');
                    
                    otherButton.classList.remove('active');
                    otherButton.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
                    otherHiddenText.classList.remove('active');
                }
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeReadMore();
}); 

// FAQ Functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
}); 

// Update your number animation JavaScript
function animateNumbers() {
    const activeLearnersElement = document.querySelector('.stat-number[data-target]');
    if (!activeLearnersElement) return;

    const target = parseInt(activeLearnersElement.dataset.target);
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // Update every 16ms

    let current = start;
    const animate = () => {
        current += increment;
        if (current < target) {
            activeLearnersElement.textContent = Math.floor(current);
            requestAnimationFrame(animate);
        } else {
            activeLearnersElement.textContent = target;
        }
    };
    animate();
}

// Call the animation when the page loads
document.addEventListener('DOMContentLoaded', animateNumbers); 

// Newsletter Form Handling with EmailJS
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    // Initialize EmailJS
    emailjs.init("dsXM4k8iyblu7LBZ4");

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

            // Send email using EmailJS
            const response = await emailjs.send(
                "service_b1cu7sc",
                "template_k8dbeis",
                {
                    to_email: emailInput.value,
                    to_name: emailInput.value.split('@')[0]
                }
            );

            if (response.status === 200) {
                showNotification('Successfully subscribed! Check your email.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to subscribe');
            }
            
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNewsletterForm);

// Notification function (if not already defined)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 