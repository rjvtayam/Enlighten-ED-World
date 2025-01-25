document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('skillsAssessmentForm');
    const categories = document.querySelectorAll('.skill-category');
    const progress = document.querySelector('.progress-bar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const programSelect = document.getElementById('programSelect');
    const majorGroup = document.getElementById('majorGroup');
    const majorSelect = document.getElementById('major');
    const assessmentFormSection = document.getElementById('assessmentFormSection');
    const resultsSection = document.getElementById('resultsSection');
    
    let currentCategory = 0;
    let skillsChart = null;

    // Initialize the first category
    showCategory(0);
    
    // Handle program selection
    programSelect.addEventListener('change', function() {
        const selectedProgram = this.value.toLowerCase();
        
        // Show/hide major selection based on program
        if (selectedProgram) {
            majorGroup.style.display = 'block';
            
            // Hide all optgroups first
            majorSelect.querySelectorAll('optgroup').forEach(group => {
                group.style.display = 'none';
            });
            
            // Show only the relevant optgroup
            const relevantGroup = majorSelect.querySelector(`.${selectedProgram}-majors`);
            if (relevantGroup) {
                relevantGroup.style.display = 'block';
            }
            
            // Reset major selection
            majorSelect.value = '';
        } else {
            majorGroup.style.display = 'none';
            majorSelect.value = '';
        }
    });
    
    function showCategory(index) {
        categories.forEach(cat => cat.classList.remove('active'));
        categories[index].classList.add('active');
        
        // Update progress
        const progressPercentage = ((index + 1) / categories.length) * 100;
        progress.style.width = `${progressPercentage}%`;
        progress.setAttribute('aria-valuenow', progressPercentage);
        
        // Update buttons
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === categories.length - 1 ? 'none' : 'block';
        submitBtn.style.display = index === categories.length - 1 ? 'block' : 'none';
    }
    
    nextBtn.addEventListener('click', function() {
        // Validate program and major selection first
        if (!programSelect.value) {
            alert('Please select your program before proceeding.');
            programSelect.focus();
            return;
        }
        
        if (majorGroup.style.display !== 'none' && !majorSelect.value) {
            alert('Please select your major before proceeding.');
            majorSelect.focus();
            return;
        }
        
        // Validate current category
        const currentVisibleInputs = categories[currentCategory].querySelectorAll('input[type="radio"]');
        const groups = {};
        currentVisibleInputs.forEach(input => {
            const name = input.getAttribute('name');
            groups[name] = groups[name] || false;
            if (input.checked) groups[name] = true;
        });
        
        if (Object.values(groups).includes(false)) {
            alert('Please rate all skills in this category before proceeding.');
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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            // Validate program and major
            if (!programSelect.value) {
                throw new Error('Please select your program');
            }

            if (majorGroup.style.display !== 'none' && !majorSelect.value) {
                throw new Error('Please select your major');
            }

            // Validate all inputs
            const allInputs = form.querySelectorAll('input[type="radio"]');
            const groups = {};
            allInputs.forEach(input => {
                const name = input.getAttribute('name');
                groups[name] = groups[name] || false;
                if (input.checked) groups[name] = true;
            });
            
            if (Object.values(groups).includes(false)) {
                throw new Error('Please rate all skills before submitting.');
            }

            // Get CSRF token
            const csrfToken = document.querySelector('input[name="csrf_token"]').value;
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit assessment');
            }

            const results = await response.json();
            
            if (!results.success) {
                throw new Error(results.error || 'Failed to process assessment results');
            }
            
            // Hide form and show results
            assessmentFormSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Update overall score and level
            const overallScore = results.recommendations.score;
            const overallLevel = results.recommendations.level;
            
            document.getElementById('overallScore').textContent = `${Math.round(overallScore)}%`;
            document.getElementById('overallLevel').textContent = overallLevel;
            document.getElementById('overallLevelText').textContent = overallLevel.toLowerCase();
            
            // Create the radar chart
            const ctx = document.getElementById('skillsRadarChart').getContext('2d');
            
            if (skillsChart) {
                skillsChart.destroy();
            }

            const categoryLabels = {
                technical: 'Technical Skills',
                communication: 'Communication Skills',
                soft: 'Soft Skills',
                creativity: 'Creativity Skills'
            };
            
            skillsChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: Object.keys(results.category_scores).map(key => categoryLabels[key] || key),
                    datasets: [{
                        label: 'Your Skills',
                        data: Object.values(results.category_scores),
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        pointBackgroundColor: 'rgb(54, 162, 235)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(54, 162, 235)'
                    }]
                },
                options: {
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 5,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Score: ${context.raw.toFixed(1)}`;
                                }
                            }
                        }
                    }
                }
            });

            // Add click handler for recommendations button
            const viewRecommendationsBtn = document.getElementById('viewRecommendationsBtn');
            const recommendationsSection = document.getElementById('recommendationsSection');
            const recommendedCourses = document.getElementById('recommendedCourses');
            
            viewRecommendationsBtn.addEventListener('click', function() {
                recommendedCourses.innerHTML = ''; // Clear existing recommendations
                
                // Create course cards for each recommended course
                results.recommendations.courses.forEach(course => {
                    const card = document.createElement('div');
                    card.className = 'course-card';
                    
                    const levelClass = `level-${course.level.toLowerCase()}`;
                    
                    card.innerHTML = `
                        <a href="${course.url}" class="course-card-link">
                            <div class="course-image">
                                <img src="${course.image}" alt="${course.name}" class="course-card__image">
                            </div>
                            <div class="course-content">
                                <h3 class="course-card__title">${course.name}</h3>
                                <p class="course-card__description">${course.description}</p>
                                <span class="course-card__level ${levelClass}">${course.level}</span>
                            </div>
                        </a>
                    `;
                    
                    recommendedCourses.appendChild(card);
                });
                
                // Show recommendations section
                recommendationsSection.style.display = 'block';
                viewRecommendationsBtn.style.display = 'none';
            });

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'There was a problem submitting your assessment. Please try again.');
        } finally {
            // Reset submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Assessment';
        }
    });
});