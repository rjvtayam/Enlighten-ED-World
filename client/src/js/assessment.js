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
        
        // Validate program and major
        if (!programSelect.value) {
            alert('Please select your program');
            programSelect.focus();
            return;
        }

        if (majorGroup.style.display !== 'none' && !majorSelect.value) {
            alert('Please select your major');
            majorSelect.focus();
            return;
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
            alert('Please rate all skills before submitting.');
            return;
        }

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const results = await response.json();
            
            // Hide form and show results
            assessmentFormSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Create the radar chart
            const ctx = document.getElementById('skillsChart').getContext('2d');
            
            if (skillsChart) {
                skillsChart.destroy();
            }
            
            skillsChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: Object.keys(results.averages).map(key => key.replace(/_/g, ' ').toUpperCase()),
                    datasets: [{
                        label: 'Your Skills',
                        data: Object.values(results.averages),
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
                            suggestedMax: 5
                        }
                    }
                }
            });

            // Update recommendations
            const recommendationsContainer = document.getElementById('recommendations');
            recommendationsContainer.innerHTML = '';
            
            results.recommendations.forEach(rec => {
                const recElement = document.createElement('div');
                recElement.className = 'recommendation-item';
                recElement.innerHTML = `
                    <h3>${rec.category}</h3>
                    <p>${rec.text}</p>
                    ${rec.resources ? `<div class="resources">
                        <h4>Recommended Resources:</h4>
                        <ul>${rec.resources.map(r => `<li><a href="${r.url}" target="_blank">${r.title}</a></li>`).join('')}</ul>
                    </div>` : ''}
                `;
                recommendationsContainer.appendChild(recElement);
            });

        } catch (error) {
            console.error('Error:', error);
            alert('There was a problem submitting your assessment. Please try again.');
        }
    });
});