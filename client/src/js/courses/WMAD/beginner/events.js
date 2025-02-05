// Mouse Events Example
const mouseButton = document.getElementById('mouseButton');
const mouseOutput = document.getElementById('mouseOutput');

mouseButton.addEventListener('mouseenter', () => {
    mouseOutput.textContent = 'Mouse entered the button!';
    mouseButton.style.backgroundColor = 'lightblue';
});

mouseButton.addEventListener('mouseout', () => {
    mouseOutput.textContent = 'Mouse left the button!';
    mouseButton.style.backgroundColor = '';
});

mouseButton.addEventListener('click', () => {
    mouseOutput.textContent = 'Button clicked!';
});

// Keyboard Events Example
const keyboardInput = document.getElementById('keyboardInput');
const keyboardOutput = document.getElementById('keyboardOutput');

keyboardInput.addEventListener('keydown', (event) => {
    keyboardOutput.textContent = `Key pressed: ${event.key}`;
});

keyboardInput.addEventListener('input', () => {
    keyboardOutput.textContent = `Current input: ${keyboardInput.value}`;
});

// Form Events Example
const eventForm = document.getElementById('eventForm');
const formInput = document.getElementById('formInput');
const formOutput = document.getElementById('formOutput');

eventForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevents form submission to server
    formOutput.textContent = `Form submitted! Hello, ${formInput.value}!`;
});

// Event Delegation Example
const todoList = document.getElementById('todoList');
todoList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        console.log(`Clicked task: ${event.target.textContent}`);
    }
});

// Handling Window Events
window.addEventListener('load', function() {
    console.log('Page fully loaded');
});

window.addEventListener('resize', function() {
    console.log(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
});

window.addEventListener('scroll', function() {
    console.log(`Scrolled to: ${window.scrollY}px`);
});

// Interactive Playground Example: Mouse Events for a Button
const mouseButtonPlayground = document.getElementById('mouseButton');
const mouseOutputPlayground = document.getElementById('mouseOutput');

mouseButtonPlayground.addEventListener('mouseenter', () => {
    mouseOutputPlayground.textContent = 'Mouse entered the button!';
    mouseButtonPlayground.style.backgroundColor = 'lightblue';
});

mouseButtonPlayground.addEventListener('mouseout', () => {
    mouseOutputPlayground.textContent = 'Mouse left the button!';
    mouseButtonPlayground.style.backgroundColor = '';
});

mouseButtonPlayground.addEventListener('click', () => {
    mouseOutputPlayground.textContent = 'Button clicked!';
});

// Keyboard Input Event (Interactive Playground)
const keyboardInputPlayground = document.getElementById('keyboardInput');
const keyboardOutputPlayground = document.getElementById('keyboardOutput');

keyboardInputPlayground.addEventListener('keydown', (event) => {
    keyboardOutputPlayground.textContent = `Key pressed: ${event.key}`;
});

keyboardInputPlayground.addEventListener('input', () => {
    keyboardOutputPlayground.textContent = `Current input: ${keyboardInputPlayground.value}`;
});

// Form Submission (Interactive Playground)
const eventFormPlayground = document.getElementById('eventForm');
const formInputPlayground = document.getElementById('formInput');
const formOutputPlayground = document.getElementById('formOutput');

eventFormPlayground.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent form submission to server
    formOutputPlayground.textContent = `Form submitted! Hello, ${formInputPlayground.value}!`;
});
