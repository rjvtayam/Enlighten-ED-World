document.addEventListener('DOMContentLoaded', function() {
    // Initialize course state
    let courseState = {
        currentSection: null,
        currentContent: null,
        progress: {
            completedItems: 0,
            totalItems: document.querySelectorAll('.section-content a').length
        }
    };

    // Section Headers Click Handling
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active state of clicked section
            header.classList.toggle('active');
            
            // Close other sections
            sectionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    const content = otherHeader.nextElementSibling;
                    if (content) {
                        slideUp(content);
                    }
                }
            });

            // Slide toggle content
            const content = header.nextElementSibling;
            if (content) {
                if (header.classList.contains('active')) {
                    slideDown(content);
                } else {
                    slideUp(content);
                }
            }
        });
    });

    // Navigation Links Click Handling
    const navLinks = document.querySelectorAll('.section-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(otherLink => otherLink.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update course state
            courseState.currentContent = link.getAttribute('data-content');
            courseState.currentSection = link.closest('.course-section');
            
            // Load content
            await loadContent(courseState.currentContent);
            
            // Update progress if not already completed
            if (!link.classList.contains('completed')) {
                link.classList.add('completed');
                courseState.progress.completedItems++;
                updateProgress();
            }
        });
    });

    // Navigation Buttons
    const nextButton = document.querySelector('.btn-primary');
    const prevButton = document.querySelector('.btn-secondary');
    
    if (nextButton) {
        nextButton.addEventListener('click', () => navigateContent('next'));
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => navigateContent('prev'));
    }

    // Content Navigation
    async function navigateContent(direction) {
        const currentLink = document.querySelector('.section-content a.active');
        if (!currentLink) return;

        let nextLink;
        if (direction === 'next') {
            nextLink = getNextLink(currentLink);
        } else {
            nextLink = getPreviousLink(currentLink);
        }

        if (nextLink) {
            nextLink.click();
        }
    }

    function getNextLink(currentLink) {
        // Try next link in current section
        let nextLink = currentLink.parentElement.nextElementSibling?.querySelector('a');
        if (nextLink) return nextLink;

        // Try first link in next section
        const currentSection = currentLink.closest('.course-section');
        const nextSection = currentSection.nextElementSibling;
        if (nextSection) {
            const header = nextSection.querySelector('.section-header');
            if (header) header.classList.add('active');
            return nextSection.querySelector('.section-content a');
        }
        return null;
    }

    function getPreviousLink(currentLink) {
        // Try previous link in current section
        let prevLink = currentLink.parentElement.previousElementSibling?.querySelector('a');
        if (prevLink) return prevLink;

        // Try last link in previous section
        const currentSection = currentLink.closest('.course-section');
        const prevSection = currentSection.previousElementSibling;
        if (prevSection) {
            const header = prevSection.querySelector('.section-header');
            if (header) header.classList.add('active');
            const links = prevSection.querySelectorAll('.section-content a');
            return links[links.length - 1];
        }
        return null;
    }

    // Content Loading
    async function loadContent(contentId) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        try {
            showLoadingState();
            
            // Simulate API call (replace with actual endpoint)
            const content = await fetchContent(contentId);
            
            if (content) {
                updateContentArea(content);
                updateNavigationState();
                initializeInteractiveElements();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            showErrorState();
        } finally {
            hideLoadingState();
        }
    }

    // Simulate content fetching (replace with actual API call)
    async function fetchContent(contentId) {
        // Simulated API response
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    title: `Content for ${contentId}`,
                    videoUrl: `/videos/smp/intermediate/${contentId}.mp4`,
                    html: `<div class="content-section">
                        <h2>Section Content</h2>
                        <p>Content for ${contentId} goes here...</p>
                    </div>`
                });
            }, 500);
        });
    }

    // UI State Management
    function showLoadingState() {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.classList.add('loading');
        }
    }

    function hideLoadingState() {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.classList.remove('loading');
        }
    }

    function showErrorState() {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="error-state">
                    <h2>Error Loading Content</h2>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    // Progress Tracking
    function updateProgress() {
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            const percentage = (courseState.progress.completedItems / courseState.progress.totalItems) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Progress: ${courseState.progress.completedItems}/${courseState.progress.totalItems} lessons completed`;
        }

        // Save progress
        saveProgress();
    }

    // Progress Persistence
    function saveProgress() {
        const progress = {
            courseId: 'smp-intermediate',
            completedItems: courseState.progress.completedItems,
            totalItems: courseState.progress.totalItems,
            lastContentId: courseState.currentContent
        };

        // Save to localStorage for now (replace with API call)
        localStorage.setItem('courseProgress', JSON.stringify(progress));
    }

    function loadSavedProgress() {
        const saved = localStorage.getItem('courseProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            if (progress.courseId === 'smp-intermediate') {
                courseState.progress = {
                    completedItems: progress.completedItems,
                    totalItems: progress.totalItems
                };
                updateProgress();
                
                // Restore last viewed content
                if (progress.lastContentId) {
                    const link = document.querySelector(`[data-content="${progress.lastContentId}"]`);
                    if (link) link.click();
                }
            }
        }
    }

    // Animation Helpers
    function slideDown(element) {
        element.style.height = '0';
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.transition = 'height 0.3s ease';
        element.style.height = height + 'px';
        
        element.addEventListener('transitionend', function handler() {
            element.style.height = 'auto';
            element.removeEventListener('transitionend', handler);
        });
    }

    function slideUp(element) {
        const height = element.scrollHeight;
        element.style.height = height + 'px';
        element.style.transition = 'height 0.3s ease';
        
        setTimeout(() => {
            element.style.height = '0';
        }, 10);
        
        element.addEventListener('transitionend', function handler() {
            element.style.display = 'none';
            element.style.height = 'auto';
            element.removeEventListener('transitionend', handler);
        });
    }

    // Initialize course
    function initializeCourse() {
        // Load saved progress
        loadSavedProgress();

        // If no saved progress, start from beginning
        if (!courseState.currentContent) {
            const firstSection = document.querySelector('.section-header');
            if (firstSection) {
                firstSection.classList.add('active');
            }

            const firstLink = document.querySelector('.section-content a');
            if (firstLink) {
                firstLink.click();
            }
        }
    }

    // Initialize interactive elements
    function initializeInteractiveElements() {
        // Add any interactive element initialization here
        // For example: code editors, quizzes, etc.
    }

    // Start initialization
    initializeCourse();
});
