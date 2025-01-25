/**
 * Intermediate Web Development Course JavaScript
 * Handles interactive features for intermediate-level content
 */

class IntermediateCourseManager {
    constructor() {
        this.progressData = {
            completedLessons: 0,
            totalLessons: 25
        };
        
        this.codeEditors = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAdvancedEditors();
            this.setupAPIPlayground();
            this.initializeProgress();
        });
    }

    /**
     * Sets up advanced code editors with multiple language support
     */
    setupAdvancedEditors() {
        const editors = document.querySelectorAll('.intermediate-code-editor');
        editors.forEach(editor => {
            const language = editor.dataset.language;
            const editorInstance = this.createCodeEditor(editor, language);
            
            if (editor.dataset.preview) {
                this.setupLivePreview(editorInstance, editor.dataset.preview, language);
            }

            this.codeEditors.set(editor.id, editorInstance);
        });
    }

    /**
     * Creates a code editor with advanced features
     */
    createCodeEditor(element, language) {
        // Initialize with basic features
        const editor = {
            element,
            language,
            value: '',
            selections: [],
            history: [],
            
            // Editor methods
            setValue(code) {
                this.value = code;
                this.highlight();
            },
            
            highlight() {
                let highlighted = this.value;
                
                // Language-specific syntax highlighting
                switch (this.language) {
                    case 'javascript':
                        highlighted = this.highlightJavaScript(highlighted);
                        break;
                    case 'react':
                        highlighted = this.highlightReact(highlighted);
                        break;
                    case 'node':
                        highlighted = this.highlightNode(highlighted);
                        break;
                }
                
                this.element.innerHTML = highlighted;
            }
        };

        // Set up event listeners
        element.addEventListener('input', (e) => {
            editor.setValue(e.target.value);
        });

        return editor;
    }

    /**
     * Sets up the API testing playground
     */
    setupAPIPlayground() {
        const playground = document.querySelector('.api-playground');
        if (!playground) return;

        const sendButton = playground.querySelector('.send-request');
        const urlInput = playground.querySelector('.url-input');
        const methodSelect = playground.querySelector('.method-select');
        const headersInput = playground.querySelector('.headers-input');
        const bodyInput = playground.querySelector('.body-input');
        const responseArea = playground.querySelector('.response-area');

        sendButton?.addEventListener('click', async () => {
            try {
                const response = await this.sendAPIRequest({
                    url: urlInput.value,
                    method: methodSelect.value,
                    headers: this.parseHeaders(headersInput.value),
                    body: this.parseBody(bodyInput.value)
                });

                this.displayAPIResponse(response, responseArea);
            } catch (error) {
                this.handleAPIError(error, responseArea);
            }
        });
    }

    /**
     * Sends API requests from the playground
     */
    async sendAPIRequest({ url, method, headers, body }) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();
        
        return {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            data
        };
    }

    /**
     * Displays API response in the playground
     */
    displayAPIResponse(response, element) {
        element.innerHTML = `
            <div class="response-status ${response.status < 400 ? 'success' : 'error'}">
                Status: ${response.status}
            </div>
            <div class="response-headers">
                ${Object.entries(response.headers)
                    .map(([key, value]) => `<div>${key}: ${value}</div>`)
                    .join('')}
            </div>
            <pre class="response-body">${JSON.stringify(response.data, null, 2)}</pre>
        `;
    }

    /**
     * Handles API request errors
     */
    handleAPIError(error, element) {
        element.innerHTML = `
            <div class="response-status error">
                Error: ${error.message}
            </div>
            <div class="error-details">
                ${error.stack}
            </div>
        `;
    }

    /**
     * Parses headers from input
     */
    parseHeaders(headerString) {
        try {
            return headerString
                .split('\n')
                .filter(line => line.trim())
                .reduce((headers, line) => {
                    const [key, value] = line.split(':').map(s => s.trim());
                    headers[key] = value;
                    return headers;
                }, {});
        } catch (error) {
            console.error('Error parsing headers:', error);
            return {};
        }
    }

    /**
     * Parses JSON body from input
     */
    parseBody(bodyString) {
        try {
            return JSON.parse(bodyString);
        } catch (error) {
            console.error('Error parsing body:', error);
            return null;
        }
    }

    /**
     * Updates progress tracking
     */
    initializeProgress() {
        const progressElement = document.querySelector('.progress-indicator');
        if (progressElement) {
            this.updateProgressUI();
        }
    }

    updateProgressUI() {
        const { completedLessons, totalLessons } = this.progressData;
        const progressElement = document.querySelector('.progress-indicator');
        if (progressElement) {
            progressElement.querySelector('span').textContent = 
                `Progress: ${completedLessons}/${totalLessons} lessons completed`;
        }
    }

    /**
     * Saves progress to backend
     */
    async saveProgress() {
        try {
            const response = await fetch('/api/progress/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.progressData)
            });
            
            if (!response.ok) {
                console.error('Failed to save progress');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
}

// Initialize the course manager
const courseManager = new IntermediateCourseManager();
