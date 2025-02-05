document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('skillsAssessmentForm');
    const categories = document.querySelectorAll('.skill-category');
    const progress = document.querySelector('.progress');
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

    // Initialize the first category
    showCategory(0);
    
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

    function showCategory(index) {
        categories.forEach(cat => cat.classList.remove('active'));
        categories[index].classList.add('active');
        
        // Update progress
        progress.style.width = `${((index + 1) / categories.length) * 100}%`;
        
        // Update buttons
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === categories.length - 1 ? 'none' : 'block';
        submitBtn.style.display = index === categories.length - 1 ? 'block' : 'none';
    }
    
    nextBtn.addEventListener('click', function() {
        // Validate program and major selection first
        if (!programSelect.value || !majorSelect.value) {
            alert('Please select your program and major before proceeding.');
            return;
        }
        
        // Validate current category (only visible skills)
        const currentVisibleInputs = categories[currentCategory].querySelectorAll('.skill-item:not(.hidden) input[type="radio"]');
        const groups = {};
        currentVisibleInputs.forEach(input => {
            const name = input.getAttribute('name');
            groups[name] = groups[name] || false;
            if (input.checked) groups[name] = true;
        });
        
        console.log('Input Validation Groups:', groups);
        
        if (Object.values(groups).includes(false)) {
            alert('Please rate all visible skills in this category before proceeding.');
            return;
        }
        
        if (currentCategory < categories.length - 1) {
            currentCategory++;
            showCategory(currentCategory);
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentCategory > 0) {
            currentCategory--;
            showCategory(currentCategory);
        }
    });
    
    // Submit button event listener
    submitBtn.addEventListener('click', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Validate program selection
        if (!programSelect.value) {
            alert('Please select a program.');
            programSelect.focus();
            return;
        }

        // Validate major selection
        if (!majorSelect.value) {
            alert('Please select a major.');
            majorSelect.focus();
            return;
        }

        // Validate all skill categories
        let allCategoriesValid = true;
        categories.forEach((category) => {
            const categoryName = category.getAttribute('data-category-name');
            const currentInputs = category.querySelectorAll('input[type="radio"]');
            
            // Group inputs by their name (skill)
            const skillGroups = {};
            currentInputs.forEach(input => {
                const skillName = input.getAttribute('name');
                if (!skillGroups[skillName]) {
                    skillGroups[skillName] = [];
                }
                skillGroups[skillName].push(input);
            });

            // Check if each skill group has a selection
            Object.keys(skillGroups).forEach(skillName => {
                const skillInputs = skillGroups[skillName];
                const isSkillRated = skillInputs.some(input => input.checked);
                
                if (!isSkillRated) {
                    allCategoriesValid = false;
                    category.classList.add('error-category');
                    alert(`Please rate all skills in the ${categoryName} category.`);
                }
            });
        });

        // If validation fails, stop submission
        if (!allCategoriesValid) {
            return;
        }

        // Set hidden input values
        selectedProgramInput.value = programSelect.value;
        selectedMajorInput.value = majorSelect.value;

        // Disable submit button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Submit the form
        form.submit();
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

    function initNavigation() {
        const categories = document.querySelectorAll('.skill-category');
        const progress = document.querySelector('.progress');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        let currentCategory = 0;

        function showCategory(index) {
            categories.forEach(cat => cat.classList.remove('active'));
            categories[index].classList.add('active');
            
            progress.style.width = `${((index + 1) / categories.length) * 100}%`;
            
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === categories.length - 1 ? 'none' : 'block';
            submitBtn.style.display = index === categories.length - 1 ? 'block' : 'none';
        }

        // Navigation button handlers
        nextBtn.addEventListener('click', () => {
            if (validateCurrentCategory()) {
                currentCategory++;
                showCategory(currentCategory);
            }
        });

        prevBtn.addEventListener('click', () => {
            currentCategory--;
            showCategory(currentCategory);
        });

        function validateCurrentCategory() {
            const currentInputs = categories[currentCategory].querySelectorAll('input[type="radio"]:required');
            let isValid = true;
            
            currentInputs.forEach(input => {
                const name = input.getAttribute('name');
                const checked = document.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                    alert(`Please rate your ${name.replace(/_/g, ' ')} skill.`);
                }
            });
            
            return isValid;
        }

        // Show initial category
        showCategory(0);
    }
});