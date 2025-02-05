document.addEventListener('DOMContentLoaded', () => {
    // Video Playlist Functionality
    const videoPlayer = document.getElementById('cssIntroVideo');
    const videoTitle = document.getElementById('currentVideoTitle');
    const playlistButtons = document.querySelectorAll('.playlist-btn');

    const videoPlaylist = {
        'qz0aGYrrlhU': 'CSS Basics',
        'ysEN5RaKOlA': 'Advanced CSS Techniques',
        '3PHXvlpVIRk': 'CSS Best Practices'
    };

    playlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            playlistButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const videoId = button.dataset.video;
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
            videoTitle.textContent = videoPlaylist[videoId];
        });
    });

    // CSS Playground Functionality
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const cssPreviewFrame = document.getElementById('cssPreviewFrame');
    const renderButton = document.getElementById('renderButton');
    const resetButton = document.getElementById('resetButton');

    // Render CSS and HTML
    renderButton.addEventListener('click', () => {
        const htmlContent = htmlEditor.value;
        const cssContent = cssEditor.value;

        const previewDocument = cssPreviewFrame.contentDocument;
        previewDocument.open();
        previewDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        min-height: 100vh; 
                        margin: 0; 
                        background-color: #f4f6f7; 
                    }
                    ${cssContent}
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        previewDocument.close();
    });

    // Reset Playground
    resetButton.addEventListener('click', () => {
        htmlEditor.value = `
&lt;div class="container"&gt;
    &lt;h1&gt;Welcome to CSS&lt;/h1&gt;
    &lt;p&gt;This is a paragraph.&lt;/p&gt;
    &lt;button&gt;Click Me&lt;/button&gt;
&lt;/div&gt;`;
        cssEditor.value = `
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
}

h1 {
    color: #3498db;
    text-align: center;
}

p {
    font-size: 16px;
    line-height: 1.6;
}

button {
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
}`;

        // Clear preview
        const previewDocument = cssPreviewFrame.contentDocument;
        previewDocument.open();
        previewDocument.write('');
        previewDocument.close();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Previous code remains the same...

    // CSS Quiz Section
    const quizQuestions = [
        {
            question: "What does CSS stand for?",
            options: [
                "Creative Style Sheets",
                "Cascading Style Sheets",
                "Computer Style Sheets",
                "Colorful Style Sheets"
            ],
            correctAnswer: 1,
            explanation: "CSS stands for Cascading Style Sheets, used for describing the presentation of a document."
        },
        {
            question: "Which CSS property changes text color?",
            options: [
                "text-color",
                "font-color",
                "color",
                "text-style"
            ],
            correctAnswer: 2,
            explanation: "The 'color' property is used to change text color in CSS."
        },
        {
            question: "How do you select all paragraphs in CSS?",
            options: [
                "#paragraph",
                ".paragraph",
                "paragraph",
                "p"
            ],
            correctAnswer: 3,
            explanation: "Use 'p' to select all paragraph elements in CSS."
        },
        {
            question: "Which unit is relative to the parent element's font size?",
            options: [
                "px",
                "em",
                "rem",
                "vh"
            ],
            correctAnswer: 1,
            explanation: "'em' is relative to the parent element's font size."
        },
        {
            question: "What does 'margin: 0 auto;' do?",
            options: [
                "Removes all margins",
                "Centers an element horizontally",
                "Adds equal margins",
                "Creates vertical spacing"
            ],
            correctAnswer: 1,
            explanation: "'margin: 0 auto;' centers a block-level element horizontally."
        }
    ];

    const quizContainer = document.getElementById('cssQuiz');
    const quizQuestionsContainer = document.getElementById('quizQuestions');
    const progressFill = document.getElementById('progressFill');
    const correctCountDisplay = document.getElementById('correctCount');
    const quizResultsContainer = document.getElementById('quizResults');
    const finalScoreDisplay = document.getElementById('finalScore');
    const retakeQuizBtn = document.getElementById('retakeQuizBtn');

    let currentQuestions = [];
    let correctAnswers = 0;

    function shuffleQuestions() {
        currentQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    function generateQuiz() {
        quizQuestionsContainer.innerHTML = '';
        correctAnswers = 0;
        correctCountDisplay.textContent = '0';
        progressFill.style.width = '0%';

        currentQuestions.forEach((q, index) => {
            const questionCard = document.createElement('div');
            questionCard.classList.add('quiz-question');
            
            questionCard.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>
                <div class="quiz-options">
                    ${q.options.map((option, optIndex) => `
                        <button 
                            class="quiz-option" 
                            data-correct="${optIndex === q.correctAnswer}"
                        >
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="explanation" id="explanation-${index}" style="display:none; margin-top: 10px;"></div>
            `;
            
            quizQuestionsContainer.appendChild(questionCard);

            // Add event listeners to options after they are created
            const optionButtons = questionCard.querySelectorAll('.quiz-option');
            optionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    checkQuizAnswer(this, q.explanation, index);
                });
            });
        });

        quizResultsContainer.style.display = 'none';
        quizQuestionsContainer.style.display = 'grid';
    }

    // Answer checking function
    function checkQuizAnswer(button, explanation, questionIndex) {
        const isCorrect = button.dataset.correct === 'true';
        const optionsContainer = button.closest('.quiz-question');
        const explanationElement = optionsContainer.querySelector('.explanation');
        
        // Disable all options
        optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('correct', 'incorrect');
        });

        // Highlight correct and selected options
        optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            }
            
            if (btn === button) {
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });

        // Show explanation
        explanationElement.textContent = explanation;
        explanationElement.style.display = 'block';

        // Update score if correct
        if (isCorrect) {
            correctAnswers++;
            correctCountDisplay.textContent = correctAnswers;
            
            // Update progress bar
            const progressPercentage = (correctAnswers / currentQuestions.length) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }

        // Check if all questions are answered
        const allQuestionsAnswered = 
            optionsContainer.closest('#quizQuestions')
            .querySelectorAll('.quiz-option:disabled').length === currentQuestions.length * 4;

        if (allQuestionsAnswered) {
            setTimeout(() => {
                quizQuestionsContainer.style.display = 'none';
                quizResultsContainer.style.display = 'block';
                finalScoreDisplay.textContent = `${correctAnswers}/${currentQuestions.length}`;
            }, 1500);
        }
    }

    // Retake Quiz
    retakeQuizBtn.addEventListener('click', () => {
        shuffleQuestions();
        generateQuiz();
    });

    // Initialize Quiz
    shuffleQuestions();
    generateQuiz();
});