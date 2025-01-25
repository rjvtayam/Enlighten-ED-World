document.addEventListener('DOMContentLoaded', function() {
    // Advanced Course State Management
    const courseState = {
        currentSection: null,
        currentContent: null,
        progress: {
            completedItems: 0,
            totalItems: document.querySelectorAll('.section-content a').length,
            lastAccessed: null,
            achievements: []
        },
        animation: {
            frames: [],
            currentFrame: 0,
            fps: 24,
            playing: false,
            timeline: {
                markers: [],
                duration: 0,
                currentTime: 0
            }
        },
        character: {
            rig: null,
            controls: [],
            poses: [],
            expressions: []
        },
        workspace: {
            tools: new Map(),
            layers: [],
            history: [],
            activeLayer: null
        }
    };

    // Advanced Animation Tools
    const AnimationTools = {
        // Character Animation System
        CharacterSystem: {
            initializeRig(characterData) {
                const rig = {
                    skeleton: this.createSkeleton(characterData.joints),
                    controls: this.createControls(characterData.controlPoints),
                    constraints: this.setupConstraints(characterData.constraints)
                };
                
                courseState.character.rig = rig;
                return rig;
            },

            createSkeleton(joints) {
                return joints.map(joint => ({
                    id: joint.id,
                    position: { x: joint.x, y: joint.y },
                    rotation: joint.rotation,
                    parent: joint.parent,
                    children: []
                }));
            },

            createControls(controlPoints) {
                return controlPoints.map(point => ({
                    id: point.id,
                    type: point.type,
                    target: point.target,
                    constraints: point.constraints,
                    position: { x: point.x, y: point.y }
                }));
            },

            setupConstraints(constraints) {
                return constraints.map(constraint => ({
                    source: constraint.source,
                    target: constraint.target,
                    type: constraint.type,
                    influence: constraint.influence
                }));
            },

            updateRig(deltaTime) {
                if (!courseState.character.rig) return;
                
                // Update skeleton
                this.updateSkeleton(deltaTime);
                // Update controls
                this.updateControls(deltaTime);
                // Apply constraints
                this.applyConstraints();
            },

            createPose() {
                if (!courseState.character.rig) return null;
                
                const pose = {
                    timestamp: Date.now(),
                    skeleton: JSON.parse(JSON.stringify(courseState.character.rig.skeleton)),
                    controls: JSON.parse(JSON.stringify(courseState.character.rig.controls))
                };
                
                courseState.character.poses.push(pose);
                return pose;
            }
        },

        // Advanced Timeline System
        TimelineSystem: {
            initialize(duration = 10) {
                courseState.animation.timeline.duration = duration;
                this.createTimelineUI();
                this.setupEventListeners();
            },

            createTimelineUI() {
                const timeline = document.createElement('div');
                timeline.className = 'timeline-editor';
                timeline.innerHTML = `
                    <div class="timeline-header">
                        <div class="timeline-tools">
                            <button class="btn-tool" data-tool="keyframe">
                                <i class="fas fa-key"></i>
                            </button>
                            <button class="btn-tool" data-tool="select">
                                <i class="fas fa-mouse-pointer"></i>
                            </button>
                            <button class="btn-tool" data-tool="move">
                                <i class="fas fa-arrows-alt"></i>
                            </button>
                        </div>
                        <div class="timeline-transport">
                            <button class="btn-transport" data-action="play">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="btn-transport" data-action="stop">
                                <i class="fas fa-stop"></i>
                            </button>
                            <div class="time-display">00:00:00</div>
                        </div>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-tracks"></div>
                        <div class="timeline-scrubber"></div>
                    </div>
                `;
                
                document.querySelector('.animation-workspace').appendChild(timeline);
            },

            createKeyframe(time, properties) {
                const keyframe = {
                    id: `kf_${Date.now()}`,
                    time,
                    properties,
                    easing: 'linear'
                };
                
                courseState.animation.timeline.markers.push(keyframe);
                this.updateTimelineUI();
                return keyframe;
            },

            interpolateKeyframes(keyframe1, keyframe2, progress) {
                const result = {};
                
                for (let prop in keyframe1.properties) {
                    if (typeof keyframe1.properties[prop] === 'number') {
                        result[prop] = this.interpolateValue(
                            keyframe1.properties[prop],
                            keyframe2.properties[prop],
                            progress,
                            keyframe1.easing
                        );
                    } else if (typeof keyframe1.properties[prop] === 'object') {
                        result[prop] = this.interpolateObject(
                            keyframe1.properties[prop],
                            keyframe2.properties[prop],
                            progress,
                            keyframe1.easing
                        );
                    }
                }
                
                return result;
            }
        },

        // Motion Graphics System
        MotionSystem: {
            initialize() {
                this.setupWorkspace();
                this.initializeTools();
                this.createCompositionSettings();
            },

            setupWorkspace() {
                const workspace = document.createElement('div');
                workspace.className = 'motion-workspace';
                workspace.innerHTML = `
                    <div class="workspace-header">
                        <div class="composition-settings">
                            <select id="comp-preset">
                                <option value="1080p">1080p</option>
                                <option value="4k">4K</option>
                                <option value="square">Square</option>
                                <option value="custom">Custom</option>
                            </select>
                            <input type="number" id="comp-width" value="1920">
                            <input type="number" id="comp-height" value="1080">
                            <input type="number" id="comp-fps" value="24">
                        </div>
                    </div>
                    <div class="workspace-main">
                        <div class="workspace-tools"></div>
                        <div class="workspace-viewer"></div>
                        <div class="workspace-properties"></div>
                    </div>
                `;
                
                document.querySelector('.content-area').appendChild(workspace);
            },

            createLayer(type, properties = {}) {
                const layer = {
                    id: `layer_${Date.now()}`,
                    type,
                    properties: {
                        position: { x: 0, y: 0 },
                        scale: { x: 1, y: 1 },
                        rotation: 0,
                        opacity: 1,
                        ...properties
                    },
                    effects: [],
                    masks: [],
                    visible: true,
                    locked: false
                };
                
                courseState.workspace.layers.push(layer);
                this.updateLayerList();
                return layer;
            }
        },

        // Effects System
        EffectsSystem: {
            initialize() {
                this.initializeEffectsLibrary();
                this.setupEffectsWorkspace();
            },

            initializeEffectsLibrary() {
                const effects = [
                    {
                        name: 'Particle System',
                        type: 'particles',
                        properties: {
                            emissionRate: 10,
                            lifetime: 2,
                            speed: 100,
                            size: 10,
                            color: '#ffffff'
                        }
                    },
                    {
                        name: 'Color Correction',
                        type: 'color',
                        properties: {
                            brightness: 0,
                            contrast: 1,
                            saturation: 1,
                            hue: 0
                        }
                    },
                    // Add more effects as needed
                ];
                
                courseState.workspace.tools.set('effects', effects);
            },

            applyEffect(layer, effectType, properties) {
                const effect = {
                    id: `effect_${Date.now()}`,
                    type: effectType,
                    properties: properties
                };
                
                layer.effects.push(effect);
                this.updateEffectsChain(layer);
                return effect;
            }
        }
    };

    // Professional UI Controller
    const UIController = {
        initialize() {
            this.setupWorkspaceLayout();
            this.initializeTools();
            this.setupEventListeners();
        },

        setupWorkspaceLayout() {
            const workspace = document.createElement('div');
            workspace.className = 'professional-workspace';
            workspace.innerHTML = `
                <div class="workspace-header">
                    <div class="tool-palette"></div>
                    <div class="workspace-controls"></div>
                </div>
                <div class="workspace-main">
                    <div class="workspace-sidebar left"></div>
                    <div class="workspace-content">
                        <div class="preview-window"></div>
                        <div class="timeline-editor"></div>
                    </div>
                    <div class="workspace-sidebar right"></div>
                </div>
            `;
            
            document.querySelector('.content-area').appendChild(workspace);
        },

        createToolPalette() {
            const tools = [
                { id: 'select', icon: 'mouse-pointer', name: 'Select' },
                { id: 'move', icon: 'arrows-alt', name: 'Move' },
                { id: 'rotate', icon: 'sync', name: 'Rotate' },
                { id: 'scale', icon: 'expand', name: 'Scale' },
                { id: 'text', icon: 'font', name: 'Text' },
                { id: 'shape', icon: 'shapes', name: 'Shape' },
                { id: 'pen', icon: 'pen', name: 'Pen' },
                { id: 'camera', icon: 'video', name: 'Camera' }
            ];

            const palette = document.createElement('div');
            palette.className = 'tool-palette';
            
            tools.forEach(tool => {
                const button = document.createElement('button');
                button.className = 'tool-button';
                button.dataset.tool = tool.id;
                button.innerHTML = `
                    <i class="fas fa-${tool.icon}"></i>
                    <span class="tooltip">${tool.name}</span>
                `;
                palette.appendChild(button);
            });

            return palette;
        }
    };

    // Project Manager
    const ProjectManager = {
        initialize() {
            this.setupProjectStructure();
            this.initializeAutosave();
            this.loadLastSession();
        },

        setupProjectStructure() {
            const project = {
                id: `project_${Date.now()}`,
                name: 'Untitled Project',
                created: new Date(),
                modified: new Date(),
                assets: [],
                compositions: [],
                settings: {
                    resolution: { width: 1920, height: 1080 },
                    fps: 24,
                    duration: 30
                }
            };

            courseState.project = project;
            this.saveProject();
        },

        saveProject() {
            const projectData = JSON.stringify(courseState.project);
            localStorage.setItem('amgIntermediateProject', projectData);
            courseState.project.modified = new Date();
        },

        exportProject(format = 'json') {
            const exportData = {
                project: courseState.project,
                animation: courseState.animation,
                workspace: courseState.workspace
            };

            switch (format) {
                case 'json':
                    return JSON.stringify(exportData, null, 2);
                case 'ae':
                    return this.convertToAeFormat(exportData);
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
        }
    };

    // Initialize Course
    function initializeCourse() {
        UIController.initialize();
        AnimationTools.TimelineSystem.initialize();
        AnimationTools.MotionSystem.initialize();
        AnimationTools.EffectsSystem.initialize();
        ProjectManager.initialize();

        // Start with welcome content if no progress
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
