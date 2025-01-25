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
            routingLab: false,
            securityLab: false,
            monitoringLab: false,
            automationLab: false
        }
    };

    // Network Tools Simulator
    const NetworkTools = {
        // Advanced Routing Simulation
        async configureRouter(config) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        interfaces: config.interfaces.map(iface => ({
                            name: iface.name,
                            ip: iface.ip,
                            status: 'up',
                            protocol: iface.protocol || 'OSPF'
                        }))
                    });
                }, 1500);
            });
        },

        // VLAN Management
        async configureVLAN(vlanConfig) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        vlanId: vlanConfig.id,
                        name: vlanConfig.name,
                        ports: vlanConfig.ports,
                        status: 'active'
                    });
                }, 1000);
            });
        },

        // Security Tools
        async configureACL(aclConfig) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        aclId: aclConfig.id,
                        rules: aclConfig.rules,
                        applied: true,
                        status: 'enforcing'
                    });
                }, 1000);
            });
        },

        // Network Monitoring
        async monitorNetwork() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        cpu: Math.floor(Math.random() * 100),
                        memory: Math.floor(Math.random() * 100),
                        bandwidth: {
                            in: Math.floor(Math.random() * 1000),
                            out: Math.floor(Math.random() * 1000)
                        },
                        errors: Math.floor(Math.random() * 10),
                        uptime: '99.9%'
                    });
                }, 800);
            });
        },

        // Network Automation
        async executeAutomationScript(script) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        executed: true,
                        output: `Executed ${script.name} successfully`,
                        affectedDevices: script.targets,
                        status: 'completed'
                    });
                }, 2000);
            });
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

        createNetworkDiagram(type, data) {
            const diagram = document.createElement('div');
            diagram.className = 'network-diagram';
            diagram.innerHTML = `
                <h3>${type} Network Diagram</h3>
                <div class="diagram-container" id="diagram-${type.toLowerCase()}">
                    <!-- Network diagram will be rendered here -->
                </div>
                <div class="diagram-controls">
                    <button class="btn btn-secondary">Zoom In</button>
                    <button class="btn btn-secondary">Zoom Out</button>
                    <button class="btn btn-secondary">Reset</button>
                    <button class="btn btn-primary">Simulate</button>
                </div>
            `;
            return diagram;
        },

        createMonitoringDashboard() {
            const dashboard = document.createElement('div');
            dashboard.className = 'monitoring-dashboard';
            dashboard.innerHTML = `
                <div class="dashboard-grid">
                    <div class="metric-card">
                        <h4>CPU Usage</h4>
                        <div class="metric-value" id="cpu-usage">0%</div>
                        <canvas class="metric-chart"></canvas>
                    </div>
                    <div class="metric-card">
                        <h4>Memory Usage</h4>
                        <div class="metric-value" id="memory-usage">0%</div>
                        <canvas class="metric-chart"></canvas>
                    </div>
                    <div class="metric-card">
                        <h4>Network Bandwidth</h4>
                        <div class="metric-value" id="bandwidth">0 Mbps</div>
                        <canvas class="metric-chart"></canvas>
                    </div>
                    <div class="metric-card">
                        <h4>Error Rate</h4>
                        <div class="metric-value" id="error-rate">0</div>
                        <canvas class="metric-chart"></canvas>
                    </div>
                </div>
                <div class="dashboard-controls">
                    <button class="btn btn-primary" id="start-monitoring">Start Monitoring</button>
                    <button class="btn btn-secondary" id="export-data">Export Data</button>
                </div>
            `;
            return dashboard;
        },

        createAutomationConsole() {
            const console = document.createElement('div');
            console.className = 'automation-console';
            console.innerHTML = `
                <div class="console-header">
                    <h3>Network Automation Console</h3>
                    <div class="console-tabs">
                        <button class="tab active" data-tab="python">Python</button>
                        <button class="tab" data-tab="ansible">Ansible</button>
                        <button class="tab" data-tab="api">API</button>
                    </div>
                </div>
                <div class="console-editor" id="code-editor"></div>
                <div class="console-output">
                    <div class="output-header">Output</div>
                    <div class="output-content"></div>
                </div>
                <div class="console-controls">
                    <button class="btn btn-primary" id="run-automation">Run</button>
                    <button class="btn btn-secondary" id="save-script">Save</button>
                    <button class="btn btn-secondary" id="load-script">Load</button>
                </div>
            `;
            return console;
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
        }
    };

    // Content Manager
    const ContentManager = {
        async loadContent(contentId) {
            try {
                const content = await this.fetchContent(contentId);
                await this.renderContent(content);
                this.initializeInteractiveElements(contentId);
                this.updateProgress(contentId);
            } catch (error) {
                console.error('Error loading content:', error);
                UIController.showNotification('Failed to load content', 'error');
            }
        },

        async fetchContent(contentId) {
            // Simulate API call
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
                'routing-protocols': 'Dynamic Routing Protocols',
                'vlan-management': 'VLAN Configuration & Management',
                'network-security': 'Advanced Network Security',
                'monitoring-setup': 'Network Monitoring Setup',
                // Add more titles as needed
            };
            return titles[contentId] || 'Network Administration Content';
        },

        async renderContent(content) {
            const contentArea = document.querySelector('.content-area');
            if (!contentArea) return;

            contentArea.innerHTML = `
                <div class="content-header">
                    <h2>${content.title}</h2>
                </div>
                <div class="content-body">
                    ${content.theory}
                    ${content.practical}
                </div>
            `;
        },

        initializeInteractiveElements(contentId) {
            switch(contentId) {
                case 'routing-protocols':
                    this.initializeRoutingSimulator();
                    break;
                case 'vlan-management':
                    this.initializeVLANManager();
                    break;
                case 'network-monitoring':
                    this.initializeMonitoringDashboard();
                    break;
                case 'automation':
                    this.initializeAutomationConsole();
                    break;
            }
        },

        async initializeRoutingSimulator() {
            const simulator = document.createElement('div');
            simulator.className = 'routing-simulator';
            // Add routing simulator implementation
        },

        async initializeVLANManager() {
            const manager = document.createElement('div');
            manager.className = 'vlan-manager';
            // Add VLAN manager implementation
        },

        async initializeMonitoringDashboard() {
            const dashboard = UIController.createMonitoringDashboard();
            document.querySelector('.practical-content').appendChild(dashboard);

            let monitoring = false;
            const startButton = dashboard.querySelector('#start-monitoring');
            
            startButton.addEventListener('click', async () => {
                monitoring = !monitoring;
                startButton.textContent = monitoring ? 'Stop Monitoring' : 'Start Monitoring';
                
                if (monitoring) {
                    this.startMonitoring(dashboard);
                }
            });
        },

        async startMonitoring(dashboard) {
            const updateMetrics = async () => {
                const metrics = await NetworkTools.monitorNetwork();
                
                dashboard.querySelector('#cpu-usage').textContent = `${metrics.cpu}%`;
                dashboard.querySelector('#memory-usage').textContent = `${metrics.memory}%`;
                dashboard.querySelector('#bandwidth').textContent = 
                    `${metrics.bandwidth.in}/${metrics.bandwidth.out} Mbps`;
                dashboard.querySelector('#error-rate').textContent = metrics.errors;
                
                // Update charts here if implemented
            };

            const interval = setInterval(updateMetrics, 2000);
            dashboard.setAttribute('data-interval', interval);
        },

        initializeAutomationConsole() {
            const console = UIController.createAutomationConsole();
            document.querySelector('.practical-content').appendChild(console);
            
            // Initialize code editor (could use Monaco Editor or similar)
            // Add event listeners for automation controls
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
                    const content = activeHeader.nextElementSibling;
                    if (content) content.style.display = 'none';
                }
            });

            // Toggle clicked section
            header.classList.toggle('active', !wasActive);
            const content = header.nextElementSibling;
            if (content) {
                content.style.display = !wasActive ? 'block' : 'none';
            }
        },

        async handleNavigation(e, link) {
            e.preventDefault();
            
            document.querySelectorAll('.section-content a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            courseState.currentContent = link.getAttribute('data-content');
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
            const saved = localStorage.getItem('netadIntermediateProgress');
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
            
            localStorage.setItem('netadIntermediateProgress', JSON.stringify(progress));
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
