// Enhanced ES6 Interactive Tutorial
class ES6Tutorial {
    constructor() {
        this.features = [
            { 
                name: 'Let & Const', 
                description: 'Block-scoped variable declarations replacing var',
                example: `
// Let: Reassignable block-scoped variable
let age = 25; // Reassignable
const name = "John"; // Non-reassignable

// Difference from var
if (true) {
    var varVariable = "I'm function-scoped";
    let letVariable = "I'm block-scoped";
}
// console.log(varVariable); // Works
// console.log(letVariable); // ReferenceError
                `
            },
            { 
                name: 'Arrow Functions', 
                description: 'Concise function syntax with lexical this binding',
                example: `
// Traditional function
function greet(name) {
    return \`Hello, \${name}\`;
}

// Arrow function
const greetArrow = (name) => \`Hello, \${name}\`;

// Arrow function with lexical this
const person = {
    name: 'John',
    sayHiLater() {
        setTimeout(() => {
            console.log(\`Hi, \${this.name}\`);
        }, 1000);
    }
}
                `
            },
            { 
                name: 'Template Literals', 
                description: 'Multi-line strings with embedded expressions',
                example: `
const name = "Alice";
const greeting = \`Hello, \${name}!
This is a 
multi-line string.\`;
console.log(greeting);

// Expressions in template literals
const a = 5, b = 10;
console.log(\`Fifteen is \${a + b} and not \${2 * a + b}.\`);
                `
            },
            { 
                name: 'Destructuring Assignment', 
                description: 'Easy extraction of values from arrays or objects',
                example: `
// Array Destructuring
const arr = [1, 2, 3];
const [a, b] = arr;
console.log(a, b); // Output: 1 2

// Object Destructuring
const person = { name: "John", age: 30 };
const { name, age } = person;
console.log(name, age); // Output: John 30

// Nested Destructuring
const nested = { 
    user: { 
        firstName: "John", 
        lastName: "Doe" 
    } 
};
const { user: { firstName } } = nested;
                `
            },
            { 
                name: 'Spread and Rest Operators', 
                description: 'Flexible array and function parameter handling',
                example: `
// Spread Operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2); // Output: [1, 2, 3, 4, 5]

// Rest Operator
function sum(...numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sum(1, 2, 3, 4)); // Output: 10
                `
            },
            { 
                name: 'Default Parameters', 
                description: 'Function parameters with default values',
                example: `
function greet(name = "Guest") {
    console.log(\`Hello, \${name}\`);
}
greet(); // Output: Hello, Guest
greet("Alice"); // Output: Hello, Alice

// With multiple parameters
function createUser(name, age = 25, isAdmin = false) {
    return { name, age, isAdmin };
}
                `
            },
            { 
                name: 'Classes', 
                description: 'Object-oriented programming support',
                example: `
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(\`Hello, my name is \${this.name}\`);
    }
    
    static createAnonymous() {
        return new Person("Anonymous", 0);
    }
}

const person = new Person("John", 30);
person.greet(); // Output: Hello, my name is John
                `
            },
            { 
                name: 'Modules', 
                description: 'Code organization and file separation',
                example: `
// file1.js
export const greet = (name) => \`Hello, \${name}\`;
export const PI = 3.14159;

// file2.js
import { greet, PI } from './file1.js';
console.log(greet("Alice")); // Output: Hello, Alice
                `
            },
            { 
                name: 'Promises', 
                description: 'Handling asynchronous operations',
                example: `
const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Data loaded"), 2000);
});

fetchData
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
                `
            },
            { 
                name: 'Async/Await', 
                description: 'Synchronous-like asynchronous code',
                example: `
async function fetchData() {
    try {
        let response = await fetch("https://api.example.com/data");
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
                `
            }
        ];

        this.quizQuestions = [
            {
                question: "What is the primary difference between 'let' and 'const'?",
                options: [
                    "Scope", 
                    "Reassignability", 
                    "Declaration syntax", 
                    "Memory allocation"
                ],
                answer: "Reassignability",
                explanation: "const prevents reassignment, while let allows it."
            },
            {
                question: "What does the spread operator (...) do?",
                options: [
                    "Creates a new array", 
                    "Spreads elements of an array", 
                    "Removes elements", 
                    "Sorts an array"
                ],
                answer: "Spreads elements of an array",
                explanation: "The spread operator expands an array into individual elements."
            },
            {
                question: "How do arrow functions differ from traditional functions in terms of 'this' binding?",
                options: [
                    "They have no difference",
                    "Arrow functions inherit 'this' from the surrounding code",
                    "Traditional functions inherit 'this'",
                    "Arrow functions always use global 'this'"
                ],
                answer: "Arrow functions inherit 'this' from the surrounding code",
                explanation: "Arrow functions lexically bind the 'this' value, meaning they use the 'this' from the enclosing scope."
            },
            {
                question: "What is the purpose of template literals in ES6?",
                options: [
                    "To create complex algorithms",
                    "To define new data types",
                    "To enable string interpolation and multi-line strings",
                    "To create regular expressions"
                ],
                answer: "To enable string interpolation and multi-line strings",
                explanation: "Template literals allow easy embedding of expressions and create multi-line strings using backticks."
            },
            {
                question: "Which ES6 feature allows you to extract multiple values from an array in a single line?",
                options: [
                    "Spread operator",
                    "Destructuring",
                    "Rest parameters",
                    "Object literal"
                ],
                answer: "Destructuring",
                explanation: "Destructuring allows you to unpack values from arrays or properties from objects into distinct variables."
            }
        ];

        this.initializeDOM();
    }

