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
    
    // Initialize the first category
    showCategory(0);
    
    // Fetch programs and majors dynamically
    function fetchProgramsAndMajors() {
        fetch('/assessment/get_programs_and_majors')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch programs and majors');
                }
                return response.json();
            })
            .then(data => {
                // Populate program select
                Object.keys(data.programs_and_majors).forEach(program => {
                    const option = document.createElement('option');
                    option.value = program;
                    option.textContent = program.replace(/BS/, 'Bachelor of Science in ');
                    programSelect.appendChild(option);
                });

                // Add event listener for dynamic major population
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
            })
            .catch(error => {
                console.error('Error fetching programs and majors:', error);
                alert('Unable to load programs. Please refresh the page.');
            });
    }

    // Call the function to fetch and set up programs
    fetchProgramsAndMajors();

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
        
        // Program and major validation
        if (!selectedProgramInput.value || !selectedMajorInput.value) {
            alert('Please select your program and major');
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
        console.log('Submitting assessment with program:', selectedProgramInput.value, 'and major:', selectedMajorInput.value);

        submitAssessment(formData);
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

    function submitAssessment(formData) {
        const assessmentFormSection = document.getElementById('assessmentFormSection');
        const resultsSection = document.getElementById('resultsSection');
        const overallScoreElement = document.getElementById('overallScore');
        const overallLevelElement = document.getElementById('overallLevel');
        const overallLevelTextElement = document.getElementById('overallLevelText');
        const categoryResultsElement = document.getElementById('categoryResults');
        const recommendedCoursesElement = document.getElementById('recommendedCourses');
        const skillsRadarChartElement = document.getElementById('skillsRadarChart');

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                throw new Error(data.message || 'Submission failed');
            }

            // Hide assessment form
            assessmentFormSection.style.display = 'none';
            
            // Show results section
            resultsSection.style.display = 'block';
            
            // Populate overall score and level
            if (overallScoreElement) {
                overallScoreElement.textContent = data.overall_score + '%';
            }
            
            if (overallLevelElement) {
                overallLevelElement.textContent = data.skill_level;
            }
            
            if (overallLevelTextElement) {
                overallLevelTextElement.textContent = data.skill_level;
            }
            
            // Populate category results
            if (categoryResultsElement && data.category_results) {
                categoryResultsElement.innerHTML = data.category_results.map(category => `
                    <div class="category-result">
                        <h3>${category.name}</h3>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${category.score}%">${category.score}%</div>
                        </div>
                        <p>${category.description}</p>
                    </div>
                `).join('');
            }
            
            // Populate recommended courses
            if (recommendedCoursesElement && data.recommended_courses) {
                recommendedCoursesElement.innerHTML = data.recommended_courses.map(course => `
                    <div class="course-card">
                        <h4>${course.title}</h4>
                        <p>${course.description}</p>
                        <a href="${course.link}" class="btn btn-sm btn-outline-primary">Enroll Now</a>
                    </div>
                `).join('');
            }
            
            // Mandatory Radar Chart
            if (!data.skills_radar_data) {
                throw new Error('Skills radar data is required but missing');
            }

            // Create radar chart using Chart.js
            const ctx = skillsRadarChartElement.getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: data.skills_radar_data.labels,
                    datasets: [{
                        label: 'Skills Assessment',
                        data: data.skills_radar_data.scores,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scale: {
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    title: {
                        display: true,
                        text: 'Skills Radar'
                    }
                }
            });
            
            console.log('Assessment submitted successfully:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting assessment: ' + error.message);
        });
    }
});