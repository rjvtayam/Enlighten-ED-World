document.addEventListener('DOMContentLoaded', () => {
    // Quiz Questions
    const quizQuestions = [
        {
            question: "What does 'box-sizing: border-box' do?",
            options: [
                "Includes padding and border in the element's total width",
                "Removes the border from the element",
                "Increases the element's width",
                "Reduces the element's padding"
            ],
            correctAnswer: 0,
            explanation: "border-box ensures that padding and border are included in the element's total width, preventing unexpected layout issues."
        },
        {
            question: "Which CSS property controls the space between an element's content and its border?",
            options: [
                "margin",
                "spacing",
                "padding",
                "border-space"
            ],
            correctAnswer: 2,
            explanation: "Padding creates space between the content and the border of an element."
        },
        {
            question: "In Flexbox, what does 'justify-content: space-between' do?",
            options: [
                "Centers the flex items",
                "Distributes items with equal space between them",
                "Adds space around the items",
                "Removes space between items"
            ],
            correctAnswer: 1,
            explanation: "space-between distributes flex items evenly, with the first item at the start and the last item at the end of the container."
        }
    ];

    // Code Challenges
    const codeChallenges = [
        {
            description: "Create a CSS rule that sets a div to be 200px wide with 20px padding and a 2px solid blue border",
            expectedCode: /width:\s*200px;\s*padding:\s*20px;\s*border:\s*2px\s*solid\s*blue;/i,
            hint: "Use width, padding, and border properties"
        },
        {
            description: "Write a media query that applies styles when the screen width is 600px or less",
            expectedCode: /@media\s*screen\s*and\s*\(max-width:\s*600px\)/i,
            hint: "Use @media with max-width"
        }
    ];

    // Quiz Elements
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const progressIndicator = document.getElementById('progress-indicator');
    const quizScore = document.getElementById('quiz-score');

    // Code Challenge Elements
    const codeInput = document.getElementById('code-input');
    const codeFeedback = document.getElementById('code-feedback');
    const submitCodeBtn = document.getElementById('submit-code');

    // Quiz State
    let currentQuestionIndex = 0;
    let score = 0;

    // Render Quiz Question
    function renderQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;

        // Clear previous options
        answerOptions.innerHTML = '';

        // Create answer options
        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.classList.add('quiz-option');
            optionButton.addEventListener('click', () => checkAnswer(index));
            answerOptions.appendChild(optionButton);
        });

        // Update progress
        updateProgress();
    }

    // Check Answer
    function checkAnswer(selectedIndex) {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        // Remove previous selection styles
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
        });

        // Style selected options
        const selectedButton = answerOptions.children[selectedIndex];
        if (selectedIndex === currentQuestion.correctAnswer) {
            selectedButton.classList.add('correct');
            score++;
        } else {
            selectedButton.classList.add('incorrect');
            // Highlight correct answer
            answerOptions.children[currentQuestion.correctAnswer].classList.add('correct');
        }

        // Show explanation
        const explanationDiv = document.createElement('div');
        explanationDiv.classList.add('question-explanation');
        explanationDiv.textContent = currentQuestion.explanation;
        answerOptions.appendChild(explanationDiv);

        // Move to next question after a delay
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                renderQuestion();
            } else {
                finishQuiz();
            }
        }, 2000);

        // Update score display
        quizScore.textContent = `Score: ${score}/${quizQuestions.length}`;
    }

    // Update Progress
    function updateProgress() {
        const progressPercentage = (currentQuestionIndex / quizQuestions.length) * 100;
        progressIndicator.style.width = `${progressPercentage}%`;
    }

    // Finish Quiz
    function finishQuiz() {
        questionText.textContent = `Quiz Completed! Your Score: ${score}/${quizQuestions.length}`;
        answerOptions.innerHTML = '';
    }

    // Code Challenge
    function runCodeChallenge() {
        const currentChallenge = codeChallenges[0]; // Currently using first challenge
        const userCode = codeInput.value;

        // Check if code matches expected pattern
        if (currentChallenge.expectedCode.test(userCode)) {
            codeFeedback.textContent = '✅ Correct! Great job implementing the CSS.';
            codeFeedback.style.color = 'green';
        } else {
            codeFeedback.textContent = `❌ Not quite right. ${currentChallenge.hint}`;
            codeFeedback.style.color = 'red';
        }
    }

    // Initialize Quiz
    renderQuestion();

    // Code Challenge Submit
    submitCodeBtn.addEventListener('click', runCodeChallenge);
});

