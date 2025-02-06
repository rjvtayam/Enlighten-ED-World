// 1. The 'this' Keyword
document.getElementById('globalThisBtn').addEventListener('click', function() {
    const output = document.getElementById('thisOutput');
    output.textContent = `Global this: ${this === window ? 'Window Object' : this}`;
});

document.getElementById('objectThisBtn').addEventListener('click', function() {
    const output = document.getElementById('thisOutput');
    const person = {
        name: 'Alice',
        greet() {
            output.textContent = `Object this: ${this.name}`;
        }
    };
    person.greet();
});

// 2. Constructor Functions
document.getElementById('createCarBtn').addEventListener('click', function() {
    const brandInput = document.getElementById('carBrand');
    const yearInput = document.getElementById('carYear');
    const output = document.getElementById('constructorOutput');

    function Car(brand, year) {
        this.brand = brand;
        this.year = year;
        this.getAge = function() {
            return new Date().getFullYear() - this.year;
        };
    }

    const car = new Car(brandInput.value, parseInt(yearInput.value));
    output.textContent = `Car: ${car.brand}, Age: ${car.getAge()} years`;
});

// 3. Prototypes and Prototype Inheritance
document.getElementById('prototypeMethodBtn').addEventListener('click', function() {
    const output = document.getElementById('prototypeOutput');

    function Animal(name) {
        this.name = name;
    }

    Animal.prototype.speak = function() {
        output.textContent = `${this.name} makes a noise.`;
    };

    const dog = new Animal('Rex');
    dog.speak();
});

// 4. ES6 Classes
document.getElementById('createPersonBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('personName');
    const ageInput = document.getElementById('personAge');
    const output = document.getElementById('classOutput');

    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }

        greet() {
            return `Hello, my name is ${this.name} and I'm ${this.age} years old.`;
        }
    }

    const person = new Person(nameInput.value, parseInt(ageInput.value));
    output.textContent = person.greet();
});

// 5. Inheritance in Classes
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        return `${this.name} makes a sound.`;
    }
}

class Dog extends Animal {
    speak() {
        return `${this.name} barks: Woof! Woof!`;
    }
}

class Cat extends Animal {
    speak() {
        return `${this.name} meows: Meow! Meow!`;
    }
}

document.getElementById('dogBtn').addEventListener('click', function() {
    const output = document.getElementById('inheritanceOutput');
    const dog = new Dog('Buddy');
    output.textContent = dog.speak();
});

document.getElementById('catBtn').addEventListener('click', function() {
    const output = document.getElementById('inheritanceOutput');
    const cat = new Cat('Whiskers');
    output.textContent = cat.speak();
});

// 6. Getters and Setters
class User {
    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name.toUpperCase();
    }

    set name(newName) {
        this._name = newName;
    }
}

const user = new User('alice');

document.getElementById('setUserBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('userName');
    const output = document.getElementById('getterSetterOutput');
    
    user.name = nameInput.value;
    output.textContent = `Name set to: ${user.name}`;
});

document.getElementById('getUserBtn').addEventListener('click', function() {
    const output = document.getElementById('getterSetterOutput');
    output.textContent = `Current Name: ${user.name}`;
});

// 7. Static Methods and Properties
class MathUtils {
    static add(a, b) {
        return a + b;
    }
}

document.getElementById('staticMethodBtn').addEventListener('click', function() {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const output = document.getElementById('staticOutput');
    
    const result = MathUtils.add(
        parseFloat(num1Input.value), 
        parseFloat(num2Input.value)
    );
    output.textContent = `Result: ${result}`;
});

// 8. The super Keyword
class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }

    start() {
        return `${this.brand} is starting...`;
    }
}

class Car extends Vehicle {
    constructor(brand, model) {
        super(brand);
        this.model = model;
    }

    start() {
        const parentStart = super.start();
        return `${parentStart} ${this.model} is now running.`;
    }
}

document.getElementById('vehicleStartBtn').addEventListener('click', function() {
    const output = document.getElementById('superOutput');
    const myCar = new Car('Toyota', 'Camry');
    output.textContent = myCar.start();
});

// 9. Object Composition
const canFly = {
    fly() {
        return `${this.name} is flying!`;
    }
};

const canSwim = {
    swim() {
        return `${this.name} is swimming!`;
    }
};

class Bird {
    constructor(name) {
        this.name = name;
    }
}

document.getElementById('flyBtn').addEventListener('click', function() {
    const output = document.getElementById('compositionOutput');
    Object.assign(Bird.prototype, canFly);
    const eagle = new Bird('Eagle');
    output.textContent = eagle.fly();
});

document.getElementById('swimBtn').addEventListener('click', function() {
    const output = document.getElementById('compositionOutput');
    Object.assign(Bird.prototype, canSwim);
    const penguin = new Bird('Penguin');
    output.textContent = penguin.swim();
});

// 10. Private Fields
class BankAccount {
    #balance = 0;

