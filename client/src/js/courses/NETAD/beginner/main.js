document.addEventListener('DOMContentLoaded', function() {
    // Course State Management
    const courseState = {
        currentSection: null,
        currentContent: null,
        progress: {
            completedItems: 0,
            totalItems: document.querySelectorAll('.section-content a').length,
            lastAccessed: null
        },
        practicalLabs: {
            networkSetup: false,
            ipConfig: false,
            networkTools: false
        }
    };

    // Network Tools Simulator
    const NetworkTools = {
        ping: async function(host) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        roundTripTime: Math.floor(Math.random() * 50) + 10,
                        packetsTransmitted: 4,
                        packetsReceived: 4
                    });
                }, 1000);
            });
        },

        traceroute: async function(host) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        { hop: 1, ip: '192.168.1.1', time: '1ms' },
                        { hop: 2, ip: '10.0.0.1', time: '5ms' },
                        { hop: 3, ip: host, time: '15ms' }
                    ]);
                }, 2000);
            });
        },

        ipconfig: function() {
            return {
                ipAddress: '192.168.1.100',
                subnetMask: '255.255.255.0',
                defaultGateway: '192.168.1.1',
                dnsServers: ['8.8.8.8', '8.8.4.4']
            };
        }
    };

    // UI Controller
    const UIController = {
        elements: {
            sidebar: document.querySelector('.course-sidebar'),
            content: document.querySelector('.course-content'),
            progressBar: document.querySelector('.progress'),
            progressText: document.querySelector('.progress-text'),
            nextButton: document.querySelector('.btn-primary'),
            prevButton: document.querySelector('.btn-secondary')
        },

        createTerminal() {
            const terminal = document.createElement('div');
            terminal.className = 'command-terminal';
            terminal.innerHTML = `
                <div class="terminal-header">Network Command Terminal</div>
                <div class="terminal-output"></div>
                <div class="terminal-input">
                    <span class="prompt">$</span>
                    <input type="text" placeholder="Enter network command...">
                </div>
            `;
            return terminal;
        },

        createNetworkDiagram(type) {
            const diagram = document.createElement('div');
            diagram.className = 'network-diagram';
            diagram.innerHTML = `
                <h3>${type} Network Diagram</h3>
                <div class="diagram-container">
                    <!-- SVG or Canvas diagram would be inserted here -->
                </div>
                <div class="diagram-controls">
                    <button class="btn btn-secondary">Zoom In</button>
                    <button class="btn btn-secondary">Zoom Out</button>
                    <button class="btn btn-secondary">Reset</button>
                </div>
            `;
            return diagram;
        },

        showLoading() {
            const loader = document.createElement('div');
            loader.className = 'loading-overlay';
            loader.innerHTML = '<div class="loader">Loading...</div>';
            document.body.appendChild(loader);
        },

        hideLoading() {
            const loader = document.querySelector('.loading-overlay');
            if (loader) loader.remove();
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }, 100);
        },

        updateProgress() {
            if (this.elements.progressBar) {
                const percentage = (courseState.progress.completedItems / courseState.progress.totalItems) * 100;
                this.elements.progressBar.style.width = `${percentage}%`;
            }
            
            if (this.elements.progressText) {
                this.elements.progressText.textContent = 
                    `Progress: ${courseState.progress.completedItems}/${courseState.progress.totalItems} lessons completed`;
            }
        }
    };

    // Content Manager
    const ContentManager = {
        async loadContent(contentId) {
            UIController.showLoading();
            
            try {
                const content = await this.fetchContent(contentId);
                await this.renderContent(content);
                this.initializeInteractiveElements(contentId);
                
                // Track progress
                this.updateProgress(contentId);
            } catch (error) {
                console.error('Error loading content:', error);
                UIController.showNotification('Failed to load content', 'error');
            } finally {
                UIController.hideLoading();
            }
        },

        async fetchContent(contentId) {
            // Simulate API call (replace with actual endpoint)
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        title: this.getContentTitle(contentId),
                        theory: this.getTheoryContent(contentId),
                        practical: this.getPracticalContent(contentId)
                    });
                }, 800);
            });
        },

        getContentTitle(contentId) {
            const titles = {
                'networking-basics': 'Introduction to Computer Networks',
                'osi-model': 'The OSI Model Explained',
                'tcp-ip': 'TCP/IP Protocol Suite',
                // Add more titles as needed
            };
            return titles[contentId] || 'Network Administration Content';
        },

        getTheoryContent(contentId) {
            // Return specific theory content based on contentId
            return `<div class="theory-content">
                <h2>${this.getContentTitle(contentId)}</h2>
                <p>Theory content for ${contentId}...</p>
            </div>`;
        },

        getPracticalContent(contentId) {
            // Return practical exercises based on contentId
            return `<div class="practical-content">
                <h3>Practical Exercise</h3>
                <div class="exercise-container">
                    ${this.generateExercise(contentId)}
                </div>
            </div>`;
        },

        generateExercise(contentId) {
            switch(contentId) {
                case 'ip-addressing':
                    return this.createIPAddressingExercise();
                case 'subnetting':
                    return this.createSubnettingExercise();
                default:
                    return '';
            }
        },

        createIPAddressingExercise() {
            return `
                <div class="interactive-exercise">
                    <h4>IP Addressing Practice</h4>
                    <div class="exercise-input">
                        <input type="text" placeholder="Enter IP address">
                        <button class="btn btn-primary">Validate</button>
                    </div>
                    <div class="exercise-feedback"></div>
                </div>
            `;
        },

        createSubnettingExercise() {
            return `
                <div class="interactive-exercise">
                    <h4>Subnetting Calculator</h4>
                    <div class="subnet-calculator">
                        <input type="text" placeholder="Network address">
                        <input type="text" placeholder="Subnet mask">
                        <button class="btn btn-primary">Calculate</button>
                    </div>
                    <div class="calculation-results"></div>
                </div>
            `;
        },

        initializeInteractiveElements(contentId) {
            // Initialize specific interactive elements based on content
            if (contentId === 'network-tools') {
                this.initializeNetworkTools();
            } else if (contentId === 'ip-addressing') {
                this.initializeIPCalculator();
            }
        },

        initializeNetworkTools() {
            const terminal = UIController.createTerminal();
            document.querySelector('.practical-content').appendChild(terminal);
            
            const input = terminal.querySelector('input');
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    const command = input.value;
                    await this.executeNetworkCommand(command, terminal);
                    input.value = '';
                }
            });
        },

        async executeNetworkCommand(command, terminal) {
            const output = terminal.querySelector('.terminal-output');
            const commandParts = command.split(' ');
            
            switch(commandParts[0].toLowerCase()) {
                case 'ping':
                    if (commandParts[1]) {
                        const result = await NetworkTools.ping(commandParts[1]);
                        output.innerHTML += `<div>Pinging ${commandParts[1]}...</div>`;
                        output.innerHTML += `<div>Reply from ${commandParts[1]}: time=${result.roundTripTime}ms</div>`;
                    }
                    break;
                    
                case 'tracert':
                    if (commandParts[1]) {
                        const result = await NetworkTools.traceroute(commandParts[1]);
                        output.innerHTML += `<div>Tracing route to ${commandParts[1]}...</div>`;
                        result.forEach(hop => {
                            output.innerHTML += `<div>${hop.hop}  ${hop.ip}  ${hop.time}</div>`;
                        });
                    }
                    break;
                    
                case 'ipconfig':
                    const config = NetworkTools.ipconfig();
                    output.innerHTML += `<div>
                        IP Address: ${config.ipAddress}
                        Subnet Mask: ${config.subnetMask}
                        Default Gateway: ${config.defaultGateway}
                    </div>`;
                    break;
                    
                default:
                    output.innerHTML += `<div>Command not recognized: ${command}</div>`;
            }
            
            output.scrollTop = output.scrollHeight;
        },

        initializeIPCalculator() {
            const calculator = document.createElement('div');
            calculator.className = 'ip-calculator';
            // Add IP calculator implementation
        }
    };

    // Navigation Manager
    const NavigationManager = {
        init() {
            this.initializeSectionHeaders();
            this.initializeNavigationLinks();
            this.initializeNavigationButtons();
            this.initializeKeyboardNavigation();
        },

        initializeSectionHeaders() {
            document.querySelectorAll('.section-header').forEach(header => {
                header.addEventListener('click', () => this.toggleSection(header));
            });
        },

        initializeNavigationLinks() {
            document.querySelectorAll('.section-content a').forEach(link => {
                link.addEventListener('click', (e) => this.handleNavigation(e, link));
            });
        },

        initializeNavigationButtons() {
            if (UIController.elements.nextButton) {
                UIController.elements.nextButton.addEventListener('click', () => this.navigateContent('next'));
            }
            if (UIController.elements.prevButton) {
                UIController.elements.prevButton.addEventListener('click', () => this.navigateContent('prev'));
            }
        },

        initializeKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    this.navigateContent('next');
                } else if (e.key === 'ArrowLeft') {
                    this.navigateContent('prev');
                }
            });
        },

        toggleSection(header) {
            const wasActive = header.classList.contains('active');
            
            // Close all sections
            document.querySelectorAll('.section-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove('active');
                }
            });

            // Toggle clicked section
            header.classList.toggle('active', !wasActive);
        },

        async handleNavigation(e, link) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.section-content a').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update course state
            courseState.currentContent = link.getAttribute('data-content');
            
            // Load content
            await ContentManager.loadContent(courseState.currentContent);
        },

        navigateContent(direction) {
            const currentLink = document.querySelector('.section-content a.active');
            if (!currentLink) return;

            const links = Array.from(document.querySelectorAll('.section-content a'));
            const currentIndex = links.indexOf(currentLink);
            let nextIndex;

            if (direction === 'next') {
                nextIndex = currentIndex + 1;
            } else {
                nextIndex = currentIndex - 1;
            }

            if (nextIndex >= 0 && nextIndex < links.length) {
                links[nextIndex].click();
            }
        }
    };

    // Progress Manager
    const ProgressManager = {
        init() {
            this.loadProgress();
            window.addEventListener('beforeunload', () => this.saveProgress());
        },

        loadProgress() {
            const saved = localStorage.getItem('netadBeginnerProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                courseState.progress = progress;
                UIController.updateProgress();
                
                // Mark completed items
                document.querySelectorAll('.section-content a').forEach(link => {
                    const contentId = link.getAttribute('data-content');
                    if (progress.completedContent?.includes(contentId)) {
                        link.classList.add('completed');
                    }
                });

                // Restore last accessed content
                if (progress.lastAccessed) {
                    const lastLink = document.querySelector(`[data-content="${progress.lastAccessed}"]`);
                    if (lastLink) {
                        lastLink.click();
                    }
                }
            }
        },

        saveProgress() {
            const progress = {
                ...courseState.progress,
                lastAccessed: courseState.currentContent,
                completedContent: Array.from(document.querySelectorAll('.section-content a.completed'))
                    .map(link => link.getAttribute('data-content')),
                practicalLabs: courseState.practicalLabs
            };
            
            localStorage.setItem('netadBeginnerProgress', JSON.stringify(progress));
        }
    };

    // Initialize Course
    function initializeCourse() {
        NavigationManager.init();
        ProgressManager.init();

        // Start with first section if no progress
        if (!courseState.currentContent) {
            const firstLink = document.querySelector('.section-content a');
            if (firstLink) {
                firstLink.click();
            }
        }
    }

    // Start initialization
    initializeCourse();
});
