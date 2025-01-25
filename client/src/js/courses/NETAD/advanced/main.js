document.addEventListener('DOMContentLoaded', function() {
    // Enterprise Course State Management
    const courseState = {
        currentSection: null,
        currentContent: null,
        progress: {
            completedItems: 0,
            totalItems: document.querySelectorAll('.section-content a').length,
            lastAccessed: null
        },
        enterpriseLabs: {
            networkDesign: false,
            securityAudit: false,
            disasterRecovery: false,
            automationPipeline: false
        },
        networkTopology: {
            devices: [],
            connections: [],
            virtualNetworks: [],
            securityZones: []
        }
    };

    // Enterprise Network Simulator
    const EnterpriseNetworkTools = {
        // Network Design and Architecture
        async deployNetwork(config) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        deploymentId: Math.random().toString(36).substr(2, 9),
                        topology: {
                            routers: config.routers,
                            switches: config.switches,
                            firewalls: config.firewalls,
                            endpoints: config.endpoints
                        },
                        status: 'deployed'
                    });
                }, 2000);
            });
        },

        // Security and Compliance
        async performSecurityAudit() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        vulnerabilities: [
                            { severity: 'high', type: 'open-ports', count: 3 },
                            { severity: 'medium', type: 'weak-ciphers', count: 5 },
                            { severity: 'low', type: 'outdated-software', count: 8 }
                        ],
                        compliance: {
                            pci: { status: 'passed', score: 95 },
                            hipaa: { status: 'warning', score: 87 },
                            gdpr: { status: 'passed', score: 92 }
                        },
                        recommendations: [
                            'Update firewall rules',
                            'Implement stronger encryption',
                            'Patch system vulnerabilities'
                        ]
                    });
                }, 3000);
            });
        },

        // Performance Monitoring
        async getEnterpriseMetrics() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        networkUtilization: {
                            bandwidth: Math.floor(Math.random() * 100),
                            latency: Math.floor(Math.random() * 50),
                            packetLoss: Math.random() * 0.5
                        },
                        security: {
                            threats: Math.floor(Math.random() * 10),
                            blockedAttacks: Math.floor(Math.random() * 100),
                            vulnerabilities: Math.floor(Math.random() * 20)
                        },
                        services: {
                            availability: 99.9 + Math.random() * 0.1,
                            responseTime: Math.floor(Math.random() * 200),
                            errorRate: Math.random() * 0.1
                        }
                    });
                }, 1000);
            });
        },

        // Disaster Recovery
        async testDisasterRecovery(scenario) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        scenarioName: scenario.name,
                        recoveryTime: Math.floor(Math.random() * 300),
                        dataLoss: Math.random() * 0.1,
                        serviceImpact: {
                            critical: Math.floor(Math.random() * 10),
                            moderate: Math.floor(Math.random() * 20),
                            low: Math.floor(Math.random() * 30)
                        },
                        success: Math.random() > 0.1
                    });
                }, 4000);
            });
        }
    };

    // Enterprise UI Controller
    const EnterpriseUIController = {
        elements: {
            sidebar: document.querySelector('.course-sidebar'),
            content: document.querySelector('.course-content'),
            progressBar: document.querySelector('.progress'),
            progressText: document.querySelector('.progress-text'),
            nextButton: document.querySelector('.btn-primary'),
            prevButton: document.querySelector('.btn-secondary')
        },

        createTopologyViewer() {
            const viewer = document.createElement('div');
            viewer.className = 'topology-viewer';
            viewer.innerHTML = `
                <div class="topology-controls">
                    <button class="btn btn-secondary">Zoom In</button>
                    <button class="btn btn-secondary">Zoom Out</button>
                    <button class="btn btn-secondary">Reset</button>
                    <button class="btn btn-primary">Auto Layout</button>
                </div>
                <div class="topology-layers">
                    <label><input type="checkbox" checked> Physical Network</label>
                    <label><input type="checkbox" checked> Virtual Networks</label>
                    <label><input type="checkbox" checked> Security Zones</label>
                    <label><input type="checkbox" checked> Traffic Flow</label>
                </div>
                <canvas id="topology-canvas"></canvas>
            `;
            return viewer;
        },

        createSecurityDashboard() {
            const dashboard = document.createElement('div');
            dashboard.className = 'security-dashboard';
            dashboard.innerHTML = `
                <div class="threat-map">
                    <canvas id="threat-map-canvas"></canvas>
                </div>
                <div class="security-alerts">
                    <h3>Security Alerts</h3>
                    <div class="alerts-container"></div>
                </div>
            `;
            return dashboard;
        },

        createPerformanceAnalytics() {
            const analytics = document.createElement('div');
            analytics.className = 'performance-analytics';
            analytics.innerHTML = `
                <div class="analytics-filters">
                    <select class="filter-select" id="time-range">
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <select class="filter-select" id="metric-type">
                        <option value="network">Network Performance</option>
                        <option value="security">Security Metrics</option>
                        <option value="services">Service Health</option>
                    </select>
                </div>
                <div class="analytics-grid">
                    <div class="analytics-chart">
                        <canvas id="performance-chart"></canvas>
                    </div>
                    <div class="analytics-metrics"></div>
                </div>
            `;
            return analytics;
        },

        createAutomationStudio() {
            const studio = document.createElement('div');
            studio.className = 'automation-studio';
            studio.innerHTML = `
                <div class="code-editor">
                    <div class="editor-header">
                        <div class="file-tabs">
                            <button class="tab active">main.py</button>
                            <button class="tab">config.yaml</button>
                            <button class="tab">deploy.sh</button>
                        </div>
                        <div class="editor-controls">
                            <button class="btn btn-primary">Run</button>
                            <button class="btn btn-secondary">Save</button>
                        </div>
                    </div>
                    <div class="editor-content" id="code-editor"></div>
                </div>
                <div class="automation-output">
                    <h3>Execution Output</h3>
                    <div class="output-content"></div>
                </div>
            `;
            return studio;
        },

        updateDashboard(metrics) {
            // Update network metrics
            document.querySelectorAll('.metric-card').forEach(card => {
                const metricType = card.getAttribute('data-metric');
                const value = this.getMetricValue(metrics, metricType);
                card.querySelector('.metric-value').textContent = value;
            });

            // Update charts if they exist
            this.updateCharts(metrics);
        },

        getMetricValue(metrics, type) {
            const paths = {
                bandwidth: 'networkUtilization.bandwidth',
                latency: 'networkUtilization.latency',
                threats: 'security.threats',
                availability: 'services.availability'
            };

            return paths[type].split('.').reduce((obj, key) => obj[key], metrics);
        },

        updateCharts(metrics) {
            // Implementation would depend on the charting library being used
            // (e.g., Chart.js, D3.js, etc.)
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

    // Enterprise Content Manager
    const EnterpriseContentManager = {
        async loadContent(contentId) {
            try {
                const content = await this.fetchContent(contentId);
                await this.renderContent(content);
                this.initializeEnterpriseFeatures(contentId);
                this.updateProgress(contentId);
            } catch (error) {
                console.error('Error loading content:', error);
                EnterpriseUIController.showNotification('Failed to load content', 'error');
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
                'enterprise-design': 'Enterprise Network Design',
                'security-audit': 'Security Audit and Compliance',
                'disaster-recovery': 'Disaster Recovery Planning',
                'automation-pipeline': 'Enterprise Automation Pipeline'
            };
            return titles[contentId] || 'Enterprise Network Administration';
        },

        async initializeEnterpriseFeatures(contentId) {
            switch(contentId) {
                case 'enterprise-design':
                    await this.initializeTopologyViewer();
                    break;
                case 'security-audit':
                    await this.initializeSecurityDashboard();
                    break;
                case 'performance-monitoring':
                    await this.initializePerformanceAnalytics();
                    break;
                case 'automation-pipeline':
                    await this.initializeAutomationStudio();
                    break;
            }
        },

        async initializeTopologyViewer() {
            const viewer = EnterpriseUIController.createTopologyViewer();
            document.querySelector('.practical-content').appendChild(viewer);
            
            // Initialize topology visualization
            // This would typically use a library like vis.js or cytoscape.js
        },

        async initializeSecurityDashboard() {
            const dashboard = EnterpriseUIController.createSecurityDashboard();
            document.querySelector('.practical-content').appendChild(dashboard);
            
            // Start security monitoring
            this.startSecurityMonitoring(dashboard);
        },

        async startSecurityMonitoring(dashboard) {
            const updateSecurity = async () => {
                const audit = await EnterpriseNetworkTools.performSecurityAudit();
                this.updateSecurityDashboard(dashboard, audit);
            };

            // Update every 30 seconds
            const interval = setInterval(updateSecurity, 30000);
            dashboard.setAttribute('data-interval', interval);
            
            // Initial update
            updateSecurity();
        },

        updateSecurityDashboard(dashboard, audit) {
            const alertsContainer = dashboard.querySelector('.alerts-container');
            
            // Clear existing alerts
            alertsContainer.innerHTML = '';
            
            // Add new alerts
            audit.vulnerabilities.forEach(vuln => {
                const alert = document.createElement('div');
                alert.className = `alert-item alert-${vuln.severity}`;
                alert.innerHTML = `
                    <h4>${vuln.type}</h4>
                    <p>Found ${vuln.count} instances</p>
                `;
                alertsContainer.appendChild(alert);
            });
        },

        async initializePerformanceAnalytics() {
            const analytics = EnterpriseUIController.createPerformanceAnalytics();
            document.querySelector('.practical-content').appendChild(analytics);
            
            // Initialize charts and start monitoring
            this.startPerformanceMonitoring(analytics);
        },

        async startPerformanceMonitoring(analytics) {
            const updateMetrics = async () => {
                const metrics = await EnterpriseNetworkTools.getEnterpriseMetrics();
                EnterpriseUIController.updateDashboard(metrics);
            };

            // Update every 5 seconds
            const interval = setInterval(updateMetrics, 5000);
            analytics.setAttribute('data-interval', interval);
            
            // Initial update
            updateMetrics();
        },

        initializeAutomationStudio() {
            const studio = EnterpriseUIController.createAutomationStudio();
            document.querySelector('.practical-content').appendChild(studio);
            
            // Initialize code editor
            // This would typically use Monaco Editor or CodeMirror
        }
    };

    // Progress Manager
    const ProgressManager = {
        init() {
            this.loadProgress();
            window.addEventListener('beforeunload', () => this.saveProgress());
        },

        loadProgress() {
            const saved = localStorage.getItem('netadAdvancedProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                courseState.progress = progress;
                EnterpriseUIController.updateProgress();
                
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
                enterpriseLabs: courseState.enterpriseLabs
            };
            
            localStorage.setItem('netadAdvancedProgress', JSON.stringify(progress));
        }
    };

    // Initialize Course
    function initializeEnterpriseCourse() {
        // Initialize navigation and progress tracking
        NavigationManager.init();
        ProgressManager.init();

        // Start with first section if no progress
        if (!courseState.currentContent) {
            const firstLink = document.querySelector('.section-content a');
            if (firstLink) {
                firstLink.click();
            }
        }

        // Initialize enterprise features
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause resource-intensive operations when tab is not visible
                document.querySelectorAll('[data-interval]').forEach(element => {
                    clearInterval(element.getAttribute('data-interval'));
                });
            } else {
                // Resume operations when tab becomes visible
                const contentId = courseState.currentContent;
                if (contentId) {
                    EnterpriseContentManager.initializeEnterpriseFeatures(contentId);
                }
            }
        });
    }

    // Start initialization
    initializeEnterpriseCourse();
});
