document.addEventListener('DOMContentLoaded', () => {
    const practiceArea = document.getElementById('practice-area');
    
    // Create interactive practice elements
    const createPracticeExercise = () => {
        const exerciseHTML = `
            <h3>Practice: Apply CSS Styles</h3>
            <div id="example-element" class="practice-element">
                Modify my style using CSS!
            </div>
            <div class="controls">
                <label>Text Color:
                    <input type="color" id="color-picker">
                </label>
                <label>Background Color:
                    <input type="color" id="bg-color-picker">
                </label>
                <label>Font Size:
                    <input type="range" id="font-size" min="10" max="30" value="16">
                    <span id="font-size-value">16px</span>
                </label>
                <label>Padding:
                    <input type="range" id="padding" min="0" max="30" value="10">
                    <span id="padding-value">10px</span>
                </label>
                <label>Border:
                    <input type="range" id="border-width" min="0" max="10" value="2">
                    <select id="border-style">
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                    <input type="color" id="border-color">
                </label>
            </div>
            <div class="result-code">
                <h4>Generated CSS:</h4>
                <pre><code id="css-result">
.practice-element {
    color: #000000;
    background-color: #ffffff;
    font-size: 16px;
    padding: 10px;
    border: 2px solid #000000;
}
                </code></pre>
                <button id="copy-css">Copy CSS</button>
            </div>
        `;
        
        practiceArea.innerHTML = exerciseHTML;
        
        const exampleElement = document.getElementById('example-element');
        const colorPicker = document.getElementById('color-picker');
        const bgColorPicker = document.getElementById('bg-color-picker');
        const fontSizePicker = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        const paddingPicker = document.getElementById('padding');
        const paddingValue = document.getElementById('padding-value');
        const borderWidthPicker = document.getElementById('border-width');
        const borderStylePicker = document.getElementById('border-style');
        const borderColorPicker = document.getElementById('border-color');
        const cssResult = document.getElementById('css-result');
        const copyButton = document.getElementById('copy-css');
        
        // Default to black and white
        colorPicker.value = '#000000';
        bgColorPicker.value = '#ffffff';
        borderColorPicker.value = '#000000';
        
        const updateStyles = () => {
            const color = colorPicker.value;
            const bgColor = bgColorPicker.value;
            const fontSize = fontSizePicker.value;
            const padding = paddingPicker.value;
            const borderWidth = borderWidthPicker.value;
            const borderStyle = borderStylePicker.value;
            const borderColor = borderColorPicker.value;
            
            // Update element styles
            exampleElement.style.color = color;
            exampleElement.style.backgroundColor = bgColor;
            exampleElement.style.fontSize = `${fontSize}px`;
            exampleElement.style.padding = `${padding}px`;
            exampleElement.style.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
            
            // Update font size display
            fontSizeValue.textContent = `${fontSize}px`;
            paddingValue.textContent = `${padding}px`;
            
            // Update CSS result
            const cssCode = `.practice-element {
    color: ${color};
    background-color: ${bgColor};
    font-size: ${fontSize}px;
    padding: ${padding}px;
    border: ${borderWidth}px ${borderStyle} ${borderColor};
}`;
            cssResult.textContent = cssCode;
        };
        
        // Add event listeners
        colorPicker.addEventListener('input', updateStyles);
        bgColorPicker.addEventListener('input', updateStyles);
        fontSizePicker.addEventListener('input', updateStyles);
        paddingPicker.addEventListener('input', updateStyles);
        borderWidthPicker.addEventListener('input', updateStyles);
        borderStylePicker.addEventListener('change', updateStyles);
        borderColorPicker.addEventListener('input', updateStyles);
        
        // Copy CSS functionality
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(cssResult.textContent).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy CSS';
                }, 2000);
            });
        });
        
        // Initial update
        updateStyles();
    };
    
    createPracticeExercise();
});