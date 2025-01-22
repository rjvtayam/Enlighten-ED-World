document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeProfileDropdown();
    initializeNavLinks();
    initializeScrollSpy();
    initializeSmoothScroll();
    initializeFooter();
    initializeFlashMessages();
    handleLoginFormSubmission();
});

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (mobileMenuBtn && navbarMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navbarMenu.classList.toggle('show');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navbarMenu.contains(e.target)) {
                navbarMenu.classList.remove('show');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    }
}

function initializeProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            this.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
                profileBtn.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function initializeNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    // Initialize active state
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');

        // Add active class to current page link
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            animateNavLink(link);
        }

        // Add event listeners
        link.addEventListener('click', handleNavLinkClick);
        link.addEventListener('mouseenter', handleNavLinkHover);
    });
}

function handleNavLinkClick(e) {
    const link = e.currentTarget;
    
    if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Update active states
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            link.classList.add('active');
            
            // Add click animation
            animateNavLink(link);
            
            // Smooth scroll to target
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL
            history.pushState({ id: targetId }, '', `#${targetId}`);
        }
    }
}

function handleNavLinkHover(e) {
    const link = e.currentTarget;
    createRippleEffect(e, link);
}

function animateNavLink(link) {
    // Remove any existing animation class
    link.classList.remove('nav-animate');
    
    // Force reflow
    void link.offsetWidth;
    
    // Add animation class
    link.classList.add('nav-animate');
    
    // Create ripple effect
    createRippleEffect({ clientX: link.offsetLeft + link.offsetWidth / 2, clientY: link.offsetTop + link.offsetHeight / 2 }, link);
}

function createRippleEffect(e, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Add scroll spy functionality
function initializeScrollSpy() {
    let sections = {};
    let sectionsArray = [];
    
    document.querySelectorAll('section[id]').forEach(section => {
        sections[section.id] = section.offsetTop;
        sectionsArray.push(section);
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + (window.innerHeight / 3);
        
        for (let i = sectionsArray.length - 1; i >= 0; i--) {
            const section = sectionsArray[i];
            if (sections[section.id] <= scrollPosition) {
                document.querySelector('.nav-link.active')?.classList.remove('active');
                document.querySelector(`.nav-link[href="#${section.id}"]`)?.classList.add('active');
                break;
            }
        }
    });
}

// Optional: Add window resize handler for mobile menu
window.addEventListener('resize', function() {
    const navbarMenu = document.getElementById('navbarMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (window.innerWidth > 768) {
        navbarMenu.classList.remove('show');
        if (mobileMenuBtn.querySelector('i').classList.contains('fa-times')) {
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }
    }
});

function initializeFooter() {
    // Add smooth scroll to footer links
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add year to copyright
    const copyrightYear = document.querySelector('.copyright');
    if (copyrightYear) {
        const year = new Date().getFullYear();
        copyrightYear.textContent = copyrightYear.textContent.replace('2024', year);
    }
}

function initializeSmoothScroll() {
    // Handle all internal links
    document.querySelectorAll('a[href^="#"]:not([data-no-scroll])').forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // Handle initial hash in URL
    handleInitialHash();
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;

    // Handle nav link active states
    if (this.classList.contains('nav-link')) {
        updateNavActiveState(this);
    }

    // Calculate scroll position
    const headerOffset = 70; // Header height
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    // Perform smooth scroll
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    // Update URL without jumping
    updateUrlHash(targetId);
}

function handleInitialHash() {
    if (!location.hash) return;
    
    setTimeout(() => {
        const targetElement = document.querySelector(location.hash);
        if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

function updateNavActiveState(clickedLink) {
    document.querySelectorAll('.nav-link').forEach(navLink => 
        navLink.classList.remove('active')
    );
    clickedLink.classList.add('active');
}

function updateUrlHash(targetId) {
    history.pushState(
        { id: targetId },
        '',
        `#${targetId}`
    );
}

function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach((message, index) => {
        // Stagger the animation of multiple messages
        setTimeout(() => {
            message.classList.add('show');
        }, index * 150);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            message.classList.remove('show');
            message.classList.add('hide');
            setTimeout(() => {
                if (message && message.parentElement) {
                    message.parentElement.removeChild(message);
                }
            }, 300);
        }, 5000 + (index * 150));
    });
}

function handleLoginFormSubmission() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Disable submit button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            fetch('/auth/login', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showFlashMessage('Login successful', 'success');
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 500);
                } else {
                    // Show error message
                    showFlashMessage(data.message || 'Login failed', 'error');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                showFlashMessage('An error occurred. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
        });
    }
}

function showFlashMessage(message, type = 'info') {
    const flashContainer = document.getElementById('flash-messages');
    if (!flashContainer) return;
    
    const alertClass = type === 'error' ? 'alert-danger' : 
                      type === 'success' ? 'alert-success' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const icon = type === 'error' ? 'fa-circle-xmark' :
                type === 'success' ? 'fa-circle-check' :
                type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass} alert-dismissible fade show`;
    alert.innerHTML = `
        <i class="fas ${icon} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    flashContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
}