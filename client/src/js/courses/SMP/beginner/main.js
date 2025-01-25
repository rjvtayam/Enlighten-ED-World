document.addEventListener('DOMContentLoaded', function() {
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
                }
            });
        });
    });

    // Navigation Links Click Handling
    const navLinks = document.querySelectorAll('.section-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(otherLink => otherLink.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Load content based on data-content attribute
            const contentId = link.getAttribute('data-content');
            loadContent(contentId);
        });
    });

    // Next/Previous Navigation
    const nextButton = document.querySelector('.btn-primary');
    const prevButton = document.querySelector('.btn-secondary');
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const currentLink = document.querySelector('.section-content a.active');
            if (currentLink) {
                const nextLink = currentLink.parentElement.nextElementSibling?.querySelector('a');
                if (nextLink) {
                    nextLink.click();
                } else {
                    // Try next section
                    const currentSection = currentLink.closest('.course-section');
                    const nextSection = currentSection.nextElementSibling;
                    if (nextSection) {
                        const firstLink = nextSection.querySelector('.section-content a');
                        if (firstLink) {
                            nextSection.querySelector('.section-header').classList.add('active');
                            firstLink.click();
                        }
                    }
                }
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const currentLink = document.querySelector('.section-content a.active');
            if (currentLink) {
                const prevLink = currentLink.parentElement.previousElementSibling?.querySelector('a');
                if (prevLink) {
                    prevLink.click();
                } else {
                    // Try previous section
                    const currentSection = currentLink.closest('.course-section');
                    const prevSection = currentSection.previousElementSibling;
                    if (prevSection) {
                        const links = prevSection.querySelectorAll('.section-content a');
                        const lastLink = links[links.length - 1];
                        if (lastLink) {
                            prevSection.querySelector('.section-header').classList.add('active');
                            lastLink.click();
                        }
                    }
                }
            }
        });
    }

    // Function to load content
    async function loadContent(contentId) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        try {
            // Here you would typically make an API call to fetch content
            // For now, we'll just update the UI state
            updateProgress(contentId);
            updateNavigationState(contentId);
            
            // Example of content loading (replace with actual API call)
            const response = await fetch(`/api/courses/smp/beginner/${contentId}`);
            if (response.ok) {
                const content = await response.json();
                updateContentArea(content);
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // Update progress bar and text
    function updateProgress(contentId) {
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        const totalItems = document.querySelectorAll('.section-content a').length;
        const currentIndex = Array.from(document.querySelectorAll('.section-content a')).findIndex(link => 
            link.getAttribute('data-content') === contentId
        ) + 1;
        
        if (progressBar) {
            progressBar.style.width = `${(currentIndex / totalItems) * 100}%`;
        }
        if (progressText) {
            progressText.textContent = `Progress: ${currentIndex}/${totalItems} lessons completed`;
        }
    }

    // Update navigation button states
    function updateNavigationState(contentId) {
        const prevButton = document.querySelector('.btn-secondary');
        const nextButton = document.querySelector('.btn-primary');
        
        const links = Array.from(document.querySelectorAll('.section-content a'));
        const currentIndex = links.findIndex(link => link.getAttribute('data-content') === contentId);
        
        if (prevButton) {
            prevButton.disabled = currentIndex === 0;
        }
        if (nextButton) {
            nextButton.disabled = currentIndex === links.length - 1;
        }
    }

    // Update content area with new content
    function updateContentArea(content) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        // Update title
        const title = contentArea.querySelector('h1');
        if (title && content.title) {
            title.textContent = content.title;
        }

        // Update video if present
        const video = contentArea.querySelector('video source');
        if (video && content.videoUrl) {
            video.src = content.videoUrl;
            video.parentElement.load();
        }

        // Update content text
        const contentText = contentArea.querySelector('.content-text');
        if (contentText && content.html) {
            contentText.innerHTML = content.html;
        }
    }

    // Initialize first section and content
    const firstSection = document.querySelector('.section-header');
    if (firstSection) {
        firstSection.classList.add('active');
    }

    const firstLink = document.querySelector('.section-content a');
    if (firstLink) {
        firstLink.classList.add('active');
        loadContent(firstLink.getAttribute('data-content'));
    }

    // Track course progress
    function trackProgress() {
        // Here you would typically make an API call to save progress
        const progress = {
            courseId: 'smp-beginner',
            completedItems: document.querySelectorAll('.section-content a.completed').length,
            totalItems: document.querySelectorAll('.section-content a').length,
            lastAccessedContent: document.querySelector('.section-content a.active')?.getAttribute('data-content')
        };

        // Example API call (implement actual endpoint)
        // fetch('/api/progress/update', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(progress)
        // });
    }

    // Call trackProgress when user completes a section or leaves the page
    window.addEventListener('beforeunload', trackProgress);
});
