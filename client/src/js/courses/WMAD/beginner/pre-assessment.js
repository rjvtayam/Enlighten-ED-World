document.addEventListener('DOMContentLoaded', () => {
    // Function to shuffle array (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Combine all question categories into a single array
    const allQuestions = [
        // Web Basics (10 questions)
        {
            category: 'Web Basics',
            question: 'What does HTML stand for?',
            options: [
                'Hyper Text Markup Language',
                'High Tech Modern Language', 
                'Hyper Transfer Markup Language', 
                'Home Tool Markup Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.'
        },
        {
            category: 'Web Basics',
            question: 'Which of these is NOT a web browser?',
            options: ['Chrome', 'Firefox', 'Safari', 'Photoshop'],
            correctAnswer: 3,
            explanation: 'Photoshop is an image editing software, not a web browser.'
        },
        {
            category: 'Web Basics',
            question: 'What is a URL?',
            options: [
                'Universal Resource Locator', 
                'Universal Reference Link', 
                'Unified Resource Link', 
                'Unique Reference Locator'
            ],
            correctAnswer: 0,
            explanation: 'URL stands for Uniform Resource Locator, which is the address of a specific webpage or file on the Internet.'
        },
        {
            category: 'Web Basics',
            question: 'What does WWW stand for?',
            options: [
                'World Wide Web', 
                'World Wide Window', 
                'Web World Wide', 
                'Wide World Web'
            ],
            correctAnswer: 0,
            explanation: 'WWW stands for World Wide Web, a global system of interconnected documents and other resources.'
        },
        {
            category: 'Web Basics',
            question: 'What is the primary purpose of a web browser?',
            options: [
                'To create websites', 
                'To display web pages', 
                'To write code', 
                'To host websites'
            ],
            correctAnswer: 1,
            explanation: 'A web browser\'s main purpose is to retrieve and display web pages from web servers.'
        },
        {
            category: 'Web Basics',
            question: 'What is an IP address?',
            options: [
                'Internet Protocol address', 
                'Internal Positioning address', 
                'Internet Packet address', 
                'Internal Processing address'
            ],
            correctAnswer: 0,
            explanation: 'An IP address is a unique address that identifies a device on the internet or local network.'
        },
        {
            category: 'Web Basics',
            question: 'What is a domain name?',
            options: [
                'The physical address of a server', 
                'The website\'s human-readable name', 
                'The IP address of a website', 
                'The coding language of a website'
            ],
            correctAnswer: 1,
            explanation: 'A domain name is the human-readable name used to identify a website, like google.com.'
        },
        {
            category: 'Web Basics',
            question: 'What does HTTP stand for?',
            options: [
                'High Transfer Text Protocol', 
                'Hyper Text Transfer Protocol', 
                'High Text Transfer Protocol', 
                'Hyper Transfer Text Protocol'
            ],
            correctAnswer: 1,
            explanation: 'HTTP stands for Hyper Text Transfer Protocol, the foundation of data communication on the World Wide Web.'
        },
        {
            category: 'Web Basics',
            question: 'What is a web server?',
            options: [
                'A computer that hosts websites', 
                'A programming language', 
                'A type of web browser', 
                'A database system'
            ],
            correctAnswer: 0,
            explanation: 'A web server is a computer system that processes requests via HTTP and serves web pages to users.'
        },
        {
            category: 'Web Basics',
            question: 'What is the purpose of DNS?',
            options: [
                'Design Network System', 
                'Domain Name System', 
                'Digital Network Service', 
                'Dynamic Network Setup'
            ],
            correctAnswer: 1,
            explanation: 'DNS (Domain Name System) translates human-readable domain names to IP addresses.'
        },
        
        // HTML Fundamentals (10 questions)
        {
            category: 'HTML Fundamentals',
            question: 'What is the correct HTML tag for creating a paragraph?',
            options: ['<paragraph>', '<p>', '<text>', '<para>'],
            correctAnswer: 1,
            explanation: 'The <p> tag is used to define a paragraph in HTML.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which HTML tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<hyperlink>'],
            correctAnswer: 1,
            explanation: 'The <a> tag is used to create hyperlinks in HTML.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which semantic HTML elements represent a standalone section of content?',
            options: [
                'div, span, p', 
                'section, article, aside', 
                'header, footer, nav', 
                'main, body, head'
            ],
            correctAnswer: 1,
            explanation: 'section, article, and aside are semantic HTML5 elements that represent independent, self-contained content.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which attribute is used to define inline styles?',
            options: ['class', 'style', 'css', 'format'],
            correctAnswer: 1,
            explanation: 'The "style" attribute is used to define inline CSS styles directly in an HTML element.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which combination of attributes would make a form input most accessible?',
            options: [
                'type, value, class', 
                'name, id, placeholder', 
                'style, color, width', 
                'src, alt, href'
            ],
            correctAnswer: 1,
            explanation: 'An accessible form input requires a name (for form submission), id (for labels), and placeholder (for user guidance).'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which tag is used to create an ordered list?',
            options: ['<list>', '<ul>', '<ol>', '<li>'],
            correctAnswer: 2,
            explanation: 'The <ol> tag is used to create an ordered (numbered) list in HTML.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'What is the correct order of HTML document structure?',
            options: [
                'body, head, html', 
                'head, body, html', 
                'html, head, body', 
                'body, html, head'
            ],
            correctAnswer: 2,
            explanation: 'The correct HTML document structure is: html (root), then head (metadata), followed by body (visible content).'
        },
        {
            category: 'HTML Fundamentals',
            question: 'What is the correct HTML for creating a checkbox?',
            options: [
                '<input type="check">', 
                '<input type="checkbox">', 
                '<checkbox>', 
                '<input checkbox>'
            ],
            correctAnswer: 1,
            explanation: '<input type="checkbox"> creates a checkbox input in HTML forms.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which tag is used to define the most important heading?',
            options: ['<heading>', '<h6>', '<h1>', '<head>'],
            correctAnswer: 2,
            explanation: '<h1> is the most important heading tag in HTML, typically used for main page titles.'
        },
        {
            category: 'HTML Fundamentals',
            question: 'Which combination of HTML elements would create a navigation menu with three links?',
            options: [
                'div, a, span', 
                'nav, ul, li', 
                'menu, link, href', 
                'section, p, button'
            ],
            correctAnswer: 1,
            explanation: 'A semantic navigation menu typically uses the nav element, with an unordered list (ul) containing list items (li) that include hyperlinks.'
        },
        
        // CSS Basics (10 questions)
        {
            category: 'CSS Basics',
            question: 'What does CSS stand for?',
            options: [
                'Computer Style Sheets', 
                'Creative Style System', 
                'Cascading Style Sheets', 
                'Color Style Syntax'
            ],
            correctAnswer: 2,
            explanation: 'CSS stands for Cascading Style Sheets, used for describing the presentation of a document written in HTML.'
        },
        {
            category: 'CSS Basics',
            question: 'How do you select an element with id "demo" in CSS?',
            options: ['.demo', '#demo', 'demo', '*demo'],
            correctAnswer: 1,
            explanation: 'In CSS, you select an element with a specific id using the # symbol, like #demo.'
        },
        {
            category: 'CSS Basics',
            question: 'Which CSS property changes the text color?',
            options: ['text-color', 'font-color', 'color', 'text-style'],
            correctAnswer: 2,
            explanation: 'The "color" property is used to change the text color in CSS.'
        },
        {
            category: 'CSS Basics',
            question: 'What does the "margin" property do?',
            options: [
                'Adds space inside an element', 
                'Adds space outside an element', 
                'Changes element width', 
                'Changes element color'
            ],
            correctAnswer: 1,
            explanation: 'The margin property creates space around an element, outside of any defined borders.'
        },
        {
            category: 'CSS Basics',
            question: 'How do you make a background color for all <p> elements?',
            options: [
                'p.background-color', 
                'p {background-color: color;}', 
                '.p background-color', 
                '#p background-color'
            ],
            correctAnswer: 1,
            explanation: 'To set background color for all <p> elements, use p { background-color: color; } in CSS.'
        },
        {
            category: 'CSS Layout Problem Solving',
            question: 'What CSS technique would you use to center an element both horizontally and vertically?',
            options: [
                'text-align: center', 
                'margin: auto', 
                'flexbox with align-items and justify-content', 
                'position: absolute'
            ],
            correctAnswer: 2,
            explanation: 'Using flexbox with align-items: center and justify-content: center provides the most flexible way to center elements in both directions.'
        },
        {
            category: 'CSS Basics',
            question: 'Which CSS property is used for changing font?',
            options: ['font-style', 'text-font', 'font-family', 'change-font'],
            correctAnswer: 2,
            explanation: 'The "font-family" property is used to specify the font for text.'
        },
        {
            category: 'CSS Basics',
            question: 'What does "padding" do in CSS?',
            options: [
                'Adds space outside an element', 
                'Adds space inside an element', 
                'Changes element size', 
                'Removes element border'
            ],
            correctAnswer: 1,
            explanation: 'Padding adds space inside an element, between the content and the border.'
        },
        {
            category: 'CSS Problem Solving',
            question: 'Which CSS approach would create a responsive layout that adapts to different screen sizes?',
            options: [
                'Using fixed pixel widths', 
                'Using media queries and percentage widths', 
                'Using only max-width', 
                'Using static positioning'
            ],
            correctAnswer: 1,
            explanation: 'Media queries combined with percentage-based widths allow elements to adapt dynamically to different screen sizes.'
        },
        {
            category: 'CSS Basics',
            question: 'What is the CSS "box-sizing" property used for?',
            options: [
                'Changing box color', 
                'Defining how the total width and height of an element is calculated', 
                'Creating 3D boxes', 
                'Sizing text boxes'
            ],
            correctAnswer: 1,
            explanation: 'The box-sizing property defines how the total width and height of an element is calculated.'
        },
        
        // JavaScript Basics (10 questions)
        {
            category: 'JavaScript Basics',
            question: 'Which keyword is used to declare a variable in JavaScript?',
            options: ['var', 'variable', 'v', 'declare'],
            correctAnswer: 0,
            explanation: 'The "var" keyword is traditionally used to declare variables in JavaScript (though "let" and "const" are now preferred).'
        },
        {
            category: 'JavaScript Basics',
            question: 'What is the correct way to write a JavaScript comment?',
            options: ['// Comment', '/* Comment */', '-- Comment', '# Comment'],
            correctAnswer: 0,
            explanation: '// is used for single-line comments in JavaScript.'
        },
        {
            category: 'JavaScript Basics',
            question: 'Which method is used to print something in the console?',
            options: ['print()', 'console.log()', 'display()', 'show()'],
            correctAnswer: 1,
            explanation: 'console.log() is used to print messages to the browser\'s console for debugging.'
        },
        {
            category: 'JavaScript Basics',
            question: 'What is the result of 5 + "5" in JavaScript?',
            options: ['10', '55', 'Error', 'Undefined'],
            correctAnswer: 1,
            explanation: 'In JavaScript, when adding a number and a string, type coercion occurs, resulting in string concatenation.'
        },
        {
            category: 'JavaScript Basics',
            question: 'How do you declare a function in JavaScript?',
            options: [
                'function myFunction()', 
                'create myFunction()', 
                'def myFunction()', 
                'new function myFunction()'
            ],
            correctAnswer: 0,
            explanation: 'In JavaScript, functions are declared using the "function" keyword, followed by the function name and parentheses.'
        },
        {
            category: 'JavaScript Basics',
            question: 'What is an array in JavaScript?',
            options: [
                'A single value', 
                'A collection of values', 
                'A type of function', 
                'A mathematical operation'
            ],
            correctAnswer: 1,
            explanation: 'An array is a data structure that can store multiple values in a single variable.'
        },
        {
            category: 'JavaScript Basics',
            question: 'What does "===" mean in JavaScript?',
            options: [
                'Assigns a value', 
                'Compares value and type', 
                'Checks if greater', 
                'Multiplies'
            ],
            correctAnswer: 1,
            explanation: 'The === operator checks both value and type for equality in JavaScript.'
        },
        {
            category: 'JavaScript Basics',
            question: 'How do you create an object in JavaScript?',
            options: [
                'var obj = [];', 
                'var obj = ()', 
                'var obj = {}', 
                'var obj = <>'
            ],
            correctAnswer: 2,
            explanation: 'Objects in JavaScript are created using curly braces {}.'
        },
        {
            category: 'JavaScript Basics',
            question: 'What is an event in JavaScript?',
            options: [
                'A type of variable', 
                'An action or occurrence', 
                'A mathematical calculation', 
                'A function declaration'
            ],
            correctAnswer: 1,
            explanation: 'An event is an action or occurrence that happens in the browser, which JavaScript can detect and respond to.'
        },
        {
            category: 'JavaScript Basics',
            question: 'What does "NaN" stand for?',
            options: [
                'Not a Number', 
                'New and Numeric', 
                'Null and Numeric', 
                'No and None'
            ],
            correctAnswer: 0,
            explanation: 'NaN stands for "Not a Number", indicating an invalid number operation.'
        },
        
        // Web Design Concepts (10 questions)
        {
            category: 'Web Design Concepts',
            question: 'What is responsive web design?',
            options: [
                'Design that changes color', 
                'Design that works on multiple device sizes', 
                'Design with moving elements', 
                'Design with fancy animations'
            ],
            correctAnswer: 1,
            explanation: 'Responsive web design ensures websites look good and function well on all device sizes and screen resolutions.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is a wireframe?',
            options: [
                'A type of website', 
                'A basic visual guide representing the skeletal framework of a website', 
                'A coding technique', 
                'A design color palette'
            ],
            correctAnswer: 1,
            explanation: 'A wireframe is a basic visual guide that represents the skeletal framework of a website, showing layout and functionality.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What does UX stand for?',
            options: [
                'User Xenon', 
                'User Experience', 
                'Universal Xchange', 
                'User Extreme'
            ],
            correctAnswer: 1,
            explanation: 'UX stands for User Experience, focusing on the overall feel and usability of a website or application.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is a grid system in web design?',
            options: [
                'A type of website layout', 
                'A coding framework', 
                'A design tool for creating structured layouts', 
                'A color selection method'
            ],
            correctAnswer: 2,
            explanation: 'A grid system is a design tool that helps create structured, consistent layouts by dividing the page into columns and rows.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is the purpose of a sitemap?',
            options: [
                'To design website graphics', 
                'To show the structure of a website', 
                'To create website animations', 
                'To code website functionality'
            ],
            correctAnswer: 1,
            explanation: 'A sitemap shows the hierarchical structure of a website, helping both users and search engines navigate the site.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is color theory in web design?',
            options: [
                'A method of selecting website colors', 
                'A scientific approach to color selection', 
                'A guide to creating color harmonies', 
                'A technique for color mixing'
            ],
            correctAnswer: 2,
            explanation: 'Color theory in web design is a guide to creating harmonious and effective color combinations that evoke specific emotions and improve user experience.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is the "fold" in web design?',
            options: [
                'A design technique', 
                'The bottom of a webpage visible without scrolling', 
                'A coding method', 
                'A type of website layout'
            ],
            correctAnswer: 1,
            explanation: 'The "fold" refers to the bottom of a webpage visible without scrolling, considered prime real estate for important content.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is a call-to-action (CTA)?',
            options: [
                'A design element that prompts users to take a specific action', 
                'A type of website menu', 
                'A coding technique', 
                'A color selection method'
            ],
            correctAnswer: 0,
            explanation: 'A call-to-action (CTA) is a design element that prompts users to take a specific action, like "Sign Up" or "Learn More".'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is typography in web design?',
            options: [
                'A type of website layout', 
                'The art and technique of arranging type', 
                'A coding method', 
                'A color selection technique'
            ],
            correctAnswer: 1,
            explanation: 'Typography is the art and technique of arranging type to make written language readable and appealing.'
        },
        {
            category: 'Web Design Concepts',
            question: 'What is a mockup in web design?',
            options: [
                'A basic website sketch', 
                'A detailed visual representation of the final design', 
                'A coding prototype', 
                'A color palette'
            ],
            correctAnswer: 1,
            explanation: 'A mockup is a detailed visual representation of the final website design, showing colors, typography, and layout.'
        },
        
        // Problem Solving Code Questions
        {
            category: 'Problem Solving',
            question: 'What will be the output of this code?\n```javascript\nlet x = 5;\nlet y = "10";\nconsole.log(x + y);\n```',
            options: [
                '15', 
                '"510"', 
                'Error', 
                'NaN'
            ],
            correctAnswer: 1,
            explanation: 'In JavaScript, when you add a number and a string, type coercion occurs and the number is converted to a string, resulting in string concatenation.'
        },
        {
            category: 'Problem Solving',
            question: 'Which of the following correctly declares a constant in JavaScript?',
            options: [
                'constant x = 5', 
                'let x = 5', 
                'const x = 5', 
                'var x = 5'
            ],
            correctAnswer: 2,
            explanation: 'In modern JavaScript, `const` is used to declare a constant value that cannot be reassigned.'
        },
        {
            category: 'Problem Solving',
            question: 'What does this code do?\n```javascript\nfunction mystery(arr) {\n  return arr.filter(x => x % 2 === 0);\n}\n```',
            options: [
                'Finds the sum of even numbers', 
                'Removes odd numbers from an array', 
                'Multiplies all numbers by 2', 
                'Checks if all numbers are even'
            ],
            correctAnswer: 1,
            explanation: 'The `filter()` method creates a new array with all elements that pass the test implemented by the provided function. Here, it removes odd numbers.'
        },
        {
            category: 'Problem Solving',
            question: 'What will be the result of this comparison?\n```javascript\n5 === "5"\n```',
            options: [
                'true', 
                'false', 
                'undefined', 
                'Error'
            ],
            correctAnswer: 1,
            explanation: 'The strict equality operator `===` checks both value and type. Since 5 is a number and "5" is a string, this returns false.'
        },
        {
            category: 'Problem Solving',
            question: 'Which method creates a new array with the results of calling a function for every array element?',
            options: [
                'forEach()', 
                'map()', 
                'filter()', 
                'reduce()'
            ],
            correctAnswer: 1,
            explanation: 'The `map()` method creates a new array with the results of calling a provided function on every element in the calling array.'
        },
        {
            category: 'Problem Solving',
            question: 'What will this code return?\n```javascript\nlet arr = [1, 2, 3, 4, 5];\nlet result = arr.slice(1, 4);\n```',
            options: [
                '[1, 2, 3]', 
                '[2, 3, 4]', 
                '[1, 2, 3, 4]', 
                '[2, 3, 4, 5]'
            ],
            correctAnswer: 1,
            explanation: 'The `slice()` method returns a shallow copy of a portion of an array. Here, it returns elements from index 1 to 3 (not including index 4).'
        },
        {
            category: 'Problem Solving',
            question: 'What does the `Promise.all()` method do?',
            options: [
                'Cancels all promises', 
                'Waits for all promises to resolve', 
                'Resolves the first promise', 
                'Rejects all promises'
            ],
            correctAnswer: 1,
            explanation: '`Promise.all()` takes an array of promises and returns a promise that resolves when all of the promises in the array have resolved.'
        },
        {
            category: 'Problem Solving',
            question: 'What is the output of `typeof []`?',
            options: [
                '"array"', 
                '"object"', 
                '"undefined"', 
                '"null"'
            ],
            correctAnswer: 1,
            explanation: 'In JavaScript, `typeof []` returns "object". To check if something is an array, use `Array.isArray()`.'
        },
        {
            category: 'Problem Solving',
            question: 'Which method creates a new array with unique values?',
            options: [
                'unique()', 
                'distinct()', 
                'Set()', 
                'filter()'
            ],
            correctAnswer: 2,
            explanation: 'The `Set()` constructor lets you create a collection of unique values. You can convert it back to an array using `Array.from()` or spread syntax.'
        },
        {
            category: 'Problem Solving',
            question: 'What will be the output of this code?\n```javascript\nlet x = 5;\nlet y = "10";\nconsole.log(x + y);\n```',
            options: [
                '15', 
                '"510"', 
                'Error', 
                'NaN'
            ],
            correctAnswer: 1,
            explanation: 'In JavaScript, when you add a number and a string, type coercion occurs and the number is converted to a string, resulting in string concatenation.'
        },
        {
            category: 'Problem Solving',
            question: 'Which of the following correctly declares a constant in JavaScript?',
            options: [
                'constant x = 5', 
                'let x = 5', 
                'const x = 5', 
                'var x = 5'
            ],
            correctAnswer: 2,
            explanation: 'In modern JavaScript, `const` is used to declare a constant value that cannot be reassigned.'
        },
        {
            category: 'Problem Solving',
            question: 'What does this code do?\n```javascript\nfunction mystery(arr) {\n  return arr.filter(x => x % 2 === 0);\n}\n```',
            options: [
                'Finds the sum of even numbers', 
                'Removes odd numbers from an array', 
                'Multiplies all numbers by 2', 
                'Checks if all numbers are even'
            ],
            correctAnswer: 1,
            explanation: 'The `filter()` method creates a new array with all elements that pass the test implemented by the provided function. Here, it removes odd numbers.'
        },
        {
            category: 'Problem Solving',
            question: 'What will be the result of this comparison?\n```javascript\n5 === "5"\n```',
            options: [
                'true', 
                'false', 
                'undefined', 
                'Error'
            ],
            correctAnswer: 1,
            explanation: 'The strict equality operator `===` checks both value and type. Since 5 is a number and "5" is a string, this returns false.'
        },
        {
            category: 'Problem Solving',
            question: 'Which method creates a new array with the results of calling a function for every array element?',
            options: [
                'forEach()', 
                'map()', 
                'filter()', 
                'reduce()'
            ],
            correctAnswer: 1,
            explanation: 'The `map()` method creates a new array with the results of calling a provided function on every element in the calling array.'
        },
        {
            category: 'Problem Solving',
            question: 'What will this code return?\n```javascript\nlet arr = [1, 2, 3, 4, 5];\nlet result = arr.slice(1, 4);\n```',
            options: [
                '[1, 2, 3]', 
                '[2, 3, 4]', 
                '[1, 2, 3, 4]', 
                '[2, 3, 4, 5]'
            ],
            correctAnswer: 1,
            explanation: 'The `slice()` method returns a shallow copy of a portion of an array. Here, it returns elements from index 1 to 3 (not including index 4).'
        },
        {
            category: 'Problem Solving',
            question: 'What does the `Promise.all()` method do?',
            options: [
                'Cancels all promises', 
                'Waits for all promises to resolve', 
                'Resolves the first promise', 
                'Rejects all promises'
            ],
            correctAnswer: 1,
            explanation: '`Promise.all()` takes an array of promises and returns a promise that resolves when all of the promises in the array have resolved.'
        },
        {
            category: 'Problem Solving',
            question: 'What is the output of `typeof []`?',
            options: [
                '"array"', 
                '"object"', 
                '"undefined"', 
                '"null"'
            ],
            correctAnswer: 1,
            explanation: 'In JavaScript, `typeof []` returns "object". To check if something is an array, use `Array.isArray()`.'
        },
        {
            category: 'Problem Solving',
            question: 'Which method creates a new array with unique values?',
            options: [
                'unique()', 
                'distinct()', 
                'Set()', 
                'filter()'
            ],
            correctAnswer: 2,
            explanation: 'The `Set()` constructor lets you create a collection of unique values. You can convert it back to an array using `Array.from()` or spread syntax.'
        },
        {
            category: 'Problem Solving',
            question: 'What will this code output?\n```javascript\nlet obj = {a: 1, b: 2};\nlet {...rest} = obj;\nconsole.log(rest);\n```',
            options: [
                '{a: 1, b: 2}', 
                '{a: 1}', 
                '{b: 2}', 
                'Error'
            ],
            correctAnswer: 0,
            explanation: 'The spread operator `{...rest}` creates a new object with all properties from the original object.'
        },
        {
            category: 'Problem Solving',
            question: 'Which of these is NOT a way to declare a function in JavaScript?',
            options: [
                'function myFunc() {}', 
                'const myFunc = () => {}', 
                'let myFunc = function() {}', 
                'create myFunc() {}'
            ],
            correctAnswer: 3,
            explanation: 'The last option is not a valid function declaration in JavaScript. The others are valid function declaration methods.'
        },
        {
            category: 'Problem Solving',
            question: 'What does the `this` keyword refer to in an arrow function?',
            options: [
                'The global object', 
                'The object that called the function', 
                'The surrounding lexical scope', 
                'Undefined'
            ],
            correctAnswer: 2,
            explanation: 'Arrow functions do not have their own `this`. They inherit `this` from the enclosing scope.'
        },
        {
            category: 'Problem Solving',
            question: 'What will this code output?\n```javascript\nlet a = [1, 2, 3];\nlet b = a;\nb.push(4);\nconsole.log(a);\n```',
            options: [
                '[1, 2, 3]', 
                '[1, 2, 3, 4]', 
                'Error', 
                'Undefined'
            ],
            correctAnswer: 1,
            explanation: 'Arrays are reference types. When `b = a`, both variables point to the same array. Modifying `b` also modifies `a`.'
        },
        {
            category: 'Problem Solving',
            question: 'What is the purpose of the `try...catch` block?',
            options: [
                'To create a new variable', 
                'To handle potential errors', 
                'To loop through an array', 
                'To define a function'
            ],
            correctAnswer: 1,
            explanation: 'The `try...catch` block is used to handle potential errors in code execution, preventing the entire script from stopping.'
        },
        {
            category: 'Problem Solving',
            question: 'Which method returns the first element removed from an array?',
            options: [
                'pop()', 
                'shift()', 
                'unshift()', 
                'splice()'
            ],
            correctAnswer: 1,
            explanation: 'The `shift()` method removes the first element from an array and returns that removed element.'
        },
        {
            category: 'Problem Solving',
            question: 'What is the output of this code?\n```javascript\nconst numbers = [1, 2, 3, 4, 5];\nconst result = numbers.reduce((acc, curr) => acc + curr, 10);\nconsole.log(result);\n```',
            options: [
                '22', 
                '15', 
                '25', 
                '10'
            ],
            correctAnswer: 0,
            explanation: 'The `reduce()` method iterates through the array, adding each element to the accumulator. The initial value of 10 means the sum starts from 10, resulting in 10 + 1 + 2 + 3 + 4 + 5 = 22.'
        }
    ];

    // Function to prepare questions for assessment
    function prepareAssessmentQuestions(totalQuestions = 75) {
        // Create a deep copy of the original questions to preserve the original array
        let shuffledQuestions = JSON.parse(JSON.stringify(allQuestions));
        
        // Shuffle the entire array of questions
        shuffledQuestions = shuffleArray(shuffledQuestions);
        
        // Optional: Shuffle options for each question to add more randomness
        shuffledQuestions.forEach(question => {
            shuffleArray(question.options);
            
            // Adjust the correct answer index after shuffling options
            const originalCorrectAnswer = question.options[question.correctAnswer];
            question.correctAnswer = question.options.indexOf(originalCorrectAnswer);
        });
        
        return shuffledQuestions;
    }

    const assessmentContainer = document.getElementById("assessmentQuestions")
    const progressBar = document.getElementById("progressBar")
    const progressText = document.getElementById("progressText")
    const resultsSection = document.getElementById("resultsSection")
    const resultText = document.getElementById("resultText")
    const timerDisplay = document.getElementById("timeLeft")
    const retakeBtn = document.getElementById("retakeAssessmentBtn") // Moved retake button initialization here

    if (retakeBtn) {
        retakeBtn.addEventListener("click", () => {
            userAnswers = []
            currentQuestionIndex = 0
            timeLeft = totalTimeInSeconds
            resultsSection.style.display = "none"
            assessmentContainer.style.display = "block"
            submitBtn.style.display = "none"
            submitBtn.disabled = true
            renderQuestion(prepareAssessmentQuestions()[0])
        })
    }

    let currentQuestionIndex = 0
    let userAnswers = []
    let timer
    const totalTimeInMinutes = 30 // 30 minutes total
    const totalTimeInSeconds = totalTimeInMinutes * 60
    let timeLeft = totalTimeInSeconds
    const startTime = Date.now() // Add start time tracking

    // Create submit button
    const submitBtn = document.createElement("button")
    submitBtn.textContent = "Submit Assessment"
    submitBtn.classList.add("nav-btn")
    submitBtn.style.display = "none"
    submitBtn.addEventListener("click", calculateResults)

    // Add new function for showing time's up message
    function showTimesUpMessage() {
        clearInterval(timer) // Stop the timer
        const timesUpOverlay = document.createElement("div")
        timesUpOverlay.className = "times-up-overlay animate__animated animate__fadeIn"
        timesUpOverlay.innerHTML = `
            <div class="times-up-message">
                <i class="fas fa-clock"></i>
                <h2>Time's Up!</h2>
                <p>Your time has expired. Your answers will be submitted automatically.</p>
            </div>
        `
        document.body.appendChild(timesUpOverlay)

        setTimeout(() => {
            timesUpOverlay.remove()
            calculateResults()
        }, 3000)
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    function calculateTimeConsumed() {
        const timeConsumed = totalTimeInSeconds - timeLeft
        return formatTime(timeConsumed)
    }

    function startTimer() {
        clearInterval(timer) // Clear any existing timer
        updateTimerDisplay(timeLeft)

        timer = setInterval(() => {
            timeLeft--
            updateTimerDisplay(timeLeft)

            if (timeLeft <= 0) {
                clearInterval(timer)
                showTimesUpMessage()
            }
        }, 1000) // Real 1-second intervals
    }

    function updateTimerDisplay(seconds) {
        if (seconds < 0) seconds = 0 // Prevent negative time
        timerDisplay.textContent = formatTime(seconds)

        // Add warning classes when time is running low
        if (seconds <= 300) {
            // Last 5 minutes
            timerDisplay.classList.add("warning")
        }
        if (seconds <= 60) {
            // Last minute
            timerDisplay.classList.add("critical")
        }
    }

    function stopTimer() {
        clearInterval(timer)
    }

    function resetTimer() {
        clearInterval(timer)
        startTimer()
    }

    function renderQuestion(question) {
        const questionContainer = document.createElement("div")
        questionContainer.classList.add("question-container", "animate__animated", "animate__fadeIn")

        const questionCounter = document.createElement("p")
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${prepareAssessmentQuestions().length}`
        questionCounter.classList.add("question-counter")
        questionContainer.appendChild(questionCounter)

        const questionText = document.createElement("h3")
        questionText.innerHTML = `<i class="fas fa-question-circle"></i> ${question.question}`
        questionContainer.appendChild(questionText)

        const optionsContainer = document.createElement("div")
        optionsContainer.classList.add("options")

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement("button")
            optionBtn.classList.add("option-btn")
            optionBtn.textContent = option
            optionBtn.addEventListener("click", () => selectAnswer(index))

            if (userAnswers[currentQuestionIndex] === index) {
                optionBtn.classList.add("active")
            }

            optionsContainer.appendChild(optionBtn)
        })

        questionContainer.appendChild(optionsContainer)

        const navigationButtons = document.createElement("div")
        navigationButtons.classList.add("navigation-buttons")

        const prevBtn = document.createElement("button")
        prevBtn.textContent = "Previous"
        prevBtn.classList.add("nav-btn")
        prevBtn.disabled = currentQuestionIndex === 0
        prevBtn.addEventListener("click", () => navigateQuestion(-1))

        navigationButtons.appendChild(prevBtn)

        if (currentQuestionIndex < prepareAssessmentQuestions().length - 1) {
            const nextBtn = document.createElement("button")
            nextBtn.textContent = "Next"
            nextBtn.classList.add("nav-btn")
            nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined
            nextBtn.addEventListener("click", () => navigateQuestion(1))
            navigationButtons.appendChild(nextBtn)
        } else {
            // On last question, add the submit button
            navigationButtons.appendChild(submitBtn)
        }

        questionContainer.appendChild(navigationButtons)
        assessmentContainer.innerHTML = ""
        assessmentContainer.appendChild(questionContainer)

        updateProgress()
        startTimer()
    }

    function selectAnswer(selectedIndex) {
        userAnswers[currentQuestionIndex] = selectedIndex

        const options = document.querySelectorAll(".option-btn")
        options.forEach((option) => option.classList.remove("active"))
        options[selectedIndex].classList.add("active")

        const nextBtn = document.querySelector(".nav-btn:last-child")
        if (nextBtn && nextBtn.textContent === "Next") {
            nextBtn.disabled = false
        }

        checkAllQuestionsAnswered()
    }

    function navigateQuestion(direction) {
        currentQuestionIndex += direction
        if (currentQuestionIndex >= 0 && currentQuestionIndex < prepareAssessmentQuestions().length) {
            renderQuestion(prepareAssessmentQuestions()[currentQuestionIndex])
        }
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / prepareAssessmentQuestions().length) * 100
        progressBar.style.width = `${progress}%`
        progressBar.setAttribute("aria-valuenow", progress)
    }

    function checkAllQuestionsAnswered() {
        const allAnswered = userAnswers.length === prepareAssessmentQuestions().length && userAnswers.every((answer) => answer !== undefined)
        
        if (currentQuestionIndex === prepareAssessmentQuestions().length - 1) {
            submitBtn.style.display = "inline-block"
            submitBtn.disabled = !allAnswered
        } else {
            submitBtn.style.display = "none"
        }
    }

    function calculateResults() {
        stopTimer() // Stop the timer when showing results
        let correctAnswers = 0
        const incorrectQuestions = []

        prepareAssessmentQuestions().forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                correctAnswers++
            } else {
                incorrectQuestions.push({
                    question: question.question,
                    userAnswer: question.options[userAnswers[index]],
                    correctAnswer: question.options[question.correctAnswer],
                    explanation: question.explanation,
                })
            }
        })

        const scorePercentage = (correctAnswers / prepareAssessmentQuestions().length) * 100
        const timeConsumed = calculateTimeConsumed()

        const resultHTML = `
            <div class="results-grid animate__animated animate__fadeIn">
                <div class="score-section">
                    <h2>Assessment Complete!</h2>
                    <div class="score-circle">
                        <svg viewBox="0 0 36 36" class="circular-chart ${scorePercentage >= 70 ? "green" : "orange"}">
                            <path class="circle-bg" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="circle" stroke-dasharray="${scorePercentage}, 100" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="percentage">${scorePercentage.toFixed(0)}%</text>
                        </svg>
                    </div>
                    <div class="assessment-stats">
                        <div class="stat-item">
                            <i class="fas fa-tasks"></i>
                            <p>Total Questions: <strong>${prepareAssessmentQuestions().length}</strong></p>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-check-circle"></i>
                            <p>Correct Answers: <strong>${correctAnswers}</strong></p>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-hourglass-end"></i>
                            <p>Time Consumed: <strong>${timeConsumed}</strong></p>
                        </div>
                        ${
                          timeLeft > 0
                            ? `<div class="stat-item">
                               <i class="fas fa-clock"></i>
                               <p>Time Remaining: <strong>${formatTime(timeLeft)}</strong></p>
                             </div>`
                            : ""
                        }
                    </div>
                    <p class="assessment-message ${scorePercentage >= 70 ? "success" : "warning"}">
                        ${
                          scorePercentage >= 70
                            ? "<i class='fas fa-trophy'></i> Great job! You're ready to start the course."
                            : "<i class='fas fa-book'></i> You might want to review some basics before starting."
                        }
                    </p>
                </div>
                <div class="review-section">
                    <h3><i class="fas fa-check-circle"></i> Review Your Answers</h3>
                    <div class="incorrect-answers-list">
                        ${incorrectQuestions
                          .map(
                            (q, index) => `
                            <div class="incorrect-question animate__animated animate__fadeInRight" style="animation-delay: ${index * 0.1}s">
                                <p><strong>Q: ${q.question}</strong></p>
                                <p class="user-answer">
                                    <i class="fas fa-times text-red-500"></i> 
                                    Your Answer: <span class="text-red-500">${q.userAnswer || "Not answered"}</span>
                                </p>
                                <p class="correct-answer">
                                    <i class="fas fa-check text-green-500"></i> 
                                    Correct Answer: <span class="text-green-500">${q.correctAnswer}</span>
                                </p>
                                <p class="explanation">
                                    <i class="fas fa-info-circle text-blue-500"></i> 
                                    ${q.explanation || "No explanation available"}
                                </p>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `

        // Hide assessment questions
        assessmentContainer.style.display = "none"

        // Show results
        resultText.innerHTML = resultHTML
        resultsSection.style.display = "block"
    }

    // Start the assessment
    renderQuestion(prepareAssessmentQuestions()[0])
})