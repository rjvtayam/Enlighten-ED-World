// Course Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Navigation
    const navGroups = document.querySelectorAll('.nav-group-header');
    navGroups.forEach(header => {
        header.addEventListener('click', () => {
            const group = header.closest('.nav-group');
            group.classList.toggle('active');
        });
    });

    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.course-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Active section highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            const group = link.closest('.nav-group');
            if (group) {
                group.classList.add('active');
            }
        }
    });
});
