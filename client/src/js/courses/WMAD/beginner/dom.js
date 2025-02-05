document.addEventListener('DOMContentLoaded', function() {
    const targetElement = document.getElementById('targetElement');
    const challengeInput = document.getElementById('challengeInput');
    const submitBtn = document.getElementById('submitChallengeBtn');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    const challengeInstructions = document.getElementById('challengeInstructions');
    const levelIndicators = document.querySelectorAll('.level-indicator');

    let currentLevel = 1;
    let score = 0;

    const challenges = [
        {
            level: 1,
            instruction: "Change the text of the target element to 'DOM Master'",
            validate: (input) => input.trim() === 'DOM Master'
        },
        {
            level: 2,
            instruction: "Change the background color to 'green'",
            validate: (input) => input.trim().toLowerCase() === 'green'
        },
        {
            level: 3,
            instruction: "Add the class 'highlighted' to the target element",
            validate: (input) => {
                if (input.trim().toLowerCase() === 'add highlighted') {
                    targetElement.classList.add('highlighted');
                    return true;
                }
                return false;
            }
        },
        {
            level: 4,
            instruction: "Create a new div element with text 'New Element'",
            validate: (input) => {
                if (input.trim().toLowerCase() === 'create new element') {
                    const newElement = document.createElement('div');
                    newElement.textContent = 'New Element';
                    newElement.classList.add('dynamic-element');
                    document.querySelector('.challenge-area').appendChild(newElement);
                    return true;
                }
                return false;
            }
        },
        {
            level: 5,
            instruction: "Remove all dynamic elements",
            validate: (input) => {
                if (input.trim().toLowerCase() === 'remove dynamic elements') {
                    const dynamicElements = document.querySelectorAll('.dynamic-element');
                    dynamicElements.forEach(el => el.remove());
                    return true;
                }
                return false;
            }
        }
    ];

    function updateChallenge() {
        const challenge = challenges[currentLevel - 1];
        challengeInstructions.textContent = `Level ${currentLevel}: ${challenge.instruction}`;
        
        // Reset target element for each level
        targetElement.textContent = 'Complete the Challenge!';
        targetElement.style.backgroundColor = '#3498db';
        targetElement.classList.remove('highlighted');
    }

    function updateLevelIndicators() {
        levelIndicators.forEach(indicator => {
            const level = parseInt(indicator.dataset.level);
            if (level <= currentLevel) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    submitBtn.addEventListener('click', function() {
        const currentChallenge = challenges[currentLevel - 1];
        const inputValue = challengeInput.value;

        if (currentChallenge.validate(inputValue)) {
            // Success
            score += 20;
            scoreDisplay.textContent = score;
            
            feedbackMessage.textContent = 'Challenge Completed! 🎉';
            feedbackMessage.className = 'feedback-message success';

            // Move to next level
            if (currentLevel < challenges.length) {
                currentLevel++;
                levelDisplay.textContent = currentLevel;
                updateChallenge();
                updateLevelIndicators();
            } else {
                feedbackMessage.textContent = 'Congratulations! You are a DOM Master! 🏆';
            }
        } else {
            // Failure
            feedbackMessage.textContent = 'Incorrect solution. Try again! 🤔';
            feedbackMessage.className = 'feedback-message error';
        }

        // Clear input
        challengeInput.value = '';
    });

    // Initialize first challenge
    updateChallenge();
    updateLevelIndicators();
});