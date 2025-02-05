// Type Checker Practice
document.getElementById('checkTypeBtn').addEventListener('click', function() {
    const input = document.getElementById('variableInput');
    const result = document.getElementById('typeResult');
    const value = input.value;

    // Determine the type of input
    let type = typeof value;
    
    // Special handling for empty string and numeric strings
    if (value === '') {
        type = 'empty';
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        type = 'number';
    }

    // Display result with styling
    result.innerHTML = `
        <strong>Value:</strong> ${value}<br>
        <strong>Type:</strong> ${type}
    `;

    // Add color coding
    switch(type) {
        case 'string':
            result.style.color = '#3498db';
            break;
        case 'number':
            result.style.color = '#2ecc71';
            break;
        case 'boolean':
            result.style.color = '#e74c3c';
            break;
        default:
            result.style.color = '#34495e';
    }
});

// Variable Manipulation Practice
document.getElementById('multiplyBtn').addEventListener('click', function() {
    const input = document.getElementById('numberInput');
    const result = document.getElementById('multiplyResult');
    const number = parseFloat(input.value);

    if (isNaN(number)) {
        result.textContent = 'Please enter a valid number';
        result.style.color = 'red';
    } else {
        const multipliedValue = number * 2;
        result.innerHTML = `
            <strong>Original Number:</strong> ${number}<br>
            <strong>Multiplied by 2:</strong> ${multipliedValue}
        `;
        result.style.color = '#2ecc71';
    }
});

// Additional Interactive Demonstrations
console.log("Variables & Data Types module loaded!");

// Demonstrate dynamic typing
function demonstrateDynamicTyping() {
    let dynamicVar = 42;
    console.log("Initial type:", typeof dynamicVar);
    
    dynamicVar = "Now I'm a string";
    console.log("Changed type:", typeof dynamicVar);
}

// Demonstrate type coercion
function demonstrateTypeCoercion() {
    console.log("5" + 3);     // Outputs: "53"
    console.log("5" - 3);     // Outputs: 2
    console.log(5 + "3");     // Outputs: "53"
}

// Run demonstrations
demonstrateDynamicTyping();
demonstrateTypeCoercion();

