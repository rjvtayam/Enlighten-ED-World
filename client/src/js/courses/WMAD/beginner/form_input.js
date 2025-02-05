document.addEventListener('DOMContentLoaded', () => {
    // Video Playlist Functionality
    const videoPlayer = document.getElementById('formsVideo');
    const videoTitle = document.getElementById('currentVideoTitle');
    const playlistButtons = document.querySelectorAll('.playlist-btn');

    const videoPlaylist = {
        'qz0aGYrrlhU': 'HTML Forms Basics',
        'ysEN5RaKOlA': 'Advanced Form Validation',
        '3PHXvlpVIRk': 'Form Design Techniques'
    };

    playlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            playlistButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const videoId = button.dataset.video;
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
            videoTitle.textContent = videoPlaylist[videoId];
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Previous video playlist code remains the same...

    // Interactive Form Builder
    const inputTypeSelector = document.getElementById('inputTypeSelector');
    const addInputBtn = document.getElementById('addInputBtn');
    const dynamicFormPreview = document.getElementById('dynamicFormPreview');
    const codeDisplayArea = document.createElement('div');
    codeDisplayArea.classList.add('code-display-area');
    dynamicFormPreview.appendChild(codeDisplayArea);

    // Input Type Configurations
    const inputTypeConfigs = {
        'text': {
            label: 'Text Input',
            code: (id) => `&lt;input type="text" 
    id="${id}" 
    placeholder="Enter text"&gt;`,
            render: (id) => {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = id;
                input.placeholder = 'Enter text';
                return input;
            }
        },
        'email': {
            label: 'Email Input',
            code: (id) => `&lt;input type="email" 
    id="${id}" 
    placeholder="Enter email" 
    required&gt;`,
            render: (id) => {
                const input = document.createElement('input');
                input.type = 'email';
                input.id = id;
                input.placeholder = 'Enter email';
                input.required = true;
                return input;
            }
        },
        'number': {
            label: 'Number Input',
            code: (id) => `&lt;input type="number" 
    id="${id}" 
    min="0" 
    max="100" 
    placeholder="Enter number"&gt;`,
            render: (id) => {
                const input = document.createElement('input');
                input.type = 'number';
                input.id = id;
                input.min = '0';
                input.max = '100';
                input.placeholder = 'Enter number';
                return input;
            }
        },
        'date': {
            label: 'Date Input',
            code: (id) => `&lt;input type="date" 
    id="${id}"&gt;`,
            render: (id) => {
                const input = document.createElement('input');
                input.type = 'date';
                input.id = id;
                return input;
            }
        },
        'checkbox': {
            label: 'Checkbox Input',
            code: (id) => `&lt;div&gt;
    &lt;input type="checkbox" 
           id="${id}"&gt;
    &lt;label for="${id}"&gt;Checkbox Option&lt;/label&gt;
&lt;/div&gt;`,
            render: (id) => {
                const wrapper = document.createElement('div');
                const input = document.createElement('input');
                const label = document.createElement('label');
                
                input.type = 'checkbox';
                input.id = id;
                
                label.htmlFor = id;
                label.textContent = 'Checkbox Option';
                
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                return wrapper;
            }
        },
        'radio': {
            label: 'Radio Input',
            code: (id) => `&lt;div&gt;
    &lt;input type="radio" 
           name="radioGroup" 
           id="${id}"&gt;
    &lt;label for="${id}"&gt;Radio Option&lt;/label&gt;
&lt;/div&gt;`,
            render: (id) => {
                const wrapper = document.createElement('div');
                const input = document.createElement('input');
                const label = document.createElement('label');
                
                input.type = 'radio';
                input.name = 'radioGroup';
                input.id = id;
                
                label.htmlFor = id;
                label.textContent = 'Radio Option';
                
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                return wrapper;
            }
        }
    };

    // Update input type selector
    inputTypeSelector.innerHTML = `
        <option value="">Select Input Type</option>
        ${Object.keys(inputTypeConfigs).map(type => 
            `<option value="${type}">${inputTypeConfigs[type].label}</option>`
        ).join('')}
    `;

    addInputBtn.addEventListener('click', () => {
        const inputType = inputTypeSelector.value;
        if (!inputType) return;

        // Generate unique ID
        const uniqueId = `input-${Date.now()}`;

        // Create input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('dynamic-input-wrapper');

        // Get configuration for selected input type
        const config = inputTypeConfigs[inputType];

        // Create live input element
        const liveInput = config.render(uniqueId);

        // Create code display
        const codeDisplay = document.createElement('pre');
        codeDisplay.classList.add('input-code-display');
        codeDisplay.innerHTML = `<code>${config.code(uniqueId)}</code>`;

        // Create input preview container
        const previewContainer = document.createElement('div');
        previewContainer.classList.add('input-preview-container');

        // Create label for preview
        const previewLabel = document.createElement('h4');
        previewLabel.textContent = `${config.label} Preview:`;

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-input-btn');
        removeBtn.addEventListener('click', () => {
            inputWrapper.remove();
        });

        // Assemble the input wrapper
        previewContainer.appendChild(previewLabel);
        previewContainer.appendChild(liveInput);

        inputWrapper.appendChild(previewContainer);
        inputWrapper.appendChild(codeDisplay);
        inputWrapper.appendChild(removeBtn);

        // Add to dynamic form preview
        dynamicFormPreview.appendChild(inputWrapper);
    });
});