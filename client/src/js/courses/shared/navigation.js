// Enhanced navigation.js for course templates

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const sidebar = document.querySelector('.course-sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sectionHeaders = document.querySelectorAll('.section-header');
    const navLinks = document.querySelectorAll('.section-content a');

    // Toggle sidebar on mobile
    function toggleMobileMenu() {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('active'));
        }
    }

    // Toggle section content visibility
    function toggleSection(event) {
        const header = event.currentTarget;
        const section = header.closest('.course-section');
        const content = section.querySelector('.section-content');

        if (content) {
            const isExpanded = content.classList.toggle('active');
            header.setAttribute('aria-expanded', isExpanded);
            
            // Smooth scroll to the header if it's now expanded
            if (isExpanded) {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Highlight active navigation item
    function setActiveNavItem(hash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
                const section = link.closest('.course-section');
                if (section) {
                    const content = section.querySelector('.section-content');
                    if (content) {
                        content.classList.add('active');
                    }
                }
            }
        });
    }

    // Smooth scroll to anchor links
    function smoothScroll(event) {
        const target = event.target.getAttribute('href');
        if (target && target.startsWith('#')) {
            event.preventDefault();
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update URL without page jump
                history.pushState(null, null, target);
                // Highlight the active nav item
                setActiveNavItem(target);
            }
        }
    }

    // Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = document.querySelector('.progress');
        const totalSections = document.querySelectorAll('.course-section').length;
        const completedSections = document.querySelectorAll('.course-section.completed').length;
        const percentage = (completedSections / totalSections) * 100;
        
        if (progress) {
            progress.style.width = `${percentage}%`;
            progress.setAttribute('aria-valuenow', percentage);
        }
    }

    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    sectionHeaders.forEach(header => {
        header.addEventListener('click', toggleSection);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnMenuToggle = menuToggle && menuToggle.contains(event.target);
        
        if (window.innerWidth <= 1024 && sidebar.classList.contains('active') && !isClickInsideSidebar && !isClickOnMenuToggle) {
            toggleMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Initialize
    lazyLoadImages();
    updateProgressBar();

    // Set active nav item based on current URL
    setActiveNavItem(window.location.hash);

    // Update active nav item and progress bar when completing a section
    document.addEventListener('sectionCompleted', function(e) {
        const sectionId = e.detail.sectionId;
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('completed');
            updateProgressBar();
        }
    });
});