// Basic Function Example
function runBasicFunction() {
    const output = document.getElementById('basic-function-output');
    output.textContent = "Hello, World!";
}

// Function with Parameters Example
function runParameterFunction() {
    const nameInput = document.getElementById('nameInput');
    const output = document.getElementById('parameter-function-output');
    const name = nameInput.value || 'Guest';
    output.textContent = `Hello, ${name}!`;
}

// Function with Return Value Example
function runReturnFunction() {
    const num1 = parseFloat(document.getElementById('num1').value) || 0;
    const num2 = parseFloat(document.getElementById('num2').value) || 0;
    const output = document.getElementById('return-function-output');
    
    function add(x, y) {
        return x + y;
    }
    
    output.textContent = `Result: ${add(num1, num2)}`;
}

// Practice Challenge Functionality
const challenges = {
    rectangle: {
        inputs: [
            { id: 'length', label: 'Length', type: 'number', placeholder: 'Enter length' },
            { id: 'width', label: 'Width', type: 'number', placeholder: 'Enter width' }
        ],
        hints: [
            "Calculate the area of a rectangle using length * width",
            "Remember: Area = length × width",
            "Tip: Use parameters to make your function flexible"
        ],
        defaultFunction: `function calculateRectangleArea(length, width) {
    return length * width;
}`,
        solve: (a, b) => a * b
    },
    temperature: {
        inputs: [
            { id: 'temp', label: 'Temperature', type: 'number', placeholder: 'Enter temperature' },
            { id: 'scale', label: 'Scale', type: 'select', options: ['C to F', 'F to C'] }
        ],
        hints: [
            "Convert between Celsius and Fahrenheit",
            "Celsius to Fahrenheit: (C × 9/5) + 32",
            "Fahrenheit to Celsius: (F - 32) × 5/9"
        ],
        defaultFunction: `function convertTemperature(temp, scale) {
    if (scale === 'C to F') {
        return (temp * 9/5) + 32;
    } else {
        return (temp - 32) * 5/9;
    }
}`,
        solve: (temp, scale) => {
            if (scale === 'C to F') {
                return ((temp * 9/5) + 32).toFixed(2);
            } else {
                return ((temp - 32) * 5/9).toFixed(2);
            }
        }
    },
    bmi: {
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (m)', type: 'number', placeholder: 'Enter height' }
        ],
        hints: [
            "Calculate Body Mass Index (BMI)",
            "BMI Formula: weight / (height)²",
            "Round to 2 decimal places"
        ],
        defaultFunction: `function calculateBMI(weight, height) {
    return weight / (height * height);
}`,
        solve: (weight, height) => (weight / (height * height)).toFixed(2)
    }
};

// Dynamic Challenge Setup
const challengeSelector = document.getElementById('challengeSelector');
const inputFieldsContainer = document.getElementById('inputFields');
const functionCodeElement = document.getElementById('functionCode');
const challengeHintsElement = document.getElementById('challengeHints');

// Update challenge inputs and hints when selector changes
challengeSelector.addEventListener('change', updateChallenge);

function updateChallenge() {
    const selectedChallenge = challengeSelector.value;
    const challenge = challenges[selectedChallenge];

    // Clear previous inputs
    inputFieldsContainer.innerHTML = '';

    // Create new input fields
    challenge.inputs.forEach(input => {
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'input-wrapper';

        const label = document.createElement('label');
        label.textContent = input.label;

        let inputElement;
        if (input.type === 'select') {
            inputElement = document.createElement('select');
            input.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                inputElement.appendChild(option);
            });
        } else {
            inputElement = document.createElement('input');
            inputElement.type = input.type;
            inputElement.placeholder = input.placeholder;
        }
        inputElement.id = input.id;

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(inputElement);
        inputFieldsContainer.appendChild(inputWrapper);
    });

    // Update function code
    functionCodeElement.textContent = challenge.defaultFunction;

    // Update hints
    challengeHintsElement.innerHTML = challenge.hints.map(hint => `<p>• ${hint}</p>`).join('');
}

// Initial challenge setup
updateChallenge();

// Run Challenge Function
function runChallengeFunction() {
    const selectedChallenge = challengeSelector.value;
    const challenge = challenges[selectedChallenge];
    const outputElement = document.getElementById('challengeOutput');

    try {
        // Get input values dynamically
        const inputs = challenge.inputs.map(input => {
            const element = document.getElementById(input.id);
            return element.type === 'select' ? element.value : parseFloat(element.value);
        });

        // Evaluate user's function
        const userFunction = new Function('a', 'b', functionCodeElement.textContent);
        const result = userFunction(...inputs);

        // Compare with solution
        const expectedResult = challenge.solve(...inputs);

        outputElement.innerHTML = `
            <p>Your Result: <strong>${result}</strong></p>
            <p>Expected Result: <strong>${expectedResult}</strong></p>
            <p class="${result === expectedResult ? 'success' : 'error'}">
                ${result === expectedResult ? '✅ Correct!' : '❌ Try Again!'}
            </p>
        `;
    } catch (error) {
        outputElement.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}