document.addEventListener('DOMContentLoaded', () => {
    // Comprehensive CSS Challenges
    const codeChallenges = [
        {
            title: "Challenge 1: Center an Element",
            description: "Write CSS to center a div with the class .box both horizontally and vertically using Flexbox.",
            initialCode: `
/* HTML Structure:
<div class="parent">
    <div class="box">Centered Content</div>
</div>
*/

.parent {
    /* Your CSS here */
}

.box {
    /* Your CSS here */
}
            `,
            expectedCode: {
                mustContain: [
                    'display: flex',
                    'justify-content: center',
                    'align-items: center'
                ]
            },
            hints: [
                "Use display: flex on the parent container",
                "justify-content centers horizontally",
                "align-items centers vertically"
            ],
            solution: `
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full viewport height */
}

.box {
    /* Additional styling for the box if needed */
    background-color: #3498db;
    color: white;
    padding: 20px;
}
            `
        },
        {
            title: "Challenge 2: Responsive Two-Column Layout",
            description: "Create a two-column layout using CSS Grid that becomes vertical on small screens.",
            initialCode: `
/* HTML Structure:
<div class="grid-container">
    <div class="column left">Left Column</div>
    <div class="column right">Right Column</div>
</div>
*/

.grid-container {
    /* Your CSS here */
}

.column {
    /* Your CSS here */
}
            `,
            expectedCode: {
                mustContain: [
                    'display: grid',
                    'grid-template-columns',
                    '@media'
                ]
            },
            hints: [
                "Use display: grid for the container",
                "Use grid-template-columns for layout",
                "Implement a media query for responsive design"
            ],
            solution: `
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.column {
    background-color: #f1f1f1;
    padding: 20px;
}

@media (max-width: 600px) {
    .grid-container {
        grid-template-columns: 1fr;
    }
}
            `
        },
        {
            title: "Challenge 3: Sticky Footer",
            description: "Implement a sticky footer using CSS Flexbox that always stays at the bottom of the page.",
            initialCode: `
/* HTML Structure:
<div class="page-container">
    <div class="content">Main Content</div>
    <footer>Footer</footer>
</div>
*/

body, html {
    height: 100%;
    margin: 0;
}

.page-container {
    /* Your CSS here */
}

.content {
    /* Your CSS here */
}

footer {
    /* Your CSS here */
}
            `,
            expectedCode: {
                mustContain: [
                    'display: flex',
                    'flex-direction: column',
                    'min-height: 100vh',
                    'flex: 1'
                ]
            },
            hints: [
                "Use display: flex with flex-direction: column on the page container",
                "Set min-height: 100vh to full viewport height",
                "Use flex: 1 on the content to push the footer down"
            ],
            solution: `
body, html {
    height: 100%;
    margin: 0;
}

.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex: 1;
}

footer {
    background-color: #2c3e50;
    color: white;
    padding: 20px;
    text-align: center;
}
            `
        },
        {
            title: "Challenge 4: Equal-Height Columns",
            description: "Create a layout with equal-height columns using Flexbox, regardless of content.",
            initialCode: `
/* HTML Structure:
<div class="container">
    <div class="column">Column 1 Content</div>
    <div class="column">Column 2 Content</div>
    <div class="column">Column 3 Content</div>
</div>
*/

.container {
    /* Your CSS here */
}

.column {
    /* Your CSS here */
}
            `,
            expectedCode: {
                mustContain: [
                    'display: flex',
                    'flex: 1'
                ]
            },
            hints: [
                "Use display: flex on the container",
                "Apply flex: 1 to columns to make them equal width and height"
            ],
            solution: `
.container {
    display: flex;
    gap: 20px;
}

.column {
    flex: 1;
    background-color: #f1f1f1;
    padding: 20px;
}
            `
        },
        {
            title: "Challenge 5: Card Hover Effect",
            description: "Create a card with a smooth hover effect using CSS transitions.",
            initialCode: `
/* HTML Structure:
<div class="card">
    <h3>Card Title</h3>
    <p>Card Content</p>
</div>
*/

.card {
    /* Your CSS here */
}

.card:hover {
    /* Your hover styles here */
}
            `,
            expectedCode: {
                mustContain: [
                    'box-shadow',
                    'transition',
                    'transform: scale'
                ]
            },
            hints: [
                "Use box-shadow for default and hover states",
                "Add transition for smooth effect",
                "Use transform: scale() for hover growth"
            ],
            solution: `
.card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
    transform: scale(1.05);
}
            `
        }
    ];

    // DOM Elements
    const challengeTitle = document.getElementById('challenge-title');
    const challengeDescription = document.getElementById('challenge-description');
    const codeInput = document.getElementById('code-input');
    const codeFeedback = document.getElementById('code-feedback');
    const submitCodeBtn = document.getElementById('submit-code');
    const solutionBtn = document.createElement('button');

    // State Management
    let currentChallengeIndex = 0;

    // Render Code Challenge
    function renderCodeChallenge() {
        const currentChallenge = codeChallenges[currentChallengeIndex];
        
        // Update challenge details
        challengeTitle.textContent = currentChallenge.title;
        challengeDescription.textContent = currentChallenge.description;
        
        // Set initial code
        codeInput.value = currentChallenge.initialCode.trim();
        
        // Reset feedback
        codeFeedback.innerHTML = '';

        // Create solution button
        solutionBtn.textContent = 'Show Solution';
        solutionBtn.classList.add('solution-btn');
        solutionBtn.addEventListener('click', () => {
            codeFeedback.innerHTML = `
                <h4>Solution:</h4>
                <pre><code>${currentChallenge.solution.trim()}</code></pre>
            `;
        });
        
        // Append solution button if not already added
        if (!document.querySelector('.solution-btn')) {
            submitCodeBtn.parentNode.insertBefore(solutionBtn, submitCodeBtn.nextSibling);
        }
    }

    // Validate Code Challenge
    function validateCodeChallenge() {
        const currentChallenge = codeChallenges[currentChallengeIndex];
        const userCode = codeInput.value;
        let feedback = [];

        // Check for must-contain elements
        if (currentChallenge.expectedCode.mustContain) {
            currentChallenge.expectedCode.mustContain.forEach(requiredCode => {
                if (!userCode.toLowerCase().includes(requiredCode.toLowerCase())) {
                    feedback.push(`❌ Missing: ${requiredCode}`);
                }
            });
        }

        // Provide feedback
        if (feedback.length === 0) {
            codeFeedback.innerHTML = '✅ Excellent! Challenge solved perfectly.';
            codeFeedback.style.color = 'green';
            
            // Move to next challenge or show completion
            currentChallengeIndex++;
            if (currentChallengeIndex < codeChallenges.length) {
                renderCodeChallenge();
            } else {
                codeFeedback.innerHTML = '🏆 All code challenges completed!';
            }
        } else {
            codeFeedback.innerHTML = feedback.join('<br>');
            codeFeedback.style.color = 'red';
            
            // Show hints
            if (currentChallenge.hints) {
                const hintsDiv = document.createElement('div');
                hintsDiv.classList.add('challenge-hints');
                hintsDiv.innerHTML = '<h4>Hints:</h4>' + 
                    currentChallenge.hints.map(hint => `<p>• ${hint}</p>`).join('');
                codeFeedback.appendChild(hintsDiv);
            }
        }
    }

    // Initialize
    renderCodeChallenge();

    // Event Listeners
    submitCodeBtn.addEventListener('click', validateCodeChallenge);
});

