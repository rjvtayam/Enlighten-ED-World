document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('skillsAssessmentForm');
    const categories = document.querySelectorAll('.skill-category');
    const progress = document.querySelector('.progress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const programSelect = document.getElementById('programSelect');
    const selectedProgramInput = document.getElementById('selectedProgram');
    const programSkills = document.querySelectorAll('.program-skill');
    
    let currentCategory = 0;
    
    // Initialize the first category
    showCategory(0);
    
    // Handle program selection
    programSelect.addEventListener('change', function() {
        const selectedProgram = this.value;
        selectedProgramInput.value = selectedProgram;
        
        // Show/hide skills based on program
        programSkills.forEach(skill => {
            const programs = skill.dataset.programs.split(',');
            if (programs.includes(selectedProgram)) {
                skill.classList.remove('hidden');
                // Enable required validation for visible skills
                skill.querySelectorAll('input[type="radio"]').forEach(input => {
                    input.required = true;
                });
            } else {
                skill.classList.add('hidden');
                // Disable required validation for hidden skills
                skill.querySelectorAll('input[type="radio"]').forEach(input => {
                    input.required = false;
                    input.checked = false;
                });
            }
        });
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
        // Validate program selection first
        if (!programSelect.value) {
            alert('Please select your program before proceeding.');
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
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Program validation
        if (!selectedProgramInput.value) {
            alert('Please select your program');
            programSelect.focus();
            return;
        }

        // Validate all visible inputs
        const visibleInputs = form.querySelectorAll('.skill-item:not(.hidden) input[type="radio"]');
        const groups = {};
        visibleInputs.forEach(input => {
            const name = input.getAttribute('name');
            groups[name] = groups[name] || false;
            if (input.checked) groups[name] = true;
        });
        
        if (Object.values(groups).includes(false)) {
            alert('Please rate all skills before submitting.');
            return;
        }

        const formData = new FormData(form);
        
        // Log form submission for debugging
        console.log('Submitting assessment with program:', selectedProgramInput.value);

        submitAssessment(formData);
    });

    // Program selection handler
    programSelect.addEventListener('change', function() {
        selectedProgramInput.value = this.value;
        console.log('Selected program:', this.value);
        
        // Update which skills are required based on program
        updateRequiredSkills(this.value);
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

    // Initialize navigation buttons
    initNavigation();
});

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

function submitAssessment(formData) {
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value,
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Redirecting to:', data.redirect_url); // Debug log
            window.location.href = data.redirect_url;
        } else {
            throw new Error(data.message || 'Submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting assessment: ' + error.message);
    });
}