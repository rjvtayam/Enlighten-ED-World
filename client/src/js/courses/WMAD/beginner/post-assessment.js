document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentQuestion = 1;
    let timeLeft = 60 * 60; // 60 minutes
    let answers = {};
    
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.question-section');
    const questions = document.querySelectorAll('.question');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const resultsSection = document.getElementById('results');
    const questionReview = document.getElementById('questionReview');
    
    // Show only the current question
    function showQuestion(questionNumber) {
        questions.forEach(q => {
            q.style.display = q.dataset.question == questionNumber ? 'block' : 'none';
        });
        
        // Update navigation state
        prevBtn.disabled = questionNumber === 1;
        nextBtn.disabled = questionNumber === questions.length;
        
        // Update progress
        updateProgress();
    }
    
    // Navigation
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 1) {
            saveCurrentAnswer();
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentQuestion < questions.length) {
            saveCurrentAnswer();
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
            sections.forEach(sec => sec.classList.toggle('active', sec.id === section));
            
            // Show first question of the section
            const firstQuestionInSection = document.querySelector(`#${section} .question`);
            if (firstQuestionInSection) {
                currentQuestion = parseInt(firstQuestionInSection.dataset.question);
                showQuestion(currentQuestion);
            }
        });
    });
    
    // Save answers
    function saveCurrentAnswer() {
        const currentQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
        if (!currentQuestionEl) return;
        
        if (currentQuestionEl.closest('#multiple-choice')) {
            const selected = currentQuestionEl.querySelector(`input[name="q${currentQuestion}"]:checked`);
            if (selected) {
                answers[currentQuestion] = {value: selected.value, correct: selected.dataset.correct === 'true'};
            }
        } else if (currentQuestionEl.closest('#coding') || currentQuestionEl.closest('#debugging')) {
            // For coding and debugging questions, we're not saving answers as they're not editable
            answers[currentQuestion] = {value: 'viewed', correct: false};
        }
    
        updateProgress();
    }
    
    // Progress tracking
    function updateProgress() {
        const totalQuestions = questions.length;
        const answered = Object.keys(answers).length;
        const progress = (answered / totalQuestions) * 100;
        
        document.getElementById('progress').textContent = `${answered}/${totalQuestions}`;
        document.querySelector('.progress').style.width = `${progress}%`;
    }
    
    // Timer
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 300) { // Last 5 minutes
            document.getElementById('timer').style.color = '#ef4444';
        }
        
        if (timeLeft <= 0) {
            submitAssessment();
        }
    }
    
    const timer = setInterval(() => {
        timeLeft--;
        updateTimer();
    }, 1000);


    function showNotification(message, type) {
        // Implement your notification logic here.  This is a placeholder.
        alert(`${type}: ${message}`);
    }

    function calculateScore() {
        const totalQuestions = questions.length;
        const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
        const score = `${correctAnswers}/${totalQuestions}`;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        document.getElementById('finalScore').textContent = score;
        document.getElementById('finalPercentage').textContent = `${percentage}%`;

        return { score, percentage };
    }

    function displayResults() {
        calculateScore();
        questionReview.innerHTML = '';

        questions.forEach((q, index) => {
            const answer = answers[index + 1]; // Adjust index to match question numbering
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            
            let statusText, statusClass;
            if (q.closest('#multiple-choice')) {
                statusText = answer && answer.correct ? 'Correct' : 'Incorrect';
                statusClass = answer && answer.correct ? 'correct' : 'incorrect';
            } else {
                statusText = answer ? 'Viewed' : 'Not viewed';
                statusClass = answer ? 'viewed' : 'not-viewed';
            }
            
            reviewItem.innerHTML = `
                <span class="review-question">Q${index + 1}: ${q.querySelector('h3').textContent.substring(0, 50)}...</span>
                <span class="review-status ${statusClass}">${statusText}</span>
            `;
            questionReview.appendChild(reviewItem);
        });

        resultsSection.style.display = 'block';
        document.querySelector('.question-container').style.display = 'none';
    }

    // Event Listeners
    submitBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to submit your assessment?')) {
            clearInterval(timer);
            displayResults();
        }
    });

    retakeBtn.addEventListener('click', () => {
        location.reload();
    });
    
    // Initialize
    showQuestion(currentQuestion);
    updateTimer();
    hljs.highlightAll();
    
    // Load saved progress if available
    const savedProgress = JSON.parse(localStorage.getItem('assessmentProgress'));
    if (savedProgress) {
        answers = savedProgress.answers;
        timeLeft = savedProgress.timeLeft;
        currentQuestion = savedProgress.currentQuestion;
        showQuestion(currentQuestion);
        updateTimer();
    }

    function submitAssessment() {
        clearInterval(timer);
        displayResults();
    }
});