document.addEventListener('DOMContentLoaded', () => {
    // (Keep the existing codeChallenges array and previous code)

    // DOM Elements
    const challengeTitle = document.getElementById('challenge-title');
    const challengeDescription = document.getElementById('challenge-description');
    const codeInput = document.getElementById('code-input');
    const codeFeedback = document.getElementById('code-feedback');
    const submitCodeBtn = document.getElementById('submit-code');
    const solutionBtn = document.createElement('button');
    const challengeContainer = document.getElementById('code-challenge-section');

    // State Management
    let currentChallengeIndex = 0;
    let challengeAttempts = 0;
    const MAX_ATTEMPTS = 3;

    // Render Code Challenge
    function renderCodeChallenge() {
        const currentChallenge = codeChallenges[currentChallengeIndex];
        
        // Reset UI
        submitCodeBtn.style.display = 'block';
        solutionBtn.style.display = 'block';
        codeInput.disabled = false;
        
        // Update challenge details
        challengeTitle.textContent = currentChallenge.title;
        challengeDescription.textContent = currentChallenge.description;
        
        // Set initial code
        codeInput.value = currentChallenge.initialCode.trim();
        
        // Reset feedback
        codeFeedback.innerHTML = '';
        codeFeedback.style.color = '';

        // Reset attempts
        challengeAttempts = 0;

        // Create solution button
        solutionBtn.textContent = 'Show Solution';
        solutionBtn.classList.add('solution-btn');
        solutionBtn.addEventListener('click', () => {
            codeFeedback.innerHTML = `
                <h4>Solution:</h4>
                <pre><code>${currentChallenge.solution.trim()}</code></pre>
            `;
        });
        
        // Append solution button if not already added
        if (!document.querySelector('.solution-btn')) {
            submitCodeBtn.parentNode.insertBefore(solutionBtn, submitCodeBtn.nextSibling);
        }
    }

    // Create Retry Mechanism
    function createRetryInterface() {
        // Clear previous content
        codeFeedback.innerHTML = '';
        submitCodeBtn.style.display = 'none';
        solutionBtn.style.display = 'none';
        codeInput.disabled = true;

        // Create retry container
        const retryContainer = document.createElement('div');
        retryContainer.classList.add('challenge-retry-container');
        retryContainer.innerHTML = `
            <h3>🏆 Congratulations! You've completed all challenges!</h3>
            <div class="retry-options">
                <button id="retry-all-challenges">Try All Challenges Again</button>
                <button id="reset-specific-challenge">Reset Current Challenge</button>
            </div>
        `;

        // Append to feedback area
        codeFeedback.appendChild(retryContainer);

        // Add event listeners
        const retryAllBtn = document.getElementById('retry-all-challenges');
        const resetChallengeBtn = document.getElementById('reset-specific-challenge');

        retryAllBtn.addEventListener('click', () => {
            // Reset to first challenge
            currentChallengeIndex = 0;
            renderCodeChallenge();
        });

        resetChallengeBtn.addEventListener('click', () => {
            // Reset current challenge
            renderCodeChallenge();
        });
    }

    // Validate Code Challenge
    function validateCodeChallenge() {
        const currentChallenge = codeChallenges[currentChallengeIndex];
        const userCode = codeInput.value;
        let feedback = [];

        // Increment attempts
        challengeAttempts++;

        // Check for must-contain elements
        if (currentChallenge.expectedCode.mustContain) {
            currentChallenge.expectedCode.mustContain.forEach(requiredCode => {
                if (!userCode.toLowerCase().includes(requiredCode.toLowerCase())) {
                    feedback.push(`❌ Missing: ${requiredCode}`);
                }
            });
        }

        // Provide feedback
        if (feedback.length === 0) {
            codeFeedback.innerHTML = '✅ Excellent! Challenge solved perfectly.';
            codeFeedback.style.color = 'green';
            
            // Move to next challenge or show completion
            currentChallengeIndex++;
            if (currentChallengeIndex < codeChallenges.length) {
                // Wait a moment before moving to next challenge
                setTimeout(renderCodeChallenge, 1500);
            } else {
                // All challenges completed
                createRetryInterface();
            }
        } else {
            // Check if max attempts reached
            if (challengeAttempts >= MAX_ATTEMPTS) {
                codeFeedback.innerHTML = `
                    ❌ Maximum attempts reached for this challenge. 
                    <br>Would you like to see the solution?
                `;
                codeFeedback.style.color = 'red';
                
                // Show solution button
                const showSolutionBtn = document.createElement('button');
                showSolutionBtn.textContent = 'Show Solution';
                showSolutionBtn.classList.add('show-solution-btn');
                showSolutionBtn.addEventListener('click', () => {
                    codeFeedback.innerHTML = `
                        <h4>Solution:</h4>
                        <pre><code>${currentChallenge.solution.trim()}</code></pre>
                    `;
                });
                codeFeedback.appendChild(showSolutionBtn);
            } else {
                // Normal feedback with attempts remaining
                codeFeedback.innerHTML = feedback.join('<br>');
                codeFeedback.style.color = 'red';
                
                // Show remaining attempts
                const attemptsLeft = MAX_ATTEMPTS - challengeAttempts;
                const attemptsMessage = document.createElement('p');
                attemptsMessage.textContent = `Attempts left: ${attemptsLeft}`;
                attemptsMessage.style.color = 'orange';
                codeFeedback.appendChild(attemptsMessage);
                
                // Show hints
                if (currentChallenge.hints) {
                    const hintsDiv = document.createElement('div');
                    hintsDiv.classList.add('challenge-hints');
                    hintsDiv.innerHTML = '<h4>Hints:</h4>' + 
                        currentChallenge.hints.map(hint => `<p>• ${hint}</p>`).join('');
                    codeFeedback.appendChild(hintsDiv);
                }
            }
        }
    }

    // Initialize
    renderCodeChallenge();

    // Event Listeners
    submitCodeBtn.addEventListener('click', validateCodeChallenge);
});