    initializeDOM() {
        this.createFeatureSection();
        this.setupAdvancedQuiz();
    }

    createFeatureSection() {
        const featureContainer = document.getElementById('features');
        
        this.features.forEach(feature => {
            const featureCard = document.createElement('div');
            featureCard.classList.add('feature-card');
            
            featureCard.innerHTML = `
                <h3>${feature.name}</h3>
                <p>${feature.description}</p>
                <div class="feature-example">
                    <pre><code>${feature.example}</code></pre>
                </div>
            `;

            featureContainer.querySelector('.feature-grid').appendChild(featureCard);
        });
    }

    setupAdvancedQuiz() {
        const quizContainer = document.getElementById('quiz-container');

        this.quizQuestions.forEach((q, index) => {
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');
            quizCard.innerHTML = `
                <h3>Question ${index + 1}: ${q.question}</h3>
                <div class="options">
                    ${q.options.map(opt => `
                        <label class="option">
                            <input type="radio" name="q${index}" value="${opt}">
                            ${opt}
                        </label>
                    `).join('')}
                </div>
                <button class="submit-answer">Submit Answer</button>
                <div class="answer-feedback"></div>
            `;

            const submitBtn = quizCard.querySelector('.submit-answer');
            const feedbackDiv = quizCard.querySelector('.answer-feedback');
            const options = quizCard.querySelectorAll('input[type="radio"]');

            submitBtn.addEventListener('click', () => {
                const selectedOption = Array.from(options).find(opt => opt.checked);
                if (selectedOption) {
                    const isCorrect = selectedOption.value === q.answer;
                    feedbackDiv.textContent = isCorrect 
                        ? "Correct! 🎉" 
                        : `Incorrect. The correct answer is: ${q.answer}`;
                    feedbackDiv.style.color = isCorrect ? 'green' : 'red';
                    
                    // Show explanation
                    feedbackDiv.innerHTML += `<p class="explanation">${q.explanation}</p>`;
                } else {
                    feedbackDiv.textContent = "Please select an answer.";
                    feedbackDiv.style.color = 'red';
                }
            });

            quizContainer.appendChild(quizCard);
        });
        
        this.resources = [
            {
                title: "MDN Web Docs: ES6 Features",
                description: "Comprehensive guide to ES6 features by Mozilla",
                type: "Documentation",
                link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
                icon: "📖"
            },
            {
                title: "JavaScript.info: Modern JavaScript Tutorial",
                description: "In-depth tutorial covering modern JavaScript",
                type: "Tutorial",
                link: "https://javascript.info/",
                icon: "💻"
            },
            {
                title: "Eloquent JavaScript",
                description: "Free online book covering modern JavaScript",
                type: "Book",
                link: "https://eloquentjavascript.net/",
                icon: "📘"
            },
            {
                title: "ES6 Cheatsheet",
                description: "Quick reference for ES6+ features",
                type: "Cheatsheet",
                link: "https://devhints.io/es6",
                icon: "🧾"
            },
            {
                title: "FreeCodeCamp ES6 Course",
                description: "Free interactive ES6 learning course",
                type: "Online Course",
                link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#es6",
                icon: "🎓"
            },
            {
                title: "Udemy ES6 Mastery",
                description: "Comprehensive ES6 video course",
                type: "Video Course",
                link: "https://www.udemy.com/topic/javascript/",
                icon: "🎥"
            }
        ];

        // Add this method to the existing class
        this.initializeResources();
    }

    // New method to initialize resources
    initializeResources() {
        const resourcesContainer = document.getElementById('resources');
        const resourcesGrid = resourcesContainer.querySelector('.resources-grid');

        this.resources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.classList.add('resource-card');
            
            resourceCard.innerHTML = `
                <div class="resource-icon">${resource.icon}</div>
                <div class="resource-content">
                    <h3>${resource.title}</h3>
                    <p>${resource.description}</p>
                    <div class="resource-meta">
                        <span class="resource-type">${resource.type}</span>
                        <a href="${resource.link}" target="_blank" class="resource-link">
                            Explore →
                        </a>
                    </div>
                </div>
            `;

            resourcesGrid.appendChild(resourceCard);
        });
    }
}

// Initialize the tutorial when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => new ES6Tutorial());