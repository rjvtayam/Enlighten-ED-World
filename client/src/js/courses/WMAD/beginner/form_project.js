document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const codeInput = document.getElementById('code-input');
    const outputDisplay = document.getElementById('output-display');
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Function to run the code
    function runCode() {
        // Get the input code
        const input = codeInput.value;

        // Create a complete HTML document
        const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Interactive Form</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        max-width: 500px; 
                        margin: 0 auto; 
                        padding: 20px; 
                    }
                    .error { color: red; }
                    .success { color: green; }
                </style>
                ${extractCSSFromInput(input)}
            </head>
            <body>
                ${extractHTMLFromInput(input)}
                <script>
                    ${extractJSFromInput(input)}
                <\/script>
            </body>
            </html>
        `;

        // Render the HTML in the iframe
        outputDisplay.srcdoc = fullHTML;
    }

    // Function to extract CSS from input
    function extractCSSFromInput(input) {
        const cssMatch = input.match(/<style>([\s\S]*?)<\/style>/);
        return cssMatch ? `<style>${cssMatch[1]}</style>` : '';
    }

    // Function to extract HTML from input
    function extractHTMLFromInput(input) {
        const htmlParts = input.split(/<style>[\s\S]*?<\/style>/);
        const jsMatch = input.match(/<script>([\s\S]*?)<\/script>/);
        return htmlParts.length > 1 ? htmlParts[0].trim() + (jsMatch ? '' : '') : input.trim();
    }

    // Function to extract JavaScript from input
    function extractJSFromInput(input) {
        const jsMatch = input.match(/<script>([\s\S]*?)<\/script>/);
        return jsMatch ? jsMatch[1] : '';
    }

    // Function to reset the playground
    function resetPlayground() {
        codeInput.value = `<!-- HTML Form -->
<form id="registrationForm">
    <h2>Registration Form</h2>
    
    <div>
        <label for="fullName">Full Name:</label>
        <input type="text" id="fullName" name="fullName" required>
        <span id="fullNameError" class="error"></span>
    </div>
    
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <span id="emailError" class="error"></span>
    </div>
    
    <div>
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" required>
        <span id="ageError" class="error"></span>
    </div>
    
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <span id="passwordError" class="error"></span>
    </div>
    
    <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required>
        <span id="confirmPasswordError" class="error"></span>
    </div>
    
    <button type="submit">Submit</button>
    <p id="formStatus"></p>
</form>

<style>
form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input {
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.error {
    color: red;
    font-size: 0.8em;
}

.success {
    color: green;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const age = document.getElementById('age');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const formStatus = document.getElementById('formStatus');

    // Validation functions
    function validateFullName() {
        const fullNameError = document.getElementById('fullNameError');
        if (fullName.value.length < 2) {
            fullNameError.textContent = 'Full name must be at least 2 characters';
            return false;
        }
        fullNameError.textContent = '';
        return true;
    }

    function validateEmail() {
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }
        emailError.textContent = '';
        return true;
    }

    function validateAge() {
        const ageError = document.getElementById('ageError');
        if (age.value < 18 || age.value > 100) {
            ageError.textContent = 'Age must be between 18 and 100';
            return false;
        }
        ageError.textContent = '';
        return true;
    }

    function validatePassword() {
        const passwordError = document.getElementById('passwordError');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password.value)) {
            passwordError.textContent = 'Password must be at least 8 characters, contain uppercase, lowercase, and number';
            return false;
        }
        passwordError.textContent = '';
        return true;
    }

    function validateConfirmPassword() {
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        if (password.value !== confirmPassword.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
            return false;
        }
        confirmPasswordError.textContent = '';
        return true;
    }

    // Real-time validation
    fullName.addEventListener('input', validateFullName);
    email.addEventListener('input', validateEmail);
    age.addEventListener('input', validateAge);
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);

    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate all fields
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isAgeValid = validateAge();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        // Check if all validations pass
        if (isFullNameValid && isEmailValid && isAgeValid && 
            isPasswordValid && isConfirmPasswordValid) {
            formStatus.textContent = 'Form submitted successfully!';
            formStatus.className = 'success';
            form.reset();
        } else {
            formStatus.textContent = 'Please correct the errors in the form.';
            formStatus.className = 'error';
        }
    });
});
<\/script>`;
        
        // Clear the iframe
        outputDisplay.srcdoc = '';
    }

    // Add event listeners
    runBtn.addEventListener('click', function(event) {
        event.preventDefault();
        runCode();
    });

    resetBtn.addEventListener('click', function(event) {
        event.preventDefault();
        resetPlayground();
    });

    // Add live preview on input
    codeInput.addEventListener('input', function() {
        runCode();
    });

    // Initial reset to set up the playground
    resetPlayground();
});