    deposit(amount) {
        this.#balance += amount;
        return `Balance: $${this.#balance}`;
    }
}

document.getElementById('depositBtn').addEventListener('click', function() {
    const depositInput = document.getElementById('depositAmount');
    const output = document.getElementById('privateFieldOutput');
    
    const account = new BankAccount();
    output.textContent = account.deposit(parseFloat(depositInput.value));
});

// Add animation delays to sections
document.querySelectorAll('section').forEach((section, index) => {
    section.style.setProperty('--delay', index);
});

// Interactive code highlighting
document.querySelectorAll('pre code').forEach((codeBlock) => {
    codeBlock.addEventListener('click', () => {
        const range = document.createRange();
        range.selectNodeContents(codeBlock);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
});

// Quiz Questions
const quizQuestions = [
    {
        question: "What does the 'this' keyword refer to in JavaScript?",
        options: [
            "Always refers to the global window object",
            "Refers to the object that is executing the current function",
            "Refers to the function itself",
            "Refers to the parent class"
        ],
        correct: 1,
        explanation: "The 'this' keyword refers to the object that is executing the current function, and its value depends on how the function is called."
    },
    {
        question: "What is a constructor function used for?",
        options: [
            "To create CSS styles",
            "To create multiple object instances",
            "To define static methods",
            "To create arrow functions"
        ],
        correct: 1,
        explanation: "Constructor functions are special functions used to create multiple object instances with shared properties and methods."
    },
    {
        question: "What is prototype inheritance in JavaScript?",
        options: [
            "A way to create CSS classes",
            "A method to clone objects",
            "Objects inheriting properties/methods from other objects",
            "A way to create private methods"
        ],
        correct: 2,
        explanation: "Prototype inheritance allows objects to inherit properties and methods from other objects, saving memory by sharing methods."
    },
    {
        question: "What is the purpose of the 'extends' keyword in ES6 classes?",
        options: [
            "To add new properties to a class",
            "To create a new instance of a class",
            "To implement inheritance between classes",
            "To define static methods"
        ],
        correct: 2,
        explanation: "The 'extends' keyword is used to create a class that is a child of another class, implementing inheritance."
    },
    {
        question: "What are getters and setters used for?",
        options: [
            "To create new objects",
            "To define static methods",
            "To encapsulate logic for retrieving and modifying object properties",
            "To create private fields"
        ],
        correct: 2,
        explanation: "Getters and setters encapsulate logic for retrieving and modifying object properties, providing more control over data access."
    },
    {
        question: "What is a static method in a class?",
        options: [
            "A method that can be called on class instances",
            "A method that belongs to the class itself",
            "A method that creates new instances",
            "A method that defines private fields"
        ],
        correct: 1,
        explanation: "Static methods belong to the class itself, not to instances of the class, and can be called directly on the class."
    },
    {
        question: "What does the 'super' keyword do in class inheritance?",
        options: [
            "Creates a new class",
            "Refers to the parent class and allows calling its constructor or methods",
            "Defines private fields",
            "Creates static methods"
        ],
        correct: 1,
        explanation: "The 'super' keyword refers to the parent class and allows calling its constructor or methods in the child class."
    },
    {
        question: "What is object composition?",
        options: [
            "A way to create nested objects",
            "A method to clone objects",
            "An alternative to inheritance that avoids deep inheritance trees",
            "A way to define private methods"
        ],
        correct: 2,
        explanation: "Object composition is an approach that avoids deep inheritance trees by combining objects with different capabilities."
    },
    {
        question: "What are private fields in JavaScript classes?",
        options: [
            "Fields that can be accessed from anywhere",
            "Fields that can only be accessed within the class",
            "Fields that are always public",
            "Fields that create static methods"
        ],
        correct: 1,
        explanation: "Private fields (introduced in ES2020) are variables that cannot be accessed outside the class, providing better encapsulation."
    },
    {
        question: "Why use classes in JavaScript?",
        options: [
            "To create CSS styles",
            "To define global functions",
            "To provide cleaner syntax and encapsulation for object creation",
            "To create arrow functions"
        ],
        correct: 2,
        explanation: "Classes provide a cleaner syntax for object creation, better encapsulation, and make the code more readable and maintainable."
    }
];

// Quiz Logic
class OOPQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.quizStarted = false;

        this.elements = {
            question: document.getElementById('quiz-question'),
            options: document.getElementById('quiz-options'),
            feedback: document.getElementById('feedback-text'),
            currentQuestion: document.getElementById('current-question'),
            scoreValue: document.getElementById('score-value'),
            progressBar: document.querySelector('.progress-bar')
        };
    }

    start() {
        this.quizStarted = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.elements.scoreValue.textContent = '0';
        this.loadQuestion();
    }

    loadQuestion() {
        if (this.currentQuestion >= quizQuestions.length) {
            this.finish();
            return;
        }

        const question = quizQuestions[this.currentQuestion];
        this.elements.question.textContent = question.question;
        this.elements.currentQuestion.textContent = `Question ${this.currentQuestion + 1}/${quizQuestions.length}`;
        
        // Update progress bar
        this.elements.progressBar.style.setProperty('--progress', 
            `${(this.currentQuestion / quizQuestions.length) * 100}%`
        );

        // Clear previous options
        this.elements.options.innerHTML = '';

        // Create new options
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.textContent = option;
            optionBtn.classList.add('quiz-option');
            optionBtn.dataset.option = index;
            optionBtn.addEventListener('click', () => this.checkAnswer(index));
            this.elements.options.appendChild(optionBtn);
        });

        // Reset feedback
        this.elements.feedback.textContent = '';
    }

    checkAnswer(selectedIndex) {
        const question = quizQuestions[this.currentQuestion];
        const optionButtons = document.querySelectorAll('.quiz-option');

        optionButtons.forEach((btn, index) => {
            btn.classList.remove('correct', 'incorrect');
            if (index === question.correct) {
                btn.classList.add('correct');
            }
            if (index === selectedIndex) {
                if (selectedIndex === question.correct) {
                    this.score++;
                    this.elements.feedback.textContent = `Correct! ${question.explanation}`;
                    this.elements.feedback.classList.add('correct');
                } else {
                    this.elements.feedback.textContent = `Incorrect. ${question.explanation}`;
                    this.elements.feedback.classList.add('incorrect');
                }
            }
        });

        this.elements.scoreValue.textContent = this.score;

        // Move to next question after a delay
        setTimeout(() => {
            this.currentQuestion++;
            this.loadQuestion();
        }, 2000);
    }

    finish() {
        this.elements.question.textContent = 'Quiz Completed!';
        this.elements.options.innerHTML = `
            <button class="quiz-option" id="restart-quiz">Restart Quiz</button>
        `;
        document.getElementById('restart-quiz').addEventListener('click', () => this.start());
    }
}

