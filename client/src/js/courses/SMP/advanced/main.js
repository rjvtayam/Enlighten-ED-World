document.addEventListener('DOMContentLoaded', function() {
    // Course State Management
    const courseState = {
        currentSection: null,
        currentContent: null,
        progress: {
            completedItems: 0,
            totalItems: document.querySelectorAll('.section-content a').length,
            lastAccessed: null
        },
        animations: {
            enabled: true,
            duration: 300
        }
    };

    // Initialize Analytics
    const analytics = {
        trackEvent(category, action, label) {
            // Implementation for analytics tracking
            console.log(`Analytics: ${category} - ${action} - ${label}`);
        },
        
        trackProgress(progress) {
            this.trackEvent('Progress', 'Update', `${progress.completedItems}/${progress.totalItems}`);
        },
        
        trackTimeSpent(contentId, timeInSeconds) {
            this.trackEvent('Engagement', 'TimeSpent', `${contentId}: ${timeInSeconds}s`);
        }
    };

    // Advanced UI Controller
    const UIController = {
        elements: {
            sidebar: document.querySelector('.course-sidebar'),
            content: document.querySelector('.course-content'),
            progressBar: document.querySelector('.progress'),
            progressText: document.querySelector('.progress-text'),
            nextButton: document.querySelector('.btn-primary'),
            prevButton: document.querySelector('.btn-secondary')
        },

        toggleLoader(show) {
            const loader = document.querySelector('.content-loader');
            if (show) {
                if (!loader) {
                    const loaderHTML = `
                        <div class="content-loader">
                            <div class="loader-spinner"></div>
                            <p>Loading advanced content...</p>
                        </div>
                    `;
                    this.elements.content.insertAdjacentHTML('afterbegin', loaderHTML);
                }
            } else if (loader) {
                loader.remove();
            }
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }, 100);
        },

        updateProgress(progress) {
            if (this.elements.progressBar) {
                const percentage = (progress.completedItems / progress.totalItems) * 100;
                this.elements.progressBar.style.width = `${percentage}%`;
            }
            
            if (this.elements.progressText) {
                this.elements.progressText.textContent = 
                    `Progress: ${progress.completedItems}/${progress.totalItems} lessons completed`;
            }
        },

        toggleNavigationButtons(currentLink) {
            const links = Array.from(document.querySelectorAll('.section-content a'));
            const currentIndex = links.indexOf(currentLink);
            
            if (this.elements.prevButton) {
                this.elements.prevButton.disabled = currentIndex === 0;
            }
            if (this.elements.nextButton) {
                this.elements.nextButton.disabled = currentIndex === links.length - 1;
            }
        }
    };

    // Content Manager
    const ContentManager = {
        async loadContent(contentId) {
            UIController.toggleLoader(true);
            
            try {
                const content = await this.fetchContent(contentId);
                await this.renderContent(content);
                this.initializeInteractiveElements();
                
                analytics.trackEvent('Content', 'Load', contentId);
                UIController.showNotification('Content loaded successfully', 'success');
            } catch (error) {
                console.error('Error loading content:', error);
                UIController.showNotification('Failed to load content', 'error');
            } finally {
                UIController.toggleLoader(false);
            }
        },

        async fetchContent(contentId) {
            // Simulate API call (replace with actual endpoint)
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        title: `Advanced Content: ${contentId}`,
                        videoUrl: `/videos/smp/advanced/${contentId}.mp4`,
                        content: this.generateContentTemplate(contentId)
                    });
                }, 800);
            });
        },

        generateContentTemplate(contentId) {
            return `
                <div class="advanced-feature">
                    <h3>Advanced Concept</h3>
                    <p>Advanced content for ${contentId}</p>
                </div>
                <div class="code-example">
                    <pre><code>// Advanced implementation
function implement${contentId}() {
    // Implementation details
}</code></pre>
                </div>
            `;
        },

        async renderContent(content) {
            const contentArea = document.querySelector('.content-area');
            if (!contentArea) return;

            // Apply fade out animation
            await this.animateTransition(contentArea, 'fadeOut');
            
            // Update content
            contentArea.innerHTML = `
                <div class="content-header">
                    <h1>${content.title}</h1>
                </div>
                <div class="video-container">
                    <video controls>
                        <source src="${content.videoUrl}" type="video/mp4">
                    </video>
                </div>
                <div class="content-text">
                    ${content.content}
                </div>
            `;

            // Apply fade in animation
            await this.animateTransition(contentArea, 'fadeIn');
        },

        async animateTransition(element, animation) {
            if (!courseState.animations.enabled) return;

            return new Promise(resolve => {
                element.style.animation = `${animation} ${courseState.animations.duration}ms ease`;
                element.addEventListener('animationend', () => {
                    element.style.animation = '';
                    resolve();
                }, { once: true });
            });
        },

        initializeInteractiveElements() {
            // Initialize code highlighting
            document.querySelectorAll('pre code').forEach(block => {
                // Implement code highlighting
                block.classList.add('highlighted');
            });

            // Initialize interactive features
            document.querySelectorAll('.advanced-feature').forEach(feature => {
                feature.addEventListener('click', () => {
                    feature.classList.toggle('expanded');
                });
            });
        }
    };

    // Navigation Manager
    const NavigationManager = {
        init() {
            this.initializeSectionHeaders();
            this.initializeNavigationLinks();
            this.initializeNavigationButtons();
            this.initializeKeyboardNavigation();
        },

        initializeSectionHeaders() {
            document.querySelectorAll('.section-header').forEach(header => {
                header.addEventListener('click', () => this.toggleSection(header));
            });
        },

        initializeNavigationLinks() {
            document.querySelectorAll('.section-content a').forEach(link => {
                link.addEventListener('click', (e) => this.handleNavigation(e, link));
            });
        },

        initializeNavigationButtons() {
            if (UIController.elements.nextButton) {
                UIController.elements.nextButton.addEventListener('click', () => this.navigateContent('next'));
            }
            if (UIController.elements.prevButton) {
                UIController.elements.prevButton.addEventListener('click', () => this.navigateContent('prev'));
            }
        },

        initializeKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    this.navigateContent('next');
                } else if (e.key === 'ArrowLeft') {
                    this.navigateContent('prev');
                }
            });
        },

        async toggleSection(header) {
            const wasActive = header.classList.contains('active');
            
            // Close all sections
            document.querySelectorAll('.section-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove('active');
                }
            });

            // Toggle clicked section
            header.classList.toggle('active', !wasActive);
            
            analytics.trackEvent('Navigation', 'ToggleSection', header.textContent);
        },

        async handleNavigation(e, link) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.section-content a').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update course state
            courseState.currentContent = link.getAttribute('data-content');
            
            // Load content
            await ContentManager.loadContent(courseState.currentContent);
            
            // Update UI
            UIController.toggleNavigationButtons(link);
            
            // Track progress if not already completed
            if (!link.classList.contains('completed')) {
                link.classList.add('completed');
                courseState.progress.completedItems++;
                UIController.updateProgress(courseState.progress);
                analytics.trackProgress(courseState.progress);
            }
        },

        async navigateContent(direction) {
            const currentLink = document.querySelector('.section-content a.active');
            if (!currentLink) return;

            const links = Array.from(document.querySelectorAll('.section-content a'));
            const currentIndex = links.indexOf(currentLink);
            let nextIndex;

            if (direction === 'next') {
                nextIndex = currentIndex + 1;
            } else {
                nextIndex = currentIndex - 1;
            }

            if (nextIndex >= 0 && nextIndex < links.length) {
                links[nextIndex].click();
            }
        }
    };

    // Progress Manager
    const ProgressManager = {
        init() {
            this.loadProgress();
            window.addEventListener('beforeunload', () => this.saveProgress());
        },

        loadProgress() {
            const saved = localStorage.getItem('smpAdvancedProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                courseState.progress = progress;
                UIController.updateProgress(progress);
                
                // Mark completed items
                document.querySelectorAll('.section-content a').forEach(link => {
                    const contentId = link.getAttribute('data-content');
                    if (progress.completedContent?.includes(contentId)) {
                        link.classList.add('completed');
                    }
                });

                // Restore last accessed content
                if (progress.lastAccessed) {
                    const lastLink = document.querySelector(`[data-content="${progress.lastAccessed}"]`);
                    if (lastLink) {
                        lastLink.click();
                    }
                }
            }
        },

        saveProgress() {
            const progress = {
                ...courseState.progress,
                lastAccessed: courseState.currentContent,
                completedContent: Array.from(document.querySelectorAll('.section-content a.completed'))
                    .map(link => link.getAttribute('data-content'))
            };
            
            localStorage.setItem('smpAdvancedProgress', JSON.stringify(progress));
            analytics.trackProgress(progress);
        }
    };

    // Initialize Course
    function initializeCourse() {
        NavigationManager.init();
        ProgressManager.init();

        // Start with first section if no progress
        if (!courseState.currentContent) {
            const firstLink = document.querySelector('.section-content a');
            if (firstLink) {
                firstLink.click();
            }
        }
    }

    // Start initialization
    initializeCourse();
});
