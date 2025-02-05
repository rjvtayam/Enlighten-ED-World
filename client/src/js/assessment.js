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
    
    // Create selectedMajorInput if it doesn't exist
    let selectedMajorInput = document.getElementById('selectedMajor');
    if (!selectedMajorInput) {
        selectedMajorInput = document.createElement('input');
        selectedMajorInput.type = 'hidden';
        selectedMajorInput.id = 'selectedMajor';
        selectedMajorInput.name = 'selected_major';
        form.appendChild(selectedMajorInput);
    }

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
        !selectedMajorInput || !submitBtn) {
        console.error('One or more critical form elements are missing. Cannot proceed.');
        return;
    }

    // Centralized navigation and progress tracking
    function initNavigation() {
        const categories = document.querySelectorAll('.skill-category');
        const progressBar = document.querySelector('.progress-bar');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        function updateProgress() {
            const progressPercentage = ((currentCategory + 1) / categories.length) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }

        function showCategory(index) {
            categories.forEach((category, i) => {
                category.classList.toggle('active', i === index);
            });
            updateProgress();
        }

        nextBtn.addEventListener('click', function() {
            // Validate current category before moving next
            const currentCategoryElement = categories[currentCategory];
            const requiredInputs = currentCategoryElement.querySelectorAll('input[required]:not(:checked)');
            
            if (requiredInputs.length > 0) {
                alert('Please complete all required selections in the current section.');
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

        // Initialize first category
        showCategory(0);
    }

    // Program and Major Selection Logic
    function updateMajorOptions(program) {
        console.log('Updating major options for program:', program);
        
        // Hide all optgroups first
        const bsitMajors = document.querySelector('.bsit-majors');
        const bscsMajors = document.querySelector('.bscs-majors');
        const bsisMajors = document.querySelector('.bsis-majors');
        
        if (bsitMajors) bsitMajors.style.display = 'none';
        if (bscsMajors) bscsMajors.style.display = 'none';
        if (bsisMajors) bsisMajors.style.display = 'none';
        
        // Show the appropriate optgroup based on selected program
        switch(program) {
            case 'BSIT':
                if (bsitMajors) bsitMajors.style.display = 'block';
                break;
            case 'BSCS':
                if (bscsMajors) bscsMajors.style.display = 'block';
                break;
            case 'BSIS':
                if (bsisMajors) bsisMajors.style.display = 'block';
                break;
        }
        
        // Show or hide the entire major group
        majorGroup.style.display = program ? 'block' : 'none';
        
        // Reset major selection
        majorSelect.value = '';
        selectedMajorInput.value = '';
    }

    // Program selection event listener
    programSelect.addEventListener('change', function() {
        const selectedProgram = this.value;
        
        // Update hidden program input
        selectedProgramInput.value = selectedProgram;
        
        // Update major options
        updateMajorOptions(selectedProgram);
    });

    // Major selection event listener
    majorSelect.addEventListener('change', function() {
        const selectedMajor = this.value;
        
        // Update hidden major input
        selectedMajorInput.value = selectedMajor;
    });

    // Call initialization when DOM is loaded
    initNavigation();
});