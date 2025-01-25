/**
 * Beginner Web Development Course JavaScript
 * Handles basic interactivity and learning features for beginner-level content
 */

class BeginnerCourseManager {
    constructor() {
        this.progressData = {
            completedLessons: 0,
            totalLessons: 20
        };
        
        this.codeExamples = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCodeEditors();
            this.setupExerciseValidation();
            this.initializeProgress();
        });
    }

    /**
     * Sets up simple code editors for HTML and CSS practice
     */
    setupCodeEditors() {
        const editors = document.querySelectorAll('.beginner-code-editor');
        editors.forEach(editor => {
            // Basic syntax highlighting
            editor.addEventListener('input', (e) => {
                const code = e.target.value;
                const language = editor.dataset.language;
                this.highlightSyntax(editor, code, language);
            });

            // Live preview for HTML/CSS
            if (editor.dataset.preview) {
                editor.addEventListener('input', (e) => {
                    this.updateLivePreview(e.target.value, editor.dataset.preview);
                });
            }
        });
    }

    /**
     * Basic syntax highlighting for HTML and CSS
     */
    highlightSyntax(editor, code, language) {
        // Simple syntax highlighting logic for beginners
        let highlighted = code;
        if (language === 'html') {
            highlighted = code.replace(
                /(&lt;[^&gt;]+&gt;)/g,
                '<span class="html-tag">$1</span>'
            );
        } else if (language === 'css') {
            highlighted = code.replace(
                /([\w-]+\s*:)/g,
                '<span class="css-property">$1</span>'
            );
        }
        editor.innerHTML = highlighted;
    }

    /**
     * Updates live preview for HTML/CSS exercises
     */
    updateLivePreview(code, previewId) {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.innerHTML = code;
        }
    }

    /**
     * Validates beginner exercises with helpful feedback
     */
    setupExerciseValidation() {
        const submitButtons = document.querySelectorAll('.exercise-submit');
        submitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const exerciseId = e.target.dataset.exercise;
                const solution = this.getExerciseSolution(exerciseId);
                const userCode = document.querySelector(`[data-exercise-input="${exerciseId}"]`).value;
                
                this.validateExercise(exerciseId, userCode, solution);
            });
        });
    }

    /**
     * Provides beginner-friendly feedback on exercises
     */
    validateExercise(exerciseId, userCode, solution) {
        const feedback = document.querySelector(`[data-exercise-feedback="${exerciseId}"]`);
        const cleanUserCode = userCode.replace(/\s+/g, ' ').trim();
        const cleanSolution = solution.replace(/\s+/g, ' ').trim();

        if (cleanUserCode === cleanSolution) {
            feedback.innerHTML = '<span class="success"> Great job! Your code is correct!</span>';
            this.updateProgress(exerciseId);
        } else {
            feedback.innerHTML = this.generateHelpfulFeedback(cleanUserCode, cleanSolution);
        }
    }

    /**
     * Generates beginner-friendly feedback messages
     */
    generateHelpfulFeedback(userCode, solution) {
        let feedback = '<span class="hint">Almost there! Here are some hints:</span><ul>';
        
        if (userCode.length === 0) {
            feedback += '<li>Try writing some code first!</li>';
        } else if (userCode.length < solution.length * 0.5) {
            feedback += '<li>Your code seems too short. Did you forget something?</li>';
        } else if (userCode.length > solution.length * 1.5) {
            feedback += '<li>Your code might be longer than necessary. Can you make it simpler?</li>';
        }

        // Add specific hints based on the exercise type
        feedback += '</ul>';
        return feedback;
    }

    /**
     * Initializes and updates progress tracking
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
     * Updates progress when exercises are completed
     */
    updateProgress(exerciseId) {
        // Update progress data
        this.progressData.completedLessons++;
        this.updateProgressUI();
        
        // Save progress
        this.saveProgress();
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
const courseManager = new BeginnerCourseManager();
