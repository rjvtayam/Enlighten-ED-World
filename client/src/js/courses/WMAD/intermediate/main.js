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
            question: "What is the Virtual DOM in React?",
            answer: "A lightweight copy of the actual DOM that React uses to optimize rendering performance by minimizing direct DOM manipulation"
        },
        {
            question: "What are React Hooks?",
            answer: "Functions that allow you to use state and other React features in functional components"
        },
        {
            question: "What is Redux?",
            answer: "A predictable state container for JavaScript apps, commonly used with React for state management"
        },
        {
            question: "What is Node.js?",
            answer: "A JavaScript runtime built on Chrome's V8 JavaScript engine that allows running JavaScript on the server"
        }
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
        { id: 1, content: 'React' },
        { id: 2, content: 'Node.js' },
        { id: 3, content: 'Redux' },
        { id: 4, content: 'Express' },
        { id: 5, content: 'MongoDB' },
        { id: 6, content: 'GraphQL' }
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
            question: "Which hook in React is used to perform side effects in function components?",
            options: [
                { text: "useState", correct: false },
                { text: "useEffect", correct: true },
                { text: "useContext", correct: false },
                { text: "useReducer", correct: false }
            ]
        },
        {
            question: "What is the purpose of Redux middleware?",
            options: [
                { text: "To handle asynchronous actions", correct: true },
                { text: "To style components", correct: false },
                { text: "To create routes", correct: false },
                { text: "To validate forms", correct: false }
            ]
        },
        {
            question: "What is the purpose of Express.js?",
            options: [
                { text: "Frontend framework", correct: false },
                { text: "Database management", correct: false },
                { text: "Web application framework for Node.js", correct: true },
                { text: "Testing framework", correct: false }
            ]
        }
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
        
        // Calculate score
        const correctAnswers = answers.filter(answer => 
            quizData[answer.questionIndex].options[answer.selectedOption].correct
        ).length;
        
        alert(`You got ${correctAnswers} out of ${quizData.length} questions correct!`);
    });
});