// Quiz Questions
const quizQuestions = [
    {
        question: "What is the correct way to declare a variable that cannot be reassigned?",
        options: [
            "var name = 'John'",
            "let name = 'John'",
            "const name = 'John'",
            "variable name = 'John'"
        ],
        correctAnswer: 2,
        explanation: "The 'const' keyword is used to declare a variable that cannot be reassigned."
    },
    {
        question: "Which of the following is a primitive data type in JavaScript?",
        options: [
            "Array",
            "Object",
            "String",
            "Function"
        ],
        correctAnswer: 2,
        explanation: "String is a primitive data type in JavaScript."
    },
    {
        question: "What will be the result of: let x = '5' + 3?",
        options: [
            "8",
            "53",
            "Error",
            "Undefined"
        ],
        correctAnswer: 1,
        explanation: "In JavaScript, when a string and a number are added, type coercion occurs and the result is a string."
    },
    {
        question: "What does typeof return for null?",
        options: [
            "null",
            "undefined",
            "object",
            "string"
        ],
        correctAnswer: 2,
        explanation: "Interestingly, 'typeof null' returns 'object', which is considered a historical bug in JavaScript."
    },
    {
        question: "Which variable declaration allows reassignment?",
        options: [
            "const",
            "let",
            "var",
            "None of the above"
        ],
        correctAnswer: 1,
        explanation: "'let' allows you to reassign values to the variable after its initial declaration."
    }
];

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 300; // 5 minutes
        this.timer = null;
        this.userAnswers = new Array(questions.length).fill(null);
    }

    init() {
        this.renderQuestion();
        this.startTimer();
        this.attachEventListeners();
    }

    renderQuestion() {
        const questionContainer = document.getElementById('quiz-questions');
        const currentQuestion = this.questions[this.currentQuestionIndex];

        questionContainer.innerHTML = `
            <div class="question">
                <p>${currentQuestion.question}</p>
                <div class="options">
                    ${currentQuestion.options.map((option, index) => `
                        <label>
                            <input type="radio" name="question" value="${index}">
                            ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        prevBtn.style.display = this.currentQuestionIndex > 0 ? 'inline-block' : 'none';
        nextBtn.style.display = this.currentQuestionIndex < this.questions.length - 1 ? 'inline-block' : 'none';
        submitBtn.style.display = this.currentQuestionIndex === this.questions.length - 1 ? 'inline-block' : 'none';
    }

    checkAnswer() {
        const selectedOption = document.querySelector('input[name="question"]:checked');
        if (selectedOption) {
            const selectedAnswer = parseInt(selectedOption.value);
            this.userAnswers[this.currentQuestionIndex] = selectedAnswer;
            const currentQuestion = this.questions[this.currentQuestionIndex];

            if (selectedAnswer === currentQuestion.correctAnswer) {
                this.score++;
            }
        }
    }

    nextQuestion() {
        this.checkAnswer();
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
        }
    }

    submitQuiz() {
        this.checkAnswer();
        clearInterval(this.timer);
        
        const quizContainer = document.getElementById('quiz');
        const resultsContainer = document.getElementById('results');
        const detailedResults = document.getElementById('detailed-results');

        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        const scorePercentage = Math.round((this.score / this.questions.length) * 100);
        
        let resultMessage = '';
        if (scorePercentage === 100) {
            resultMessage = "🏆 Perfect Score! You're a Variables Expert!";
        } else if (scorePercentage >= 80) {
            resultMessage = "👍 Great Job! You understand Variables well.";
        } else if (scorePercentage >= 60) {
            resultMessage = "📚 Good effort! Keep learning.";
        } else {
            resultMessage = "🤔 Don't worry! Learning takes time.";
        }

        const scoreElement = document.getElementById('score');
        const totalElement = document.getElementById('total-questions');
        const messageElement = document.getElementById('result-message');
        const retakeContainer = document.getElementById('retake-container');

        this.animateValue(scoreElement, 0, this.score, 1000);
        totalElement.textContent = this.questions.length;
        messageElement.textContent = resultMessage;

        let detailedHtml = this.questions.map((question, index) => {
            const isCorrect = question.correctAnswer === this.userAnswers[index];
            return `
                <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="result-header">
                        <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
                            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    </div>
                    <p><strong>Q${index + 1}:</strong> ${question.question}</p>
                    <p>Your Answer: ${question.options[this.userAnswers[index]]}</p>
                    <p>Correct Answer: ${question.options[question.correctAnswer]}</p>
                    <p class="explanation">${question.explanation}</p>
                </div>
            `;
        }).join('');

        detailedResults.innerHTML = detailedHtml;

        retakeContainer.innerHTML = `
            <div class="retake-options">
                <button id="retake-quiz-btn" class="btn btn-primary">Retake Quiz</button>
                <button id="review-btn" class="btn btn-secondary">Review Concepts</button>
            </div>
        `;

        document.getElementById('retake-quiz-btn').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('review-btn').addEventListener('click', () => this.reviewConcepts());
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    retakeQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 300;
        this.userAnswers = new Array(this.questions.length).fill(null);

        document.getElementById('results').classList.add('hidden');
        document.getElementById('quiz').classList.remove('hidden');

        this.init();
    }

    reviewConcepts() {
        window.scrollTo({
            top: document.getElementById('quiz-section').offsetTop,
            behavior: 'smooth'
        });
    }

    startTimer() {
        const timerDisplay = document.getElementById('time');
        this.timer = setInterval(() => {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.submitQuiz();
            }
        }, 1000);
    }

    attachEventListeners() {
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('submit-btn').addEventListener('click', () => this.submitQuiz());
    }
}

// Initialize Quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz(quizQuestions);
    quiz.init();
});