document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Flash Cards
    const flashCard = document.querySelector('.flash-card');
    const prevCardBtn = document.querySelector('.prev-card');
    const nextCardBtn = document.querySelector('.next-card');
    const cardCounter = document.querySelector('.card-counter');
    let currentCardIndex = 0;
    
    const flashCardsData = [
        {
            question: "What does HTML stand for?",
            answer: "HyperText Markup Language"
        },
        {
            question: "What is CSS used for?",
            answer: "Styling and laying out web pages"
        },
        {
            question: "What is JavaScript's primary purpose?",
            answer: "Adding interactivity to web pages"
        }
        // More cards will be added
    ];

    flashCard.addEventListener('click', () => {
        flashCard.classList.toggle('flipped');
    });

    function updateCard(index) {
        const card = flashCardsData[index];
        const frontContent = flashCard.querySelector('.flash-card-front p');
        const backContent = flashCard.querySelector('.flash-card-back p');
        
        frontContent.textContent = card.question;
        backContent.textContent = card.answer;
        cardCounter.textContent = `${index + 1}/${flashCardsData.length}`;
        
        flashCard.classList.remove('flipped');
    }

    prevCardBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCard(currentCardIndex);
        }
    });

    nextCardBtn.addEventListener('click', () => {
        if (currentCardIndex < flashCardsData.length - 1) {
            currentCardIndex++;
            updateCard(currentCardIndex);
        }
    });

    // Memory Game
    const memoryGameContainer = document.querySelector('.memory-game-grid');
    const movesDisplay = document.querySelector('.moves');
    const timerDisplay = document.querySelector('.timer');
    const restartBtn = document.querySelector('.restart-game');
    
    const memoryCards = [
        { id: 1, content: 'HTML' },
        { id: 2, content: 'CSS' },
        { id: 3, content: 'JS' },
        { id: 4, content: 'API' },
        { id: 5, content: 'DOM' },
        { id: 6, content: 'HTTP' }
        // Duplicate each card to create pairs
    ].flatMap(card => [card, {...card}]);

    let moves = 0;
    let gameTimer;
    let seconds = 0;
    let flippedCards = [];
    let matchedPairs = 0;

    function shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createMemoryCard(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.id = card.id;
        cardElement.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front"></div>
                <div class="memory-card-back">${card.content}</div>
            </div>
        `;
        return cardElement;
    }

    function initializeMemoryGame() {
        memoryGameContainer.innerHTML = '';
        moves = 0;
        seconds = 0;
        matchedPairs = 0;
        flippedCards = [];
        movesDisplay.textContent = 'Moves: 0';
        timerDisplay.textContent = 'Time: 0:00';
        
        const shuffledCards = shuffleCards([...memoryCards]);
        shuffledCards.forEach(card => {
            memoryGameContainer.appendChild(createMemoryCard(card));
        });
    }

    // Quiz
    const quizContainer = document.querySelector('.quiz-container');
    const progressBar = document.querySelector('.quiz-progress .progress-bar');
    const prevQuestionBtn = document.querySelector('.prev-question');
    const nextQuestionBtn = document.querySelector('.next-question');
    const submitQuizBtn = document.querySelector('.submit-quiz');
    
    const quizData = [
        {
            question: "Which tag is used to create a hyperlink in HTML?",
            options: [
                { text: "<link>", correct: false },
                { text: "<a>", correct: true },
                { text: "<href>", correct: false },
                { text: "<url>", correct: false }
            ]
        }
        // More questions will be added
    ];

    let currentQuestionIndex = 0;

    function updateQuizProgress() {
        const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showQuestion(index) {
        const question = quizData[index];
        const questionElement = document.querySelector('.quiz-question');
        
        questionElement.innerHTML = `
            <h3>Question ${index + 1}:</h3>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, i) => `
                    <label class="option">
                        <input type="radio" name="q${index}" value="${i}">
                        <span>${option.text}</span>
                    </label>
                `).join('')}
            </div>
        `;

        // Update navigation buttons
        prevQuestionBtn.disabled = index === 0;
        nextQuestionBtn.style.display = index === quizData.length - 1 ? 'none' : 'block';
        submitQuizBtn.style.display = index === quizData.length - 1 ? 'block' : 'none';
        
        updateQuizProgress();
    }

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
    function loadContent(contentId) {
        // Here you would typically make an AJAX call to load the content
        // For now, we'll just update the navigation state
        
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            // Update progress (this would normally be stored/loaded from backend)
            const progressBar = document.querySelector('.progress');
            const progressText = document.querySelector('.progress-text');
            
            // Example progress calculation
            const totalItems = document.querySelectorAll('.section-content a').length;
            const currentIndex = Array.from(document.querySelectorAll('.section-content a')).findIndex(link => 
                link.getAttribute('data-content') === contentId
            ) + 1;
            
            if (progressBar) {
                progressBar.style.width = `${(currentIndex / totalItems) * 100}%`;
            }
            if (progressText) {
                progressText.textContent = `Progress: ${currentIndex}/${totalItems} completed`;
            }

            // Update navigation buttons
            const prevButton = document.querySelector('.btn-secondary');
            const nextButton = document.querySelector('.btn-primary');
            
            if (prevButton) {
                prevButton.disabled = currentIndex === 1;
            }
            if (nextButton) {
                nextButton.disabled = currentIndex === totalItems;
            }
        }
    }

    // Initialize first section as active
    const firstSection = document.querySelector('.section-header');
    if (firstSection) {
        firstSection.classList.add('active');
    }

    // Initialize first link as active
    const firstLink = document.querySelector('.section-content a');
    if (firstLink) {
        firstLink.classList.add('active');
        loadContent(firstLink.getAttribute('data-content'));
    }

    // Initialize components
    updateCard(0);
    initializeMemoryGame();
    showQuestion(0);

    // Event listeners for quiz navigation
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });

    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    submitQuizBtn.addEventListener('click', () => {
        // Calculate and show results
        const answers = [];
        quizData.forEach((_, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected) {
                answers.push({
                    questionIndex: index,
                    selectedOption: parseInt(selected.value)
                });
            }
        });
        
        // Show results (implement this based on your needs)
        alert('Quiz submitted! Implementation of results display coming soon.');
    });

    // Add smooth scrolling for module cards
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add animation or interaction effects when clicking on modules
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 200);
        });
    });

    // Add progress tracking if user is logged in
    const checkProgress = async () => {
        try {
            const response = await fetch('/api/progress/wmad-beginner');
            const data = await response.json();
            
            if (data.progress) {
                updateProgressUI(data.progress);
            }
        } catch (error) {
            console.log('Not logged in or progress not available');
        }
    };

    const updateProgressUI = (progress) => {
        const modules = document.querySelectorAll('.module-card');
        modules.forEach((module, index) => {
            if (progress[index]) {
                module.classList.add('completed');
            }
        });
    };

    // Initialize progress if available
    checkProgress();
});
