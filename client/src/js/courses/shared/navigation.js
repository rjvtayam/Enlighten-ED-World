document.addEventListener('DOMContentLoaded', function() {
    // Enhanced DOM Elements caching
    const sidebar = document.querySelector('.course-sidebar');
    const navGroups = document.querySelectorAll('.nav-group');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Navigation State Management - Enhanced with better error handling
    class NavigationManager {
        constructor() {
            this.currentSection = null;
            this.isAnimating = false;
            this.initLocalStorage();
        }

        initLocalStorage() {
            // Initialize progress tracking
            const courseId = document.querySelector('.course-container')?.getAttribute('id') || 'default-course';
            this.storageKey = `course_progress_${courseId}`;
            this.loadProgress();
        }

        toggleNavGroup(group) {
            if (!group) return;
            
            const content = group.querySelector('.nav-group-content');
            if (!content) return;

            const isExpanded = group.classList.toggle('expanded');
            
            // Smooth height transition
            if (isExpanded) {
                content.style.maxHeight = `${content.scrollHeight}px`;
            } else {
                content.style.maxHeight = '0';
            }
            
            group.setAttribute('aria-expanded', isExpanded);
        }

        setActiveLink(link) {
            if (!link) return;

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Mark as completed
            if (!link.classList.contains('completed')) {
                link.classList.add('completed');
                this.saveProgress();
            }
            
            // Expand parent nav group if collapsed
            const parentGroup = link.closest('.nav-group');
            if (parentGroup && !parentGroup.classList.contains('expanded')) {
                this.toggleNavGroup(parentGroup);
            }
        }

        updateProgress() {
            const progressIndicator = document.querySelector('.progress-indicator');
            if (!progressIndicator) return;

            const completedLinks = document.querySelectorAll('.nav-link.completed');
            const totalLinks = navLinks.length;
            const progress = Math.round((completedLinks.length / totalLinks) * 100);
            
            progressIndicator.textContent = 
                `Progress: ${completedLinks.length}/${totalLinks} lessons completed`;
            
            // Update progress bar if it exists
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }

        saveProgress() {
            const completedLessons = Array.from(document.querySelectorAll('.nav-link.completed'))
                .map(link => link.getAttribute('data-content'));
            
            localStorage.setItem(this.storageKey, JSON.stringify({
                completed: completedLessons,
                lastAccessed: new Date().toISOString()
            }));
        }

        loadProgress() {
            try {
                const saved = JSON.parse(localStorage.getItem(this.storageKey));
                if (saved?.completed) {
                    saved.completed.forEach(contentId => {
                        const link = document.querySelector(`[data-content="${contentId}"]`);
                        if (link) link.classList.add('completed');
                    });
                    this.updateProgress();
                }
            } catch (e) {
                console.warn('Failed to load progress:', e);
            }
        }
    }

    // Content Manager - Enhanced with better animations
    class ContentManager {
        constructor() {
            this.currentContent = null;
            this.fadeSpeed = 300; // milliseconds
        }

        async loadContent(contentId) {
            const content = document.querySelector(`[data-content="${contentId}"]`);
            if (!content) return;

            // Fade out current content
            if (this.currentContent) {
                this.currentContent.style.opacity = '0';
                await this.wait(this.fadeSpeed);
            }

            // Update and fade in new content
            this.currentContent = content;
            content.style.opacity = '0';
            content.style.display = 'block';
            
            // Force browser reflow
            content.offsetHeight;
            
            content.style.opacity = '1';
            await this.wait(this.fadeSpeed);
        }

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        initializeAccordions() {
            document.querySelectorAll('.accordion-header').forEach(header => {
                if (!header.hasAttribute('data-initialized')) {
                    header.setAttribute('data-initialized', 'true');
                    
                    header.addEventListener('click', () => {
                        const content = header.nextElementSibling;
                        if (!content) return;

                        const isExpanded = header.classList.toggle('expanded');
                        
                        if (isExpanded) {
                            content.style.maxHeight = `${content.scrollHeight}px`;
                        } else {
                            content.style.maxHeight = '0';
                        }
                        
                        header.setAttribute('aria-expanded', isExpanded);
                    });
                }
            });
        }
    }

    // Initialize Managers
    const navigationManager = new NavigationManager();
    const contentManager = new ContentManager();

    // Event Listeners - Enhanced with debouncing
    let debounceTimeout;
    
    navGroups.forEach(group => {
        const header = group.querySelector('.nav-group-header');
        if (header) {
            header.addEventListener('click', () => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    navigationManager.toggleNavGroup(group);
                }, 50);
            });
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (navigationManager.isAnimating) return;
            navigationManager.isAnimating = true;

            const contentId = link.getAttribute('data-content');
            
            navigationManager.setActiveLink(link);
            await contentManager.loadContent(contentId);
            navigationManager.updateProgress();

            navigationManager.isAnimating = false;
        });
    });

    // Mobile Navigation - Enhanced with touch support
    const initializeMobileNav = () => {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle Navigation');
        mobileToggle.innerHTML = '<span class="sr-only">Toggle Navigation</span>';
        
        document.body.appendChild(mobileToggle);
        
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            mobileToggle.setAttribute('aria-expanded', 
                sidebar.classList.contains('active'));
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                document.body.classList.remove('nav-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    };

    // Content Section Observer - Enhanced with better performance
    const observeContent = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });

        contentSections.forEach(section => observer.observe(section));
    };

    // Initialize everything
    contentManager.initializeAccordions();
    initializeMobileNav();
    observeContent();
    navigationManager.updateProgress();
});