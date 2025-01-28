// Course Navigation
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.course-sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');

    // Sidebar Navigation
    function toggleNavGroup(event) {
        const header = event.currentTarget;
        const group = header.closest('.nav-group');
        if (group) {
            group.classList.toggle('active');
        }
    }

    document.querySelectorAll('.nav-group-header').forEach(header => {
        header.addEventListener('click', toggleNavGroup);
    });

    // Mobile Navigation Toggle
    function toggleMobileMenu() {
        sidebar.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('active'));
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close sidebar when clicking outside on mobile
    function handleOutsideClick(event) {
        if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    document.addEventListener('click', handleOutsideClick);

    // Active section highlighting
    function highlightActiveSection() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
                const group = link.closest('.nav-group');
                if (group) {
                    group.classList.add('active');
                }
            }
        });
    }

    highlightActiveSection();

    // Smooth scrolling for anchor links
    function smoothScroll(event) {
        const target = event.target.getAttribute('href');
        if (target && target.startsWith('#')) {
            event.preventDefault();
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    observer.unobserve(image);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    }

    // Debounce function for performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle window resize
    const handleResize = debounce(() => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }, 250);

    window.addEventListener('resize', handleResize);
});