document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonials();
});

function initializeTestimonials() {
    const testimonialContainer = document.querySelector('.testimonials-grid');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let autoSlideInterval;
    const cardsPerSlide = 3;

    // Calculate number of slides needed (groups of 3 cards)
    const totalSlides = Math.ceil(testimonialCards.length / cardsPerSlide);

    // Initialize first set of cards
    showTestimonialGroup(0);
    if (navDots.length > 0) {
        navDots[0].classList.add('active');
    }

    // Setup auto-sliding
    startAutoSlide();

    // Add click handlers to dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showTestimonialGroup(index);
            startAutoSlide();
        });
    });

    // Add hover handlers to testimonials container
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
        testimonialContainer.addEventListener('mouseleave', startAutoSlide);
    }

    function showTestimonialGroup(slideIndex) {
        // Calculate start and end indices for current slide
        const startIdx = slideIndex * cardsPerSlide;
        const endIdx = Math.min(startIdx + cardsPerSlide, testimonialCards.length);

        // Hide all testimonials with fade effect
        testimonialCards.forEach(card => {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
                card.classList.remove('active');
            }, 300);
        });

        // Remove active class from all dots
        navDots.forEach(dot => dot.classList.remove('active'));

        // Show selected group of testimonials with fade effect
        setTimeout(() => {
            for (let i = startIdx; i < endIdx; i++) {
                if (testimonialCards[i]) {
                    testimonialCards[i].style.display = 'block';
                    testimonialCards[i].classList.add('active');
                    setTimeout(() => {
                        testimonialCards[i].style.opacity = '1';
                    }, 50);
                }
            }
        }, 300);
        
        navDots[slideIndex].classList.add('active');
        currentIndex = slideIndex;
    }

    function nextTestimonialGroup() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        showTestimonialGroup(nextIndex);
    }

    function startAutoSlide() {
        if (!autoSlideInterval && totalSlides > 1) {
            autoSlideInterval = setInterval(nextTestimonialGroup, 5000);
        }
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showTestimonialGroup(prevIndex);
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            const nextIndex = (currentIndex + 1) % totalSlides;
            showTestimonialGroup(nextIndex);
            startAutoSlide();
        }
    });

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, false);

    testimonialContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            stopAutoSlide();
            if (difference > 0) {
                // Swipe left - show next
                const nextIndex = (currentIndex + 1) % totalSlides;
                showTestimonialGroup(nextIndex);
            } else {
                // Swipe right - show previous
                const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                showTestimonialGroup(prevIndex);
            }
            startAutoSlide();
        }
    }

    // Function to add new testimonial
    window.addNewTestimonial = function(testimonialData) {
        // Create new testimonial card
        const newCard = createTestimonialCard(testimonialData);
        
        // Add to second slide if it exists
        const secondSlideStart = cardsPerSlide;
        const existingCards = testimonialContainer.querySelectorAll('.testimonial-card');
        
        if (existingCards.length >= secondSlideStart) {
            // Insert after the first slide
            testimonialContainer.insertBefore(newCard, existingCards[secondSlideStart]);
        } else {
            // Add to the end if second slide doesn't exist yet
            testimonialContainer.appendChild(newCard);
        }

        // Update total slides
        const newTotalSlides = Math.ceil((testimonialCards.length + 1) / cardsPerSlide);

        // Add new dot if needed
        if (newTotalSlides > totalSlides) {
            const dotsContainer = document.querySelector('.testimonial-nav');
            const newDot = document.createElement('span');
            newDot.className = 'nav-dot';
            newDot.addEventListener('click', () => {
                stopAutoSlide();
                showTestimonialGroup(newTotalSlides - 1);
                startAutoSlide();
            });
            dotsContainer.appendChild(newDot);
        }

        // Reinitialize the slider
        initializeTestimonials();
    };
}

// Helper function to create new testimonial card
function createTestimonialCard(data) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.style.opacity = '0'; // Start hidden for fade-in effect
    card.innerHTML = `
        <div class="testimonial-quote">
            <i class="fas fa-quote-right"></i>
        </div>
        <div class="testimonial-content">
            <div class="testimonial-rating">
                ${Array(data.rating).fill('<i class="fas fa-star"></i>').join('')}
            </div>
            <p class="testimonial-text">${data.text}</p>
        </div>
        <div class="testimonial-author">
            <img src="${data.authorImage}" alt="${data.authorName}" class="author-image">
            <div class="author-info">
                <h4 class="author-name">${data.authorName}</h4>
                <p class="author-title">${data.authorTitle}</p>
                <div class="author-badge">
                    <i class="fas fa-certificate"></i>
                    <span>${data.authorInstitution}</span>
                </div>
            </div>
        </div>
    `;
    
    // Fade in the new card
    setTimeout(() => {
        card.style.opacity = '1';
    }, 50);
    
    return card;
}