document.addEventListener('DOMContentLoaded', () => {
    // Configuration for YouTube Tutorial Videos
    const youtubeVideos = [
        'https://www.youtube.com/embed/dQw4w9WgXcQ',  // Placeholder video links
        'https://www.youtube.com/embed/another-tutorial',
        'https://www.youtube.com/embed/third-tutorial'
    ];

    const videoContainer = document.querySelector('.video-container iframe');
    let currentVideoIndex = 0;

    // Video Rotation Function
    function rotateVideo() {
        if (videoContainer) {
            videoContainer.src = youtubeVideos[currentVideoIndex];
            currentVideoIndex = (currentVideoIndex + 1) % youtubeVideos.length;
        }
    }

    // Rotate video every 5 minutes
    if (videoContainer) {
        setInterval(rotateVideo, 5 * 60 * 1000);
    }

    // External Link Tracking and Analytics
    function trackExternalLink(link, category) {
        try {
            // Placeholder for advanced analytics tracking
            console.log(`Clicked ${category} link: ${link.href}`);
            
            // Example: Google Analytics tracking (if implemented)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'external_link_click', {
                    'event_category': category,
                    'event_label': link.href
                });
            }
        } catch (error) {
            console.error('Link tracking error:', error);
        }
    }

    // Track Extension and Resource Links
    const extensionLinks = document.querySelectorAll('.install-btn');
    const resourceLinks = document.querySelectorAll('.resource-card a');

    extensionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            trackExternalLink(link, 'VSCode Extension');
        });
    });

    resourceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            trackExternalLink(link, 'Learning Resource');
        });
    });

    // Interactive Tool Card Tooltips
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const details = card.querySelector('.tool-details');
        
        card.addEventListener('mouseenter', () => {
            if (details) {
                details.style.opacity = '1';
                details.style.visibility = 'visible';
                details.style.transform = 'translateY(0)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (details) {
                details.style.opacity = '0';
                details.style.visibility = 'hidden';
                details.style.transform = 'translateY(10px)';
            }
        });
    });

    // Smooth Scroll to Sections
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Error Handling and Logging
    window.addEventListener('error', (event) => {
        console.error('Unhandled error:', event.error);
        // Optional: Send error to logging service
    });
});