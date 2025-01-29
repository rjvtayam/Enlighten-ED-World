document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.querySelector('.course-sidebar');
    const navGroups = document.querySelectorAll('.nav-group');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Navigation State Management
    class NavigationManager {
        constructor() {
            this.currentSection = null;
            this.isAnimating = false;
        }

        toggleNavGroup(group) {
            const content = group.querySelector('.nav-group-content');
            const isExpanded = group.classList.toggle('expanded');
            
            content.style.maxHeight = isExpanded ? `${content.scrollHeight}px` : '0';
            group.setAttribute('aria-expanded', isExpanded);
        }

        setActiveLink(link) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Expand parent nav group
            const parentGroup = link.closest('.nav-group');
            if (parentGroup && !parentGroup.classList.contains('expanded')) {
                this.toggleNavGroup(parentGroup);
            }
        }

        updateProgress() {
            const completedLinks = document.querySelectorAll('.nav-link.completed');
            const progress = (completedLinks.length / navLinks.length) * 100;
            
            document.querySelector('.progress-indicator').textContent = 
                `Progress: ${completedLinks.length}/${navLinks.length} lessons completed`;
        }
    }

    // Content Manager
    class ContentManager {
        constructor() {
            this.currentContent = null;
        }

        async loadContent(contentId) {
            // Simulate content loading
            const content = document.querySelector(`[data-content="${contentId}"]`);
            if (!content) return;

            if (this.currentContent) {
                this.currentContent.style.opacity = '0';
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            this.currentContent = content;
            content.style.opacity = '1';
        }

        initializeAccordions() {
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const isExpanded = header.classList.toggle('expanded');
                    
                    content.style.maxHeight = isExpanded ? `${content.scrollHeight}px` : '0';
                    header.setAttribute('aria-expanded', isExpanded);
                });
            });
        }
    }

    // Initialize Managers
    const navigationManager = new NavigationManager();
    const contentManager = new ContentManager();

    // Event Listeners
    navGroups.forEach(group => {
        const header = group.querySelector('.nav-group-header');
        header.addEventListener('click', () => navigationManager.toggleNavGroup(group));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const contentId = link.getAttribute('data-content');
            
            navigationManager.setActiveLink(link);
            await contentManager.loadContent(contentId);
            navigationManager.updateProgress();
        });
    });

    // Mobile Navigation
    const initializeMobileNav = () => {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.innerHTML = '<span class="sr-only">Toggle Navigation</span>';
        
        document.body.appendChild(mobileToggle);
        
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    };

    // Intersection Observer for Content Sections
    const observeContent = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        contentSections.forEach(section => observer.observe(section));
    };

    // Initialize
    contentManager.initializeAccordions();
    initializeMobileNav();
    observeContent();
    navigationManager.updateProgress();
});
