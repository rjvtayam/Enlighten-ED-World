/**
 * Advanced Web Development Course JavaScript
 * Handles complex interactive features and development tools for advanced-level content
 */

class AdvancedCourseManager {
    constructor() {
        this.progressData = {
            completedLessons: 0,
            totalLessons: 30
        };
        
        this.projectData = new Map();
        this.devTools = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupProjectWorkspace();
            this.initializeDevTools();
            this.setupSystemDesignTools();
            this.initializeProgress();
        });
    }

    /**
     * Sets up the project workspace with advanced development features
     */
    setupProjectWorkspace() {
        const workspace = document.querySelector('.project-workspace');
        if (!workspace) return;

        // Initialize Monaco Editor for advanced code editing
        this.setupMonacoEditor(workspace);
        
        // Setup Git integration panel
        this.setupGitPanel(workspace);
        
        // Initialize terminal emulator
        this.setupTerminalEmulator(workspace);
        
        // Setup project structure viewer
        this.setupProjectExplorer(workspace);
    }

    /**
     * Initializes Monaco Editor with advanced features
     */
    setupMonacoEditor(workspace) {
        const editorContainer = workspace.querySelector('.code-editor');
        if (!editorContainer) return;

        // Monaco Editor configuration
        const editorOptions = {
            language: 'typescript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            folding: true,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            fontSize: 14
        };

        // Initialize editor
        this.editor = monaco.editor.create(editorContainer, editorOptions);
        
        // Set up advanced features
        this.setupEditorFeatures();
    }

    /**
     * Sets up advanced editor features
     */
    setupEditorFeatures() {
        // TypeScript compilation and error checking
        this.setupTypeScriptCompiler();
        
        // ESLint integration
        this.setupESLintIntegration();
        
        // Code formatting with Prettier
        this.setupPrettierIntegration();
        
        // Advanced code completion
        this.setupIntelliSense();
    }

    /**
     * Sets up Git integration panel
     */
    setupGitPanel(workspace) {
        const gitPanel = workspace.querySelector('.git-panel');
        if (!gitPanel) return;

        // Initialize Git status display
        this.updateGitStatus();
        
        // Set up Git command handlers
        this.setupGitCommands();
        
        // Initialize diff viewer
        this.setupDiffViewer();
    }

    /**
     * Updates Git status display
     */
    async updateGitStatus() {
        try {
            const status = await this.getGitStatus();
            this.updateGitUI(status);
        } catch (error) {
            console.error('Error updating Git status:', error);
        }
    }

    /**
     * Sets up terminal emulator with advanced features
     */
    setupTerminalEmulator(workspace) {
        const terminal = workspace.querySelector('.terminal-emulator');
        if (!terminal) return;

        // Initialize xterm.js
        this.terminal = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block',
            fontSize: 14,
            fontFamily: 'Consolas, monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4'
            }
        });

        this.terminal.open(terminal);
        this.setupTerminalCommands();
    }

    /**
     * Sets up system design tools
     */
    setupSystemDesignTools() {
        const designTools = document.querySelector('.system-design-tools');
        if (!designTools) return;

        // Initialize architecture diagram tool
        this.setupArchitectureDiagram();
        
        // Setup performance profiler
        this.setupPerformanceProfiler();
        
        // Initialize load testing tools
        this.setupLoadTesting();
    }

    /**
     * Sets up architecture diagram tool
     */
    setupArchitectureDiagram() {
        const canvas = document.querySelector('.architecture-canvas');
        if (!canvas) return;

        // Initialize diagram tool
        this.diagram = new ArchitectureDiagram(canvas);
        
        // Set up component palette
        this.setupComponentPalette();
        
        // Initialize connection handling
        this.setupConnectionHandlers();
    }

    /**
     * Sets up performance profiling tools
     */
    setupPerformanceProfiler() {
        const profiler = document.querySelector('.performance-profiler');
        if (!profiler) return;

        // Initialize metrics collection
        this.setupMetricsCollection();
        
        // Setup visualization tools
        this.setupPerformanceGraphs();
        
        // Initialize real-time monitoring
        this.setupRealTimeMonitoring();
    }

    /**
     * Updates progress tracking
     */
    initializeProgress() {
        const progressElement = document.querySelector('.progress-indicator');
        if (progressElement) {
            this.updateProgressUI();
        }
    }

    updateProgressUI() {
        const { completedLessons, totalLessons } = this.progressData;
        const progressElement = document.querySelector('.progress-indicator');
        if (progressElement) {
            progressElement.querySelector('span').textContent = 
                `Progress: ${completedLessons}/${totalLessons} lessons completed`;
        }
    }

    /**
     * Saves progress to backend
     */
    async saveProgress() {
        try {
            const response = await fetch('/api/progress/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.progressData)
            });
            
            if (!response.ok) {
                console.error('Failed to save progress');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
}

// Initialize the course manager
const courseManager = new AdvancedCourseManager();

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
        question: "What are the key benefits of microservices architecture?",
        answer: "1. Independent scaling of services\n2. Easier maintenance and updates\n3. Technology stack flexibility\n4. Better fault isolation\n5. Improved team autonomy"
    },
    {
        question: "What is Kubernetes and what problems does it solve?",
        answer: "Kubernetes is a container orchestration platform that automates deployment, scaling, and management of containerized applications. It solves problems of container scheduling, load balancing, service discovery, and automated rollouts/rollbacks."
    },
    {
        question: "What is the purpose of a CI/CD pipeline?",
        answer: "A CI/CD pipeline automates the software delivery process. CI (Continuous Integration) automatically builds and tests code changes, while CD (Continuous Deployment) automatically deploys verified code to production."
    },
    {
        question: "What are the key principles of Zero Trust Security?",
        answer: "1. Never trust, always verify\n2. Assume breach\n3. Verify explicitly\n4. Use least privilege access\n5. Implement strong authentication and authorization"
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
    { id: 1, content: 'Docker' },
    { id: 2, content: 'Kubernetes' },
    { id: 3, content: 'Jenkins' },
    { id: 4, content: 'AWS' },
    { id: 5, content: 'GraphQL' },
    { id: 6, content: 'Redis' }
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
        question: "Which of the following is NOT a benefit of using Docker containers?",
        options: [
            { text: "Consistent development environments", correct: false },
            { text: "Automatic code optimization", correct: true },
            { text: "Easy application scaling", correct: false },
            { text: "Isolated dependencies", correct: false }
        ]
    },
    {
        question: "Which AWS service is best suited for serverless computing?",
        options: [
            { text: "EC2", correct: false },
            { text: "RDS", correct: false },
            { text: "Lambda", correct: true },
            { text: "S3", correct: false }
        ]
    },
    {
        question: "What is the main purpose of a load balancer?",
        options: [
            { text: "To store session data", correct: false },
            { text: "To distribute traffic across multiple servers", correct: true },
            { text: "To encrypt data", correct: false },
            { text: "To compile code", correct: false }
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
