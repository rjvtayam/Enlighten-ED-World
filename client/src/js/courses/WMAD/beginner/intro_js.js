// JavaScript for Interactive Elements

// Event listener for the demo button
document.getElementById('demoButton').addEventListener('click', function() {
    // Change button text when clicked
    if (this.textContent === 'Click me!') {
        this.textContent = 'You clicked me!';
    } else {
        this.textContent = 'Click me!';
    }
});

// Demonstrating console output
console.log("JavaScript is loaded and ready!");

// Simple function to show an alert
function showWelcomeMessage() {
    alert("Welcome to the Introduction to JavaScript!");
}
// Previous JavaScript remains the same, add these new functions

// Age Checker Exercise
document.getElementById('checkAgeBtn').addEventListener('click', function() {
    const ageInput = document.getElementById('ageInput');
    const ageResult = document.getElementById('ageResult');
    const age = parseInt(ageInput.value);

    if (isNaN(age)) {
        ageResult.textContent = "Please enter a valid age.";
        ageResult.style.color = "red";
    } else if (age >= 18) {
        ageResult.textContent = "You can vote!";
        ageResult.style.color = "green";
    } else {
        ageResult.textContent = "You cannot vote yet.";
        ageResult.style.color = "red";
    }
});

// Temperature Converter Exercise
document.getElementById('convertTempBtn').addEventListener('click', function() {
    const celsiusInput = document.getElementById('celsiusInput');
    const tempResult = document.getElementById('tempResult');
    const celsius = parseFloat(celsiusInput.value);

    if (isNaN(celsius)) {
        tempResult.textContent = "Please enter a valid temperature.";
        tempResult.style.color = "red";
    } else {
        const fahrenheit = (celsius * 9/5) + 32;
        tempResult.textContent = `${celsius}°C is equal to ${fahrenheit.toFixed(2)}°F`;
        tempResult.style.color = "blue";
    }
});

// To-Do List Exercise
document.getElementById('addTodoBtn').addEventListener('click', function() {
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    
    if (todoInput.value.trim() !== "") {
        const li = document.createElement('li');
        li.textContent = todoInput.value;
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', function() {
            todoList.removeChild(li);
        });
        
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
        
        // Clear input
        todoInput.value = "";
    }
});

// Age Checker Exercise
document.getElementById('checkAgeBtn').addEventListener('click', function() {
    // Get references to input and result elements
    const ageInput = document.getElementById('ageInput');
    const ageResult = document.getElementById('ageResult');
    
    // Convert input to a number using parseInt
    const age = parseInt(ageInput.value);

    // Validate input and provide appropriate messages
    if (isNaN(age)) {
        // Handle invalid input (not a number)
        ageResult.textContent = "Please enter a valid age.";
        ageResult.style.color = "red";
    } else if (age >= 18) {
        // Check if age is 18 or above
        ageResult.textContent = "You can vote!";
        ageResult.style.color = "green";
    } else {
        // Age is below 18
        ageResult.textContent = "You cannot vote yet.";
        ageResult.style.color = "red";
    }
});

// Temperature Converter Exercise
document.getElementById('convertTempBtn').addEventListener('click', function() {
    // Get references to input and result elements
    const celsiusInput = document.getElementById('celsiusInput');
    const tempResult = document.getElementById('tempResult');
    
    // Convert input to a number using parseFloat
    const celsius = parseFloat(celsiusInput.value);

    // Validate input and perform conversion
    if (isNaN(celsius)) {
        // Handle invalid input
        tempResult.textContent = "Please enter a valid temperature.";
        tempResult.style.color = "red";
    } else {
        // Convert Celsius to Fahrenheit
        const fahrenheit = (celsius * 9/5) + 32;
        
        // Display result with two decimal places
        tempResult.textContent = `${celsius}°C is equal to ${fahrenheit.toFixed(2)}°F`;
        tempResult.style.color = "blue";
    }
});

// To-Do List Exercise
document.getElementById('addTodoBtn').addEventListener('click', function() {
    // Get references to input and list elements
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    
    // Check if input is not empty
    if (todoInput.value.trim() !== "") {
        // Create a new list item
        const li = document.createElement('li');
        li.textContent = todoInput.value;
        
        // Create a delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', function() {
            // Remove the task when delete is clicked
            todoList.removeChild(li);
        });
        
        // Add delete button to the list item
        li.appendChild(deleteBtn);
        
        // Add list item to the todo list
        todoList.appendChild(li);
        
        // Clear the input field
        todoInput.value = "";
    }
});