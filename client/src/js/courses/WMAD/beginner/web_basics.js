document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation
    const tabs = document.querySelectorAll('.tab-btn');
    const contentSections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            const targetSection = document.getElementById(tab.dataset.tab);
            targetSection.classList.add('active');
        });
    });

    // Web Communication Flow Diagram
    function createCommunicationFlowDiagram() {
        const diagram = document.getElementById('webCommunicationFlow');
        const steps = [
            'User Request', 
            'DNS Lookup', 
            'HTTP Request', 
            'Server Processing', 
            'HTTP Response', 
            'Browser Rendering'
        ];

        diagram.innerHTML = steps.map((step, index) => `
            <div class="flow-step" style="
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: ${index % 2 === 0 ? '#e1f5fe' : '#f1f8e9'};
                padding: 1rem;
                margin: 0.5rem;
                border-radius: 5px;
            ">
                ${step}
            </div>
        `).join('<div class="arrow">➡️</div>');
    }

    // Interactive Quiz
    function setupWebBasicsQuiz() {
        const quizContainer = document.getElementById('webBasicsQuiz');
        const scoreDisplay = document.getElementById('correct-count');
        const progressFill = document.getElementById('progress-fill');
        let score = 0;

        const quizQuestions = [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Hyperlink and Text Markup Language"
                ],
                correctAnswer: 0
            },
            {
                question: "Which tag creates a hyperlink in HTML?",
                options: ["<link>", "<a>", "<href>"],
                correctAnswer: 1
            },
            {
                question: "What is the primary purpose of CSS?",
                options: [
                    "To create website structure",
                    "To add interactivity",
                    "To style and layout web pages"
                ],
                correctAnswer: 2
            },
            {
                question: "Which language adds interactivity to web pages?",
                options: ["HTML", "CSS", "JavaScript"],
                correctAnswer: 2
            },
            {
                question: "What does HTTP stand for?",
                options: [
                    "Hyper Transfer Text Protocol",
                    "Hyper Text Transfer Protocol",
                    "High Tech Text Protocol"
                ],
                correctAnswer: 1
            }
        ];

        quizContainer.innerHTML = ''; // Clear previous content
        score = 0;

        quizQuestions.forEach((questionData, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('quiz-question');
            questionElement.innerHTML = `
                <h3>${index + 1}. ${questionData.question}</h3>
                <div class="quiz-options">
                    ${questionData.options.map((option, optionIndex) => 
                        `<button class="quiz-option" data-correct="${optionIndex === questionData.correctAnswer}">
                            ${option}
                        </button>`
                    ).join('')}
                </div>
            `;

            quizContainer.appendChild(questionElement);

            const optionButtons = questionElement.querySelectorAll('.quiz-option');
            optionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const isCorrect = button.dataset.correct === 'true';
                    
                    // Reset button styles
                    optionButtons.forEach(btn => {
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    });

                    // Style the clicked button
                    button.style.backgroundColor = isCorrect ? '#2ecc71' : '#e74c3c';
                    button.style.color = 'white';

                    // Update score
                    if (isCorrect) {
                        score++;
                        scoreDisplay.textContent = score;
                    }

                    // Update progress bar
                    const progressPercentage = (score / quizQuestions.length) * 100;
                    progressFill.style.width = `${progressPercentage}%`;
                });
            });
        });
    }

    // Resource Link Tracking
    function trackExternalLink(link, category) {
        console.log(`Clicked ${category} link: ${link.href}`);
        // Placeholder for analytics tracking
    }

    const resourceLinks = document.querySelectorAll('.resource-card a');
    resourceLinks.forEach(link => {
        link.addEventListener('click', () => {
            trackExternalLink(link, 'Learning Resource');
        });
    });

    // Initialize Functions
    createCommunicationFlowDiagram();
    setupWebBasicsQuiz();
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (previous existing code)

    // Video Tutorial Playlist and Lesson Content
    function setupVideoTutorial() {
        const videoPlayer = document.getElementById('webBasicsVideo');
        const videoTitle = document.getElementById('currentVideoTitle');
        const playlistButtons = document.querySelectorAll('.playlist-btn');
        const lessonContents = document.querySelectorAll('.video-lesson-content');

        const videoPlaylist = {
            'qz0aGYrrlhU': 'Web Basics Intro',
            'ysEN5RaKOlA': 'HTML, CSS, JS Explained',
            '3PHXvlpVIRk': 'Internet Communication'
        };

        playlistButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update playlist buttons
                playlistButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update video
                const videoId = button.dataset.video;
                videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
                videoTitle.textContent = videoPlaylist[videoId];

                // Update lesson content
                const contentTab = button.dataset.tab;
                lessonContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${contentTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Auto-rotate videos every 5 minutes
        setInterval(() => {
            const activeButton = document.querySelector('.playlist-btn.active');
            const nextButton = activeButton.nextElementSibling || 
                               document.querySelector('.playlist-btn');
            nextButton.click();
        }, 5 * 60 * 1000);
    }

    // Initialize Video Tutorial
    setupVideoTutorial();

    // ... (rest of the previous code remains the same)
});