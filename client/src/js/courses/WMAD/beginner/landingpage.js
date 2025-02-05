class InteractivePlayground {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.codeInput = document.getElementById('code-input');
        this.outputDisplayContainer = document.getElementById('output-display-container');
        this.outputDisplay = document.getElementById('output-display');
        this.runBtn = document.getElementById('run-btn');
        this.resetBtn = document.getElementById('reset-btn');
    }

    setupEventListeners() {
        // Add input event listener to show live preview
        this.codeInput.addEventListener('input', () => this.updateLivePreview());
        
        // Run button to explicitly run the code
        this.runBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default button behavior
            console.log('Run button clicked'); // Debugging log
            this.runCode();
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default button behavior
            this.resetPlayground();
        });
    }

    updateLivePreview() {
        // Get the input code
        const input = this.codeInput.value;
        console.log('Updating live preview', input); // Debugging log

        // Create a complete HTML document
        const fullHTML = this.createHTMLDocument(input);

        // Render the HTML in the iframe
        this.outputDisplay.srcdoc = fullHTML;
    }

    runCode() {
        console.log('Running code'); // Debugging log
        // When run button is clicked, ensure the latest code is displayed
        const input = this.codeInput.value;
        console.log('Input code:', input); // Debugging log

        // Create a complete HTML document
        const fullHTML = this.createHTMLDocument(input);
        console.log('Generated HTML:', fullHTML); // Debugging log

        // Render the HTML in the iframe
        this.outputDisplay.srcdoc = fullHTML;
    }

    createHTMLDocument(input) {
        // Create a complete HTML document
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                    }
                </style>
                ${this.extractCSSFromInput(input)}
            </head>
            <body>
                ${this.extractHTMLFromInput(input)}
            </body>
            </html>
        `;
    }

    extractHTMLFromInput(input) {
        // Extract HTML content, handling cases with or without <style> tag
        try {
            if (input.includes('</style>')) {
                return input.split('</style>')[1].trim();
            }
            // If no CSS block, return the entire input as HTML
            if (!input.includes('<style>')) {
                return input.trim();
            }
            // If there's a <style> tag, split and take content before it
            return input.split('<style>')[0].trim();
        } catch (error) {
            console.error('Error extracting HTML:', error);
            return 'Error in HTML extraction';
        }
    }

    extractCSSFromInput(input) {
        // Extract CSS content if present
        try {
            if (input.includes('<style>') && input.includes('</style>')) {
                return `<style>${input.split('<style>')[1].split('</style>')[0].trim()}</style>`;
            }
            return ''; // Return empty string if no CSS found
        } catch (error) {
            console.error('Error extracting CSS:', error);
            return '<style>/* Error in CSS extraction */</style>';
        }
    }

    resetPlayground() {
        this.codeInput.value = `<!-- Your HTML Code -->
<header>
    <h1>My Landing Page</h1>
    <nav>
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">Contact</a>
    </nav>
</header>

<main>
    <section id="hero">
        <h2>Welcome to My Product</h2>
        <p>A brief description of your amazing product or service.</p>
        <button>Get Started</button>
    </section>

    <section id="features">
        <h2>Our Features</h2>
        <div class="feature">
            <h3>Feature 1</h3>
            <p>Description of the first feature.</p>
        </div>
        <div class="feature">
            <h3>Feature 2</h3>
            <p>Description of the second feature.</p>
        </div>
    </section>
</main>

<footer>
    <p>© 2025 My Company. All rights reserved.</p>
</footer>

<style>
/* Your CSS Styles */
header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 20px; 
    background-color: #f4f4f4; 
}

nav a { 
    margin-left: 15px; 
    text-decoration: none; 
    color: #333; 
}

#hero { 
    text-align: center; 
    padding: 50px 0; 
    background-color: #e9e9e9; 
}

#features { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    padding: 50px 0; 
}

.feature { 
    text-align: center; 
    margin: 20px 0; 
    max-width: 500px; 
}

footer { 
    text-align: center; 
    padding: 20px; 
    background-color: #f4f4f4; 
}
</style>`;
        
        // Update the live preview
        this.updateLivePreview();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const playground = new InteractivePlayground();
    playground.resetPlayground(); // Set initial content
});

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
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                    }
                </style>
                ${extractCSSFromInput(input)}
            </head>
            <body>
                ${extractHTMLFromInput(input)}
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
        return htmlParts.length > 1 ? htmlParts[0].trim() : input.trim();
    }

    // Function to reset the playground
    function resetPlayground() {
        codeInput.value = `<!-- Your HTML Code -->
<header>
    <h1>My Landing Page</h1>
    <nav>
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">Contact</a>
    </nav>
</header>

<main>
    <section id="hero">
        <h2>Welcome to My Product</h2>
        <p>A brief description of your amazing product or service.</p>
        <button>Get Started</button>
    </section>

    <section id="features">
        <h2>Our Features</h2>
        <div class="feature">
            <h3>Feature 1</h3>
            <p>Description of the first feature.</p>
        </div>
        <div class="feature">
            <h3>Feature 2</h3>
            <p>Description of the second feature.</p>
        </div>
    </section>
</main>

<footer>
    <p>© 2025 My Company. All rights reserved.</p>
</footer>

<style>
/* Your CSS Styles */
header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 20px; 
    background-color: #f4f4f4; 
}

nav a { 
    margin-left: 15px; 
    text-decoration: none; 
    color: #333; 
}

#hero { 
    text-align: center; 
    padding: 50px 0; 
    background-color: #e9e9e9; 
}

#features { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    padding: 50px 0; 
}

.feature { 
    text-align: center; 
    margin: 20px 0; 
    max-width: 500px; 
}

footer { 
    text-align: center; 
    padding: 20px; 
    background-color: #f4f4f4; 
}
</style>`;

        // Clear the iframe
        outputDisplay.srcdoc = '';
    }

    // Add event listeners
    runBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent any default form submission
        runCode();
    });

    resetBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent any default form submission
        resetPlayground();
    });

    // Add live preview on input
    codeInput.addEventListener('input', function() {
        runCode();
    });

    // Initial reset to set up the playground
    resetPlayground();
});