document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('skillsAssessmentForm');
    const categories = document.querySelectorAll('.skill-category');
    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const programSelect = document.getElementById('programSelect');
    const majorSelect = document.getElementById('major');
    const majorGroup = document.getElementById('majorGroup');
    const selectedProgramInput = document.getElementById('selectedProgram');
    const selectedMajorInput = document.getElementById('selectedMajor');
    const programSkills = document.querySelectorAll('.program-skill');
    
    let currentCategory = 0;
    
    // Logging function to help with debugging
    function logElementStatus(elementId) {
        const element = document.getElementById(elementId);
        console.log(`Element '${elementId}':`, element ? 'FOUND ✓' : 'MISSING ✗');
        return element;
    }

    // Check critical form elements
    logElementStatus('skillsAssessmentForm');
    logElementStatus('programSelect');
    logElementStatus('major');
    logElementStatus('selectedProgram');
    logElementStatus('selectedMajor');
    logElementStatus('submitBtn');
    logElementStatus('majorGroup');
    logElementStatus('assessmentFormSection');
    logElementStatus('resultsSection');

    // Validate CSRF token
    const csrfTokenElement = document.querySelector('input[name="csrf_token"]');
    console.log('CSRF Token Element:', csrfTokenElement ? 'FOUND ✓' : 'MISSING ✗');

    // Exit if critical elements are missing
    if (!form || !programSelect || !majorSelect || !selectedProgramInput || 
        !selectedMajorInput || !submitBtn || !csrfTokenElement) {
        console.error('One or more critical form elements are missing. Cannot proceed.');
        return;
    }

    // Centralized navigation and progress tracking
    function initNavigation() {
        const categories = document.querySelectorAll('.skill-category');
        const progressBar = document.querySelector('.progress-bar');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        let currentCategory = 0;

        function updateProgressBar(index) {
            if (progressBar) {
                const progressPercentage = ((index + 1) / categories.length) * 100;
                progressBar.style.width = `${progressPercentage}%`;
                progressBar.setAttribute('aria-valuenow', progressPercentage);
            }
        }

        function showCategory(index) {
            // Hide all categories
            categories.forEach(cat => {
                cat.classList.remove('active');
                cat.style.display = 'none';
            });

            // Show current category
            categories[index].classList.add('active');
            categories[index].style.display = 'block';
            
            // Update navigation buttons
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === categories.length - 1 ? 'none' : 'block';
            submitBtn.style.display = index === categories.length - 1 ? 'block' : 'none';
            
            // Update progress bar
            updateProgressBar(index);
        }

        function validateCurrentCategory() {
            const currentCategory = categories[currentCategory];
            const requiredInputs = currentCategory.querySelectorAll('input[type="radio"]:required');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                const name = input.getAttribute('name');
                const checked = currentCategory.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                    alert(`Please rate your ${name.replace(/_/g, ' ')} skill.`);
                }
            });
            
            return isValid;
        }

        // Next button handler
        nextBtn.addEventListener('click', () => {
            if (validateCurrentCategory()) {
                currentCategory++;
                showCategory(currentCategory);
            }
        });

        // Previous button handler
        prevBtn.addEventListener('click', () => {
            if (currentCategory > 0) {
                currentCategory--;
                showCategory(currentCategory);
            }
        });

        // Initialize first category
        showCategory(0);
    }

    // Call initialization when DOM is loaded
    initNavigation();

    // Handle program selection directly
    programSelect.addEventListener('change', function() {
        const selectedProgram = this.value.toUpperCase(); // Convert to uppercase
        selectedProgramInput.value = selectedProgram;
        
        // Reset major selection
        const majorSelect = document.getElementById('major');
        majorSelect.selectedIndex = 0;
        
        // Hide all major groups first
        const bsitMajors = document.querySelector('.bsit-majors');
        const bcsMajors = document.querySelector('.bscs-majors');
        const bsisMajors = document.querySelector('.bsis-majors');
        const majorGroup = document.getElementById('majorGroup');

        if (bsitMajors) bsitMajors.style.display = 'none';
        if (bcsMajors) bcsMajors.style.display = 'none';
        if (bsisMajors) bsisMajors.style.display = 'none';

        // Show appropriate major group
        switch(selectedProgram) {
            case 'BSIT':
                if (bsitMajors) bsitMajors.style.display = 'block';
                majorGroup.style.display = 'block';
                break;
            case 'BSCS':
                if (bcsMajors) bcsMajors.style.display = 'block';
                majorGroup.style.display = 'block';
                break;
            case 'BSIS':
                if (bsisMajors) bsisMajors.style.display = 'block';
                majorGroup.style.display = 'block';
                break;
            default:
                majorGroup.style.display = 'none';
        }
    });

    // Handle major selection
    document.getElementById('major').addEventListener('change', function() {
        const selectedMajor = this.value;
        document.getElementById('selectedMajor').value = selectedMajor;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Form submission initiated');
        
        // Validate all inputs one last time
        if (!selectedProgramInput.value || !selectedMajorInput.value) {
            alert('Please select your program and major');
            programSelect.focus();
            return;
        }

        // Validate all visible inputs across all categories
        const visibleInputs = form.querySelectorAll('.skill-item:not(.hidden) input[type="radio"]');
        const groups = {};
        visibleInputs.forEach(input => {
            const name = input.getAttribute('name');
            groups[name] = groups[name] || false;
            if (input.checked) groups[name] = true;
        });
        
        console.log('Input Validation Groups:', groups);
        
        if (Object.values(groups).includes(false)) {
            alert('Please rate all skills before submitting.');
            return;
        }

        // Prepare form data
        const formData = new FormData(form);
        
        // Log form data
        for (let [key, value] of formData.entries()) {
            console.log(`FormData - ${key}: ${value}`);
        }
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        const loadingText = submitBtn.querySelector('.loading-text');
        if (loadingText) {
            loadingText.style.display = 'inline-block';
        } else {
            console.warn('Loading text element not found');
        }
        
        // Log submission details
        console.log('Submitting assessment with program:', selectedProgramInput.value, 'and major:', selectedMajorInput.value);

        // Submit assessment
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfTokenElement.value,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            console.log('Response status:', response.status);
            
            // Re-enable submit button
            submitBtn.disabled = false;
            if (loadingText) {
                loadingText.style.display = 'none';
            }
            
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Server error response:', errorData);
                    throw new Error(errorData.message || 'Network response was not ok');
                }).catch(() => {
                    throw new Error('Unexpected server error');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Full response data:', data);

            // Validate response data
            if (!data.success) {
                throw new Error(data.message || 'Assessment submission failed');
            }
            // Handle successful submission
            alert('Assessment submitted successfully!');
        })
        .catch(error => {
            console.error('Submission error:', error);
            alert('Error submitting assessment: ' + error.message);
        })
        .finally(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
            if (loadingText) {
                loadingText.style.display = 'none';
            }
        });

    });

    function updateRequiredSkills(program) {
        const programSkills = {
            'BSIT': ['technical_problem_solving', 'technical_architecture', 'technical_database'],
            'BSCS': ['technical_problem_solving', 'technical_algorithm', 'technical_data_structures'],
            'BSIS': ['technical_problem_solving', 'technical_architecture', 'technical_database']
        };

        // First, remove required from all technical skills
        document.querySelectorAll('input[name^="technical_"]').forEach(input => {
            input.required = false;
        });

        // Then set required for program-specific skills
        if (programSkills[program]) {
            programSkills[program].forEach(skillName => {
                document.querySelectorAll(`input[name="${skillName}"]`).forEach(input => {
                    input.required = true;
                });
            });
        }
    }
});