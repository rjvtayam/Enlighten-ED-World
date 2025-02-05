document.addEventListener('DOMContentLoaded', () => {
    // Quiz Section
    const quizContainer = document.getElementById('htmlQuiz');
    const correctCountDisplay = document.getElementById('correctCount');
    const totalQuestionsDisplay = document.getElementById('totalQuestions');
    const progressFill = document.getElementById('progressFill');

    // Detailed Quiz Questions
    const quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language", 
                "Hyperlink and Text Markup Language"
            ],
            correctAnswer: 0,
            explanation: "HTML stands for HyperText Markup Language, the standard language for creating web pages."
        },
        {
            question: "Which tag creates a hyperlink?",
            options: ["<link>", "<a>", "<href>"],
            correctAnswer: 1,
            explanation: "The <a> tag is used to create hyperlinks in HTML."
        },
        {
            question: "What is the correct HTML element for the largest heading?",
            options: ["<heading>", "<h6>", "<h1>"],
            correctAnswer: 2,
            explanation: "<h1> is the largest heading in HTML."
        },
        {
            question: "Which attribute specifies an alternate text for an image?",
            options: ["src", "href", "alt"],
            correctAnswer: 2,
            explanation: "The 'alt' attribute provides alternative text for an image if it cannot be displayed."
        },
        {
            question: "Which HTML element defines the title of a document?",
            options: ["<head>", "<title>", "<meta>"],
            correctAnswer: 1,
            explanation: "The <title> element specifies the title of an HTML document."
        }
    ];

    // Quiz Generation Function
    function createQuiz() {
        // Clear any existing quiz content
        quizContainer.innerHTML = '';
        
        // Reset score tracking
        let correctAnswers = 0;

        // Generate quiz questions
        quizQuestions.forEach((question, index) => {
            // Create quiz card
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');
            
            // Question text
            const questionTitle = document.createElement('h3');
            questionTitle.textContent = `${index + 1}. ${question.question}`;
            quizCard.appendChild(questionTitle);

            // Options container
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('quiz-options');

            // Create option buttons
            question.options.forEach((option, optIndex) => {
                const optionButton = document.createElement('button');
                optionButton.classList.add('quiz-option');
                optionButton.textContent = option;
                
                // Set data attributes for checking
                optionButton.dataset.correct = optIndex === question.correctAnswer;
                
                // Click event handler
                optionButton.addEventListener('click', function() {
                    // Disable all buttons in this question
                    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
                        btn.disabled = true;
                    });

                    // Highlight correct and selected options
                    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
                        if (btn.dataset.correct === 'true') {
                            btn.classList.add('correct');
                        }
                        
                        if (btn === this) {
                            if (this.dataset.correct === 'true') {
                                this.classList.add('correct');
                                correctAnswers++;
                                
                                // Update score and progress
                                correctCountDisplay.textContent = correctAnswers;
                                const progressPercentage = (correctAnswers / quizQuestions.length) * 100;
                                progressFill.style.width = `${progressPercentage}%`;
                            } else {
                                this.classList.add('incorrect');
                            }
                        }
                    });

                    // Create and show explanation
                    const explanationElement = document.createElement('div');
                    explanationElement.classList.add('explanation');
                    explanationElement.textContent = question.explanation;
                    quizCard.appendChild(explanationElement);
                });

                // Add option to container
                optionsContainer.appendChild(optionButton);
            });

            // Add options to quiz card
            quizCard.appendChild(optionsContainer);

            // Add quiz card to container
            quizContainer.appendChild(quizCard);
        });

        // Set total questions
        totalQuestionsDisplay.textContent = quizQuestions.length;
    }

    // Initialize Quiz
    createQuiz();
});