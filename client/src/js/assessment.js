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
    const assessmentFormSection = document.getElementById('assessmentFormSection');
    const resultsSection = document.getElementById('resultsSection');
    
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
        const progressBar = document.querySelector('.progress-bar');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        function updateProgress() {
            const progressPercentage = ((currentCategory + 1) / categories.length) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }

        function showCategory(index) {
            categories.forEach((category, i) => {
                category.classList.toggle('active', i === index);
            });
            
            // Toggle buttons based on current category
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === categories.length - 1 ? 'none' : 'block';
            submitBtn.style.display = index === categories.length - 1 ? 'block' : 'none';
            
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

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all inputs one last time
            if (!selectedProgramInput.value || !selectedMajorInput.value) {
                alert('Please select your program and major');
                programSelect.focus();
                return;
            }

            // Validate all visible inputs across all categories
            const visibleInputs = form.querySelectorAll('.skill-category input[type="radio"]');
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

            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const loadingText = submitBtn.querySelector('.loading-text');
            
            if (btnText) btnText.style.display = 'none';
            if (loadingText) loadingText.style.display = 'inline-block';
            submitBtn.disabled = true;

            // Prepare form data
            const formData = new FormData(form);

            // Submit assessment
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': csrfTokenElement.value,
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                redirect: 'follow'  // Important for handling redirects
            })
            .then(response => {
                // If response is a redirect, fetch the results page
                if (response.type === 'opaqueredirect') {
                    return fetch(url_for('assessment.assessment_results'), {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                }
                
                // If not a redirect, parse as JSON
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide form section, show results section
                assessmentFormSection.style.display = 'none';
                resultsSection.style.display = 'block';
                
                // Populate results
                document.getElementById('overallScore').textContent = data.overall_score || 'N/A';
                document.getElementById('overallLevel').textContent = data.skill_level || 'N/A';
                
                // Optional: Populate more detailed results if available
                console.log('Assessment Results:', data);
            })
            .catch(error => {
                console.error('Submission error:', error);
                alert('Error submitting assessment. Please try again.');
                
                // Restore submit button
                if (btnText) btnText.style.display = 'inline-block';
                if (loadingText) loadingText.style.display = 'none';
                submitBtn.disabled = false;
            });
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