// Code Playground
class CodePlayground {
    constructor() {
        this.codeTemplates = {
            class: `class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(\`Hello, my name is \${this.name}.\`);
    }
}

const person = new Person("Alice", 30);
person.greet();`,
            constructor: `function Car(brand, year) {
    this.brand = brand;
    this.year = year;

    this.getAge = function() {
        return new Date().getFullYear() - this.year;
    };
}

const myCar = new Car("Toyota", 2015);
console.log(myCar.getAge());`,
            inheritance: `class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(\`\${this.name} makes a sound.\`);
    }
}

class Dog extends Animal {
    speak() {
        console.log(\`\${this.name} barks.\`);
    }
}

const dog = new Dog("Buddy");
dog.speak();`,
            composition: `const canFly = {
    fly() {
        console.log(\`\${this.name} is flying!\`);
    }
};

class Bird {
    constructor(name) {
        this.name = name;
    }
}

Object.assign(Bird.prototype, canFly);

const eagle = new Bird("Eagle");
eagle.fly();`
        };

        this.elements = {
            codeInput: document.getElementById('code-input'),
            runButton: document.getElementById('run-code'),
            console: document.getElementById('code-console'),
            templateSelect: document.getElementById('playground-template')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Load template on change
        this.elements.templateSelect.addEventListener('change', (e) => {
            this.loadTemplate(e.target.value);
        });

        // Run code
        this.elements.runButton.addEventListener('click', () => {
            this.runCode();
        });

        // Initial template load
        this.loadTemplate('class');
    }

    loadTemplate(templateName) {
        this.elements.codeInput.value = this.codeTemplates[templateName];
    }

    runCode() {
        // Clear previous console
        this.elements.console.textContent = '';

        // Capture console.log
        const originalLog = console.log;
        const logOutput = [];

        console.log = (...args) => {
            logOutput.push(args.map(String).join(' '));
            originalLog(...args);
        };

        try {
            // Use eval to run the code (with caution)
            const result = eval(this.elements.codeInput.value);
            
            // Display console output
            this.elements.console.textContent = logOutput.join('\n');

            // Restore original console.log
            console.log = originalLog;
        } catch (error) {
            // Handle and display errors
            this.elements.console.textContent = `Error: ${error.message}`;
            
            // Restore original console.log
            console.log = originalLog;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quiz
    const quiz = new OOPQuiz();
    document.querySelector('.quiz-option').addEventListener('click', () => quiz.start());

    // Initialize Code Playground
    const playground = new CodePlayground();
});

// Add to your existing JavaScript file or create a new one

document.addEventListener('DOMContentLoaded', () => {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    // Add hover effect
    videoWrapper.addEventListener('mouseenter', () => {
        videoWrapper.style.transform = 'scale(1.02)';
    });

    videoWrapper.addEventListener('mouseleave', () => {
        videoWrapper.style.transform = 'scale(1)';
    });
});