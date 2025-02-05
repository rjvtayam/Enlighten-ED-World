document.addEventListener('DOMContentLoaded', () => {
    const topicLinks = document.querySelectorAll('.topics-nav a');
    const topics = document.querySelectorAll('.topic');

    // Smooth scrolling for navigation
    topicLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Interactive section highlighting
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const topicLink = document.querySelector(`.topics-nav a[href="#${entry.target.id}"]`);
            
            if (entry.isIntersecting) {
                topicLink.classList.add('active');
                entry.target.classList.add('highlight');
            } else {
                topicLink.classList.remove('active');
                entry.target.classList.remove('highlight');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    topics.forEach(topic => {
        observer.observe(topic);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Prevent mouse leave artifact
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
});