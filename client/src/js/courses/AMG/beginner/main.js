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
        canvas: {
            tool: 'brush',
            color: '#000000',
            brushSize: 5,
            history: []
        },
        animation: {
            frames: [],
            currentFrame: 0,
            fps: 24,
            playing: false
        }
    };

    // Animation Tools
    const AnimationTools = {
        // Drawing Tools
        initializeCanvas(canvasId) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;

            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);

            function startDrawing(e) {
                isDrawing = true;
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }

            function draw(e) {
                if (!isDrawing) return;

                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.strokeStyle = courseState.canvas.color;
                ctx.lineWidth = courseState.canvas.brushSize;
                ctx.lineCap = 'round';
                ctx.stroke();

                [lastX, lastY] = [e.offsetX, e.offsetY];
            }

            function stopDrawing() {
                if (isDrawing) {
                    isDrawing = false;
                    courseState.canvas.history.push(canvas.toDataURL());
                }
            }

            return { canvas, ctx };
        },

        // Timeline Management
        createKeyframe(time, properties) {
            return {
                time,
                properties,
                id: Math.random().toString(36).substr(2, 9)
            };
        },

        interpolateKeyframes(keyframe1, keyframe2, progress) {
            const result = {};
            for (let prop in keyframe1.properties) {
                if (typeof keyframe1.properties[prop] === 'number') {
                    result[prop] = keyframe1.properties[prop] + 
                        (keyframe2.properties[prop] - keyframe1.properties[prop]) * progress;
                }
            }
            return result;
        },

        // Animation Preview
        async renderPreview(frames) {
            const preview = document.createElement('canvas');
            const ctx = preview.getContext('2d');
            
            let currentFrame = 0;
            const animate = () => {
                if (courseState.animation.playing) {
                    ctx.clearRect(0, 0, preview.width, preview.height);
                    ctx.drawImage(frames[currentFrame], 0, 0);
                    
                    currentFrame = (currentFrame + 1) % frames.length;
                    requestAnimationFrame(animate);
                }
            };

            return animate;
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

        createDrawingWorkspace() {
            const workspace = document.createElement('div');
            workspace.className = 'canvas-workspace';
            workspace.innerHTML = `
                <div class="tool-palette">
                    <button class="tool-button" data-tool="brush">
                        <i class="fas fa-paint-brush"></i> Brush
                    </button>
                    <button class="tool-button" data-tool="eraser">
                        <i class="fas fa-eraser"></i> Eraser
                    </button>
                    <input type="color" id="color-picker" value="#000000">
                    <input type="range" id="brush-size" min="1" max="20" value="5">
                </div>
                <canvas id="drawing-canvas" class="drawing-canvas"></canvas>
                <div class="canvas-controls">
                    <button class="btn btn-secondary" id="clear-canvas">Clear</button>
                    <button class="btn btn-primary" id="save-canvas">Save</button>
                </div>
            `;
            return workspace;
        },

        createAnimationTimeline() {
            const timeline = document.createElement('div');
            timeline.className = 'timeline-editor';
            timeline.innerHTML = `
                <div class="timeline-header">
                    <h3>Animation Timeline</h3>
                    <div class="timeline-controls">
                        <button class="btn btn-secondary" id="add-keyframe">
                            <i class="fas fa-plus"></i> Add Keyframe
                        </button>
                        <button class="btn btn-primary" id="play-animation">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                </div>
                <div class="timeline-tracks"></div>
                <div class="timeline-scrubber"></div>
            `;
            return timeline;
        },

        createColorPalette() {
            const palette = document.createElement('div');
            palette.className = 'color-picker';
            
            const colors = [
                '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
                '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'
            ];

            colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.addEventListener('click', () => {
                    courseState.canvas.color = color;
                });
                palette.appendChild(swatch);
            });

            return palette;
        },

        createPreviewWindow() {
            const preview = document.createElement('div');
            preview.className = 'preview-window';
            preview.innerHTML = `
                <div class="preview-screen">
                    <canvas id="preview-canvas"></canvas>
                </div>
                <div class="preview-controls">
                    <button class="btn btn-secondary" id="prev-frame">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="btn btn-primary" id="play-preview">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-secondary" id="next-frame">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <input type="range" id="frame-slider" min="0" max="100" value="0">
                </div>
            `;
            return preview;
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
                'drawing-basics': 'Basic Drawing Skills',
                'animation-principles': 'Animation Principles',
                'motion-graphics': 'Motion Graphics Basics',
                // Add more titles as needed
            };
            return titles[contentId] || 'Animation & Motion Graphics';
        },

        initializeInteractiveElements(contentId) {
            switch(contentId) {
                case 'drawing-basics':
                    this.initializeDrawingTools();
                    break;
                case 'animation-principles':
                    this.initializeAnimationTools();
                    break;
                case 'motion-graphics':
                    this.initializeMotionGraphics();
                    break;
            }
        },

        initializeDrawingTools() {
            const workspace = UIController.createDrawingWorkspace();
            document.querySelector('.practical-content').appendChild(workspace);
            
            const { canvas, ctx } = AnimationTools.initializeCanvas('drawing-canvas');
            
            // Initialize tool controls
            document.querySelectorAll('.tool-button').forEach(button => {
                button.addEventListener('click', () => {
                    courseState.canvas.tool = button.dataset.tool;
                    document.querySelectorAll('.tool-button').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                });
            });
        },

        initializeAnimationTools() {
            const timeline = UIController.createAnimationTimeline();
            document.querySelector('.practical-content').appendChild(timeline);
            
            const preview = UIController.createPreviewWindow();
            document.querySelector('.practical-content').appendChild(preview);
            
            // Initialize animation controls
            document.getElementById('play-animation').addEventListener('click', () => {
                courseState.animation.playing = !courseState.animation.playing;
                const icon = document.querySelector('#play-animation i');
                icon.className = courseState.animation.playing ? 'fas fa-pause' : 'fas fa-play';
            });
        },

        initializeMotionGraphics() {
            const workspace = document.createElement('div');
            workspace.className = 'motion-graphics-workspace';
            // Add motion graphics specific tools
        }
    };

    // Progress Manager
    const ProgressManager = {
        init() {
            this.loadProgress();
            window.addEventListener('beforeunload', () => this.saveProgress());
        },

        loadProgress() {
            const saved = localStorage.getItem('amgBeginnerProgress');
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
                    .map(link => link.getAttribute('data-content'))
            };
            
            localStorage.setItem('amgBeginnerProgress', JSON.stringify(progress));
        }
    };

    // Initialize Course
    function initializeCourse() {
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
    }

    // Start initialization
    initializeCourse();
});
