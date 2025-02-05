// Math Module
const mathModule = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

// Dynamic Import Example
document.getElementById('loadModule')?.addEventListener('click', async () => {
    const dynamicResult = document.getElementById('dynamicResult');
    try {
        const module = await import('./dynamic-module.js');
        dynamicResult.textContent = module.showMessage();
    } catch (error) {
        dynamicResult.textContent = 'Error loading module';
    }
});

// Interactive Math Exercise
window.performMath = function(operation) {
    const num1 = parseInt(document.getElementById('num1').value);
    const num2 = parseInt(document.getElementById('num2').value);
    const mathResult = document.getElementById('mathResult');

    if (isNaN(num1) || isNaN(num2)) {
        mathResult.textContent = 'Please enter valid numbers';
        return;
    }

    switch(operation) {
        case 'add':
            mathResult.textContent = `Result: ${mathModule.add(num1, num2)}`;
            break;
        case 'subtract':
            mathResult.textContent = `Result: ${mathModule.subtract(num1, num2)}`;
            break;
    }
};

// Optional: Dynamic Module
export function showMessage() {
    return "Dynamic Module Loaded Successfully!";
}

// Modules for Interactive Activities

// 1. ES6 Modules Exercise
const MathModule = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

// Preview code for math module
document.getElementById('math-module-preview').innerHTML = `
<pre><code>
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Usage
import { add, subtract } from './math.js';
console.log(add(5, 3));      // Output: 8
console.log(subtract(7, 2)); // Output: 5
</code></pre>
`;

// Math Operation Function
window.performMathOperation = function(operation) {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const resultDisplay = document.getElementById('math-result');

    if (isNaN(num1) || isNaN(num2)) {
        resultDisplay.innerHTML = '<span class="error">Please enter valid numbers</span>';
        return;
    }

    let result;
    switch(operation) {
        case 'add':
            result = MathModule.add(num1, num2);
            resultDisplay.innerHTML = `Result: ${num1} + ${num2} = <strong>${result}</strong>`;
            break;
        case 'subtract':
            result = MathModule.subtract(num1, num2);
            resultDisplay.innerHTML = `Result: ${num1} - ${num2} = <strong>${result}</strong>`;
            break;
    }
};

// 2. Dynamic Import Exercise
document.getElementById('dynamic-module-preview').innerHTML = `
<pre><code>
// dynamic.js
export function showMessage() {
  return "Dynamic Module Loaded Successfully!";
}

// index.js
document.getElementById('loadButton')
  .addEventListener('click', async () => {
    const module = await import('./dynamic.js');
    module.showMessage();
  });
</code></pre>
`;

document.getElementById('load-dynamic-module').addEventListener('click', async () => {
    const resultDisplay = document.getElementById('dynamic-module-result');
    try {
        // Simulate dynamic module loading
        const dynamicModule = {
            showMessage: () => "Dynamic Module Loaded Successfully!"
        };
        const message = dynamicModule.showMessage();
        resultDisplay.innerHTML = `<strong>${message}</strong>`;
    } catch (error) {
        resultDisplay.innerHTML = `<span class="error">Error loading module: ${error.message}</span>`;
    }
});

// 3. Webpack Bundling Simulation
document.getElementById('webpack-module-preview').innerHTML = `
<pre><code>
// src/index.js
import { greet } from "./greet.js";
console.log(greet("Alice"));

// src/greet.js
export function greet(name) {
  return \`Hello, \${name}!\`;
}

// webpack.config.js
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
};
</code></pre>
`;

window.simulateWebpackBundling = function() {
    const resultDisplay = document.getElementById('webpack-result');
    
    // Simulate module bundling
    const greetModule = {
        greet: (name) => `Hello, ${name}!`
    };

    const bundledResult = greetModule.greet("Alice");
    
    resultDisplay.innerHTML = `
        <strong>Bundling Simulation Result:</strong>
        <p>Bundled Output: ${bundledResult}</p>
        <p>✅ Modules Combined Successfully!</p>
    `;
};

// Video Tutorials Functionality
const videoTutorials = {
    'es6-modules': {
        title: 'JavaScript Modules - Import & Export',
        embedUrl: 'https://www.youtube.com/embed/cRHQC7sZR7M'
    },
    'dynamic-imports': {
        title: 'Dynamic Imports in JavaScript',
        embedUrl: 'https://www.youtube.com/embed/PHKaJlAQQYU'
    },
    'webpack-basics': {
        title: 'Webpack 5 Crash Course',
        embedUrl: 'https://www.youtube.com/embed/MpGLUVbqsVE'
    },
    'tree-shaking': {
        title: 'Tree Shaking & Code Splitting Explained',
        embedUrl: 'https://www.youtube.com/embed/28XKxLPj0Rk'
    },
    'bundler-comparison': {
        title: 'Webpack vs Rollup - Which One to Use?',
        embedUrl: 'https://www.youtube.com/embed/uE4AHlmXfKo'
    }
};

// Function to open video tutorial modal
window.openVideoTutorial = function(tutorialKey) {
    const modal = document.getElementById('video-modal');
    const videoContainer = document.getElementById('video-container');
    const tutorial = videoTutorials[tutorialKey];

    if (tutorial) {
        videoContainer.innerHTML = `
            <h2>${tutorial.title}</h2>
            <iframe 
                width="100%" 
                height="450" 
                src="${tutorial.embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        modal.style.display = 'block';
    }
};

// Close modal when clicking on close button
document.querySelector('.close-btn').addEventListener('click', function() {
    const modal = document.getElementById('video-modal');
    const videoContainer = document.getElementById('video-container');
    modal.style.display = 'none';
    videoContainer.innerHTML = ''; // Clear video content
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('video-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
        document.getElementById('video-container').innerHTML = '';
    }
});