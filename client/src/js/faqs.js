document.addEventListener('DOMContentLoaded', function() {
    const faqSection = document.querySelector('#faq');
    if (faqSection) {
        // Get login URL from the FAQ section's data attribute
        const loginUrl = faqSection.dataset.loginUrl;
        loadFAQs(loginUrl);
    }
});

async function loadFAQs(loginUrl) {
    try {
        const response = await fetch('/api/faqs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success) {
            const faqContainer = document.querySelector('.faq-grid');
            if (!faqContainer) {
                console.error('FAQ container not found');
                return;
            }
            
            if (!data.faqs || data.faqs.length === 0) {
                faqContainer.innerHTML = '<p class="no-faqs">No FAQs available at the moment.</p>';
                return;
            }

            const faqsHTML = data.faqs.map(faq => `
                <div class="faq-item" data-faq-id="${faq.id}">
                    <div class="faq-question">
                        <h3>${faq.question}</h3>
                        <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                    </div>
                    <div class="faq-answer">
                        <div class="default-answer">
                            <p>${faq.answer}</p>
                        </div>
                        
                        ${data.is_authenticated ? `
                            <div class="community-answers-section">
                                <h4>
                                    <i class="fas fa-users"></i>
                                    Community Answers
                                </h4>
                                ${faq.user_answers && faq.user_answers.length > 0 ? `
                                    <div class="community-answers">
                                        ${faq.user_answers.map(answer => `
                                            <div class="user-answer">
                                                <p>${answer.answer}</p>
                                                <span class="answer-date">
                                                    <i class="far fa-clock"></i>
                                                    ${formatDate(answer.created_at)}
                                                </span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : `
                                    <div class="no-answers-prompt">
                                        <i class="far fa-comments"></i>
                                        <p>Be the first to share your answer with the community!</p>
                                    </div>
                                `}
                            </div>
                            <form class="add-answer-form" data-faq-id="${faq.id}">
                                <textarea 
                                    placeholder="Share your knowledge with the community..." 
                                    required
                                    maxlength="500"
                                ></textarea>
                                <div class="char-count">500 characters remaining</div>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-paper-plane"></i>
                                    Share Answer
                                </button>
                            </form>
                        ` : `
                            <div class="login-prompt">
                                <p>Join our community to share your knowledge!</p>
                                <a href="${loginUrl}" class="btn btn-primary">
                                    <i class="fas fa-sign-in-alt"></i>
                                    Login to Add Answer
                                </a>
                            </div>
                        `}
                    </div>
                </div>
            `).join('');

            faqContainer.innerHTML = faqsHTML;
            initializeCharCounters();
            initializeFAQToggles();
            
            // Add event listeners for answer forms
            document.querySelectorAll('.add-answer-form').forEach(form => {
                form.addEventListener('submit', submitAnswer);
            });
        }
    } catch (error) {
        console.error('Error loading FAQs:', error);
        const faqContainer = document.querySelector('.faq-grid');
        if (faqContainer) {
            faqContainer.innerHTML = '<p class="error">Failed to load FAQs. Please try again later.</p>';
        }
    }
}

function initializeFAQToggles() {
    document.querySelectorAll('.faq-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const wasActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const icon = item.querySelector('.faq-toggle i');
                if (icon) {
                    icon.className = 'fas fa-plus';
                }
            });
            
            // Toggle current FAQ
            if (!wasActive) {
                faqItem.classList.add('active');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-minus';
                }
            }
        });
    });
}

function initializeCharCounters() {
    document.querySelectorAll('.add-answer-form textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            const counter = this.closest('.add-answer-form').querySelector('.char-count');
            if (counter) {
                counter.textContent = `${remaining} characters remaining`;
            }
        });
    });
}

async function submitAnswer(event) {
    event.preventDefault();
    const form = event.target;
    const faqId = form.dataset.faqId;
    const textarea = form.querySelector('textarea');
    const answer = textarea.value.trim();

    if (!answer) return;

    try {
        const response = await fetch(`/api/faqs/${faqId}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answer })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            // Clear the form
            textarea.value = '';
            // Reload FAQs to show the new answer
            loadFAQs(form.querySelector('.login-prompt a').href);
            showNotification('Your answer has been added successfully!');
        } else {
            throw new Error(data.error || 'Failed to submit answer');
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        showNotification('Failed to submit answer. Please try again later.', 'error');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
