document.addEventListener('DOMContentLoaded', () => {
    // Viewport Resize Practice
    const practiceButton = document.getElementById('resize-practice');
    const practiceResult = document.getElementById('practice-result');

    function updatePracticeResult() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        practiceResult.innerHTML = `
            <p>Current Window Size:</p>
            <p>Width: ${width}px</p>
            <p>Height: ${height}px</p>
            <p>Responsive Tip: Resize your browser to see how the layout adapts!</p>
        `;
    }

    // Initial call
    updatePracticeResult();

    // Update on window resize
    window.addEventListener('resize', updatePracticeResult);

    // Media Query Demo Interaction
    const mediaQueryDemo = document.getElementById('media-query-demo');
    
    function updateMediaQueryDemo() {
        const width = window.innerWidth;
        if (width <= 480) {
            mediaQueryDemo.textContent = 'Mobile View (≤ 480px)';
        } else if (width <= 768) {
            mediaQueryDemo.textContent = 'Tablet View (481px - 768px)';
        } else {
            mediaQueryDemo.textContent = 'Desktop View (> 768px)';
        }
    }

    // Initial call
    updateMediaQueryDemo();

    // Update on window resize
    window.addEventListener('resize', updateMediaQueryDemo);

    // Resource Links (Placeholder)
    const videoLink = document.getElementById('video-link');
    const toolLink = document.getElementById('tool-link');

    videoLink.href = 'https://www.youtube.com/watch?v=YOUR_RESPONSIVE_DESIGN_VIDEO';
    toolLink.href = 'https://responsivedesignchecker.com/';
});

document.addEventListener('DOMContentLoaded', () => {
    // Previous JavaScript remains the same, with these additions

    // Testing Responsiveness Button
    const testButton = document.getElementById('test-responsiveness');
    const testResult = document.getElementById('test-result');

    testButton.addEventListener('click', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        testResult.innerHTML = `
            <h4>Responsiveness Test Results:</h4>
            <p>Screen Width: ${width}px</p>
            <p>Screen Height: ${height}px</p>
            <p>Device Type: ${getDeviceType(width)}</p>
        `;
    });

    function getDeviceType(width) {
        if (width <= 480) return 'Mobile Phone';
        if (width <= 768) return 'Tablet';
        if (width <= 1024) return 'Laptop';
        return 'Desktop';
    }

    // Practice Area Responsiveness
    const practiceArea = document.getElementById('practice-area');
    const challengeBox = document.querySelector('.challenge-box');
    const practiceFeedback = document.getElementById('practice-feedback');

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        
        challengeBox.style.width = `${width * 0.6}px`;
        
        practiceFeedback.innerHTML = `
            <p>Current Width: ${width}px</p>
            <p>Box Adjusted: ${Math.round(width * 0.6)}px wide</p>
        `;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Previous JavaScript remains the same

    // Resource Card Interaction
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        const link = card.querySelector('a');
        
        card.addEventListener('click', () => {
            if (link) {
                window.open(link.href, '_blank');
            }
        });

        card.addEventListener('mouseover', () => {
            card.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Video Tutorial Tracking (optional analytics-like feature)
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            console.log(`Video Tutorial ${index + 1} viewed`);
            // You could extend this to send data to an analytics service
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Quiz Questions
    const quizData = [
        {
            question: "What is the primary purpose of the viewport meta tag?",
            choices: [
                "To set the website's background color",
                "To control how a webpage is displayed on different devices",
                "To add animations to the page",
                "To load external JavaScript files"
            ],
            correctIndex: 1,
            explanation: "The viewport meta tag helps control how a webpage is displayed on different devices by setting the width and initial zoom level."
        },
        {
            question: "What does 'responsive design' primarily aim to achieve?",
            choices: [
                "Make websites load faster",
                "Ensure websites look good on all device sizes",
                "Increase server performance",
                "Reduce website complexity"
            ],
            correctIndex: 1,
            explanation: "Responsive design ensures that websites look good and function well on all devices, from mobile phones to desktop computers."
        },
        {
            question: "Which CSS unit is relative to the root element's font size?",
            choices: [
                "px (pixel)",
                "em",
                "rem",
                "vh (viewport height)"
            ],
            correctIndex: 2,
            explanation: "rem (root em) is relative to the root element's font size, making it useful for consistent sizing across a website."
        },
        {
            question: "What is the purpose of a media query in responsive design?",
            choices: [
                "To create animations",
                "To adjust styles based on device characteristics",
                "To load external images",
                "To validate form inputs"
            ],
            correctIndex: 1,
            explanation: "Media queries allow you to apply different CSS styles based on device characteristics like screen width."
        },
        {
            question: "What is the 'Mobile-First' design approach?",
            choices: [
                "Designing only for mobile devices",
                "Designing for desktop first, then adapting to mobile",
                "Designing for mobile devices first, then scaling up",
                "Ignoring mobile device users"
            ],
            correctIndex: 2,
            explanation: "Mobile-First design means starting the design process for mobile devices and then progressively enhancing the design for larger screens."
        }
    ];

    // DOM Elements
    const quizElement = document.getElementById('quiz');
    const choicesElement = document.getElementById('choices');
    const questionElement = document.getElementById('question');
    const feedbackElement = document.getElementById('feedback');
    const quizResultsElement = document.getElementById('quiz-results');
    const finalScoreElement = document.getElementById('final-score');
    const restartQuizButton = document.getElementById('restart-quiz');

    // Quiz State
    let currentQuestion = 0;
    let score = 0;

    // Function to load question
    function loadQuestion() {
        const currentQuizData = quizData[currentQuestion];
        questionElement.textContent = currentQuizData.question;

        // Clear previous choices and feedback
        choicesElement.innerHTML = '';
        feedbackElement.textContent = '';

        // Create choice buttons
        currentQuizData.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice-btn');
            button.dataset.index = index;
            button.addEventListener('click', selectAnswer);
            choicesElement.appendChild(button);
        });

        // Hide results if shown
        quizResultsElement.classList.add('hidden');
        quizElement.classList.remove('hidden');
    }

    // Function to handle answer selection
    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = parseInt(selectedButton.dataset.index) === quizData[currentQuestion].correctIndex;

        // Disable further selections
        choicesElement.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = true;
            const isCorrect = parseInt(btn.dataset.index) === quizData[currentQuestion].correctIndex;
            btn.classList.toggle('correct', isCorrect);
            btn.classList.toggle('incorrect', !isCorrect);
        });

        // Show feedback
        if (correct) {
            score++;
            feedbackElement.textContent = `Correct! ${quizData[currentQuestion].explanation}`;
            feedbackElement.classList.add('feedback-correct');
        } else {
            feedbackElement.textContent = `Incorrect. ${quizData[currentQuestion].explanation}`;
            feedbackElement.classList.add('feedback-incorrect');
        }

        // Prepare for next question
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }, 3000);
    }

    // Function to show final results
    function showResults() {
        quizElement.classList.add('hidden');
        quizResultsElement.classList.remove('hidden');
        
        finalScoreElement.textContent = `Your Score: ${score}/${quizData.length}`;
    }

    // Restart quiz
    restartQuizButton.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
    });

    // Start the quiz
    loadQuestion();
});