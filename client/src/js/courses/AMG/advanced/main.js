document.addEventListener('DOMContentLoaded', function() {
    // Professional Course State Management
    const courseState = {
        currentSection: null,
        currentContent: null,
        progress: {
            completedItems: 0,
            totalItems: document.querySelectorAll('.section-content a').length,
            lastAccessed: null,
            achievements: [],
            certifications: []
        },
        workspace: {
            activeProject: null,
            currentTool: null,
            history: [],
            layers: [],
            effects: [],
            renderQueue: []
        },
        timeline: {
            currentTime: 0,
            duration: 0,
            fps: 30,
            markers: [],
            keyframes: new Map(),
            tracks: []
        },
        render: {
            resolution: { width: 1920, height: 1080 },
            quality: 'high',
            format: 'mp4',
            codec: 'h264',
            queue: []
        },
        pipeline: {
            assets: new Map(),
            cache: new Map(),
            plugins: new Set(),
            automations: []
        }
    };

    // Professional Animation Tools
    const AnimationTools = {
        // Advanced 3D Integration System
        ThreeDSystem: {
            initialize() {
                this.setupRenderer();
                this.initializeScene();
                this.setupCamera();
                this.createLights();
                this.setupControls();
            },

            setupRenderer() {
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                
                return renderer;
            },

            initializeScene() {
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0x2c3e50);
                scene.fog = new THREE.Fog(0x2c3e50, 10, 50);
                
                return scene;
            },

            createModel(modelData) {
                const loader = new THREE.GLTFLoader();
                
                return new Promise((resolve, reject) => {
                    loader.load(modelData.url, (gltf) => {
                        const model = gltf.scene;
                        this.setupModelProperties(model, modelData);
                        resolve(model);
                    }, undefined, reject);
                });
            }
        },

        // Advanced Motion Graphics System
        MotionSystem: {
            initialize() {
                this.setupComposition();
                this.initializeEffects();
                this.createWorkspace();
            },

            setupComposition(settings = {}) {
                const defaultSettings = {
                    width: 1920,
                    height: 1080,
                    duration: 30,
                    fps: 30,
                    backgroundColor: '#000000'
                };

                const composition = {
                    ...defaultSettings,
                    ...settings,
                    layers: [],
                    effects: [],
                    markers: [],
                    guides: []
                };

                return composition;
            },

            createLayer(type, properties) {
                const layer = {
                    id: `layer_${Date.now()}`,
                    type,
                    properties: {
                        position: { x: 0, y: 0, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1, y: 1, z: 1 },
                        opacity: 1,
                        blendMode: 'normal',
                        ...properties
                    },
                    effects: [],
                    masks: [],
                    keyframes: new Map(),
                    parent: null,
                    children: []
                };

                return layer;
            },

            applyEffect(layer, effect) {
                const effectInstance = {
                    id: `effect_${Date.now()}`,
                    type: effect.type,
                    properties: { ...effect.properties },
                    enabled: true
                };

                layer.effects.push(effectInstance);
                this.updateLayerComposition(layer);
                return effectInstance;
            }
        },

        // Professional VFX System
        VFXSystem: {
            initialize() {
                this.initializeCompositor();
                this.setupNodeEditor();
                this.createEffectsLibrary();
            },

            initializeCompositor() {
                const compositor = {
                    nodes: new Map(),
                    connections: [],
                    viewer: null,
                    history: []
                };

                return compositor;
            },

            createNode(type, properties) {
                const node = {
                    id: `node_${Date.now()}`,
                    type,
                    properties: { ...properties },
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 }
                };

                return node;
            },

            processNode(node) {
                switch(node.type) {
                    case 'input':
                        return this.processInputNode(node);
                    case 'filter':
                        return this.processFilterNode(node);
                    case 'composite':
                        return this.processCompositeNode(node);
                    case 'output':
                        return this.processOutputNode(node);
                    default:
                        throw new Error(`Unknown node type: ${node.type}`);
                }
            }
        },

        // Production Pipeline System
        PipelineSystem: {
            initialize() {
                this.setupProjectStructure();
                this.initializeAssetManagement();
                this.createAutomationTools();
            },

            setupProjectStructure() {
                const structure = {
                    assets: {
                        images: [],
                        videos: [],
                        audio: [],
                        models: [],
                        fonts: []
                    },
                    compositions: [],
                    renders: [],
                    cache: new Map(),
                    metadata: {
                        created: Date.now(),
                        modified: Date.now(),
                        version: '1.0.0'
                    }
                };

                return structure;
            },

            createAutomation(type, config) {
                const automation = {
                    id: `automation_${Date.now()}`,
                    type,
                    config: { ...config },
                    status: 'idle',
                    history: []
                };

                courseState.pipeline.automations.push(automation);
                return automation;
            },

            processAsset(asset) {
                const processor = this.getAssetProcessor(asset.type);
                return processor.process(asset);
            }
        }
    };

    // Professional UI Controller
    const UIController = {
        initialize() {
            this.setupWorkspace();
            this.createToolPalette();
            this.initializeTimeline();
            this.setupEventListeners();
        },

        setupWorkspace() {
            const workspace = document.createElement('div');
            workspace.className = 'professional-workspace';
            workspace.innerHTML = `
                <div class="workspace-header">
                    <div class="tool-palette"></div>
                    <div class="workspace-controls">
                        <div class="view-controls">
                            <button class="btn-view" data-view="perspective">
                                <i class="fas fa-cube"></i>
                            </button>
                            <button class="btn-view" data-view="top">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                            <button class="btn-view" data-view="front">
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        <div class="render-controls">
                            <button class="btn-render" data-action="preview">
                                <i class="fas fa-play"></i> Preview
                            </button>
                            <button class="btn-render" data-action="render">
                                <i class="fas fa-film"></i> Render
                            </button>
                        </div>
                    </div>
                </div>
                <div class="workspace-main">
                    <div class="workspace-sidebar left">
                        <div class="project-panel">
                            <div class="panel-header">Project</div>
                            <div class="project-assets"></div>
                        </div>
                        <div class="properties-panel">
                            <div class="panel-header">Properties</div>
                            <div class="properties-content"></div>
                        </div>
                    </div>
                    <div class="workspace-content">
                        <div class="viewport"></div>
                        <div class="timeline"></div>
                    </div>
                    <div class="workspace-sidebar right">
                        <div class="effects-panel">
                            <div class="panel-header">Effects</div>
                            <div class="effects-library"></div>
                        </div>
                        <div class="render-panel">
                            <div class="panel-header">Render Queue</div>
                            <div class="render-queue"></div>
                        </div>
                    </div>
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
                { id: 'camera', icon: 'video', name: 'Camera' },
                { id: 'light', icon: 'lightbulb', name: 'Light' },
                { id: 'material', icon: 'palette', name: 'Material' },
                { id: 'node', icon: 'project-diagram', name: 'Node' }
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
        },

        initializeTimeline() {
            const timeline = document.createElement('div');
            timeline.className = 'timeline-editor';
            timeline.innerHTML = `
                <div class="timeline-header">
                    <div class="timeline-tools">
                        <button class="btn-tool" data-tool="keyframe">
                            <i class="fas fa-key"></i>
                        </button>
                        <button class="btn-tool" data-tool="marker">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="btn-tool" data-tool="split">
                            <i class="fas fa-cut"></i>
                        </button>
                    </div>
                    <div class="timeline-transport">
                        <button class="btn-transport" data-action="start">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        <button class="btn-transport" data-action="play">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-transport" data-action="end">
                            <i class="fas fa-step-forward"></i>
                        </button>
                        <div class="time-display">00:00:00:00</div>
                    </div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-tracks"></div>
                    <div class="timeline-scrubber"></div>
                </div>
            `;

            return timeline;
        }
    };

    // Professional Project Manager
    const ProjectManager = {
        initialize() {
            this.setupProjectStructure();
            this.initializeAssetManagement();
            this.setupAutosave();
            this.loadLastSession();
        },

        setupProjectStructure() {
            const project = {
                id: `project_${Date.now()}`,
                name: 'Advanced Animation Project',
                created: new Date(),
                modified: new Date(),
                settings: {
                    resolution: { width: 1920, height: 1080 },
                    fps: 30,
                    duration: 300
                },
                assets: {
                    images: [],
                    videos: [],
                    audio: [],
                    models: [],
                    fonts: []
                },
                compositions: [],
                renders: [],
                metadata: {
                    author: '',
                    description: '',
                    tags: [],
                    version: '1.0.0'
                }
            };

            courseState.project = project;
            this.saveProject();
        },

        exportProject(format = 'json') {
            const exportData = {
                project: courseState.project,
                workspace: courseState.workspace,
                timeline: courseState.timeline,
                render: courseState.render
            };

            switch(format) {
                case 'json':
                    return JSON.stringify(exportData, null, 2);
                case 'ae':
                    return this.convertToAfterEffects(exportData);
                case 'c4d':
                    return this.convertToCinema4D(exportData);
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
        }
    };

    // Initialize Course
    function initializeCourse() {
        UIController.initialize();
        AnimationTools.ThreeDSystem.initialize();
        AnimationTools.MotionSystem.initialize();
        AnimationTools.VFXSystem.initialize();
        AnimationTools.PipelineSystem.initialize();
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
