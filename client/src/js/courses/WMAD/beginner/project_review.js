document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const submitButton = document.getElementById('submitReview');
    const certificateContainer = document.querySelector('.certificate-container');
    const namePlaceholder = document.querySelector('.name-placeholder');

    // Form submission handling
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(reviewForm);
        const submissionData = {};
        
        for (let [key, value] of formData.entries()) {
            submissionData[key] = value;
        }

        // Basic validation
        if (!submissionData.understandingLevel || !submissionData.challengingProject) {
            alert('Please complete all required fields.');
            return;
        }

        // Optional: Send data to a backend (simulated here)
        console.log('Submission Data:', submissionData);

        // Update certificate
        const nameInput = prompt('Enter your name for the certificate:');
        if (nameInput) {
            namePlaceholder.textContent = nameInput;
            certificateContainer.classList.add('completed');
        }

        // Provide feedback
        alert('Thank you for completing the course review! Your certificate is ready.');

        // Optional: Reset form
        reviewForm.reset();
    });

    // Interactive elements
    const nextStepsSelect = document.getElementById('nextSteps');
    nextStepsSelect.addEventListener('change', function() {
        const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
        console.log('Selected next learning steps:', selectedOptions);
    });
});