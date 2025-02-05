document.addEventListener('DOMContentLoaded', () => {
    // Canvas Drawing Demo
    const demoCanvas = document.getElementById('demoCanvas');
    const ctx = demoCanvas.getContext('2d');
    
    // Draw a simple rectangle
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, 180, 80);
    
    // Draw a circle
    ctx.beginPath();
    ctx.arc(100, 50, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Video Playlist Functionality
    const videoPlayer = document.getElementById('mediaElementsVideo');
    const videoTitle = document.getElementById('currentVideoTitle');
    const playlistButtons = document.querySelectorAll('.playlist-btn');

    const videoPlaylist = {
        'qz0aGYrrlhU': 'Media Elements Intro',
        'ysEN5RaKOlA': 'Advanced Media Techniques',
        '3PHXvlpVIRk': 'Responsive Media Design'
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
    // Previous code for canvas and video playlist remains the same...

    // Interactive Media Playground
    const mediaTypeSelector = document.getElementById('mediaTypeSelector');
    const mediaSourceInput = document.getElementById('mediaSourceInput');
    const addMediaBtn = document.getElementById('addMediaBtn');
    const mediaPreviewArea = document.getElementById('mediaPreviewArea');

    // Media Type Configurations
    const mediaTypeConfigs = {
        'image': {
            label: 'Image Element',
            generateCode: (source) => `&lt;img 
    src="${source}" 
    alt="User uploaded image" 
    width="300"&gt;`,
            createElement: (source) => {
                const img = document.createElement('img');
                img.src = source;
                img.alt = 'User uploaded image';
                img.width = 300;
                return img;
            }
        },
        'video': {
            label: 'Video Element',
            generateCode: (source) => `&lt;video controls width="400"&gt;
    &lt;source src="${source}" type="video/mp4"&gt;
    Your browser does not support the video tag.
&lt;/video&gt;`,
            createElement: (source) => {
                const video = document.createElement('video');
                video.src = source;
                video.controls = true;
                video.width = 400;
                return video;
            }
        },
        'audio': {
            label: 'Audio Element',
            generateCode: (source) => `&lt;audio controls&gt;
    &lt;source src="${source}" type="audio/mpeg"&gt;
    Your browser does not support the audio tag.
&lt;/audio&gt;`,
            createElement: (source) => {
                const audio = document.createElement('audio');
                audio.src = source;
                audio.controls = true;
                return audio;
            }
        },
        'iframe': {
            label: 'Iframe Embed',
            generateCode: (source) => `&lt;iframe 
    src="${source}" 
    width="400" 
    height="300" 
    frameborder="0"&gt;
&lt;/iframe&gt;`,
            createElement: (source) => {
                const iframe = document.createElement('iframe');
                iframe.src = source;
                iframe.width = '400';
                iframe.height = '300';
                iframe.frameBorder = '0';
                return iframe;
            }
        }
    };

    // Update media type selector
    mediaTypeSelector.innerHTML = `
        <option value="">Select Media Type</option>
        ${Object.keys(mediaTypeConfigs).map(type => 
            `<option value="${type}">${mediaTypeConfigs[type].label}</option>`
        ).join('')}
    `;

    addMediaBtn.addEventListener('click', () => {
        const mediaType = mediaTypeSelector.value;
        const mediaSource = mediaSourceInput.value.trim();

        if (!mediaType || !mediaSource) {
            alert('Please select a media type and enter a source URL');
            return;
        }

        // Get configuration for selected media type
        const config = mediaTypeConfigs[mediaType];

        // Create media preview container
        const mediaPreviewWrapper = document.createElement('div');
        mediaPreviewWrapper.classList.add('media-preview-wrapper');

        // Create code display area
        const codeDisplayArea = document.createElement('pre');
        codeDisplayArea.classList.add('media-code-display');
        codeDisplayArea.innerHTML = `<code>${config.generateCode(mediaSource)}</code>`;

        // Create media preview container
        const mediaPreviewContainer = document.createElement('div');
        mediaPreviewContainer.classList.add('media-preview-container');

        // Create label for preview
        const previewLabel = document.createElement('h4');
        previewLabel.textContent = `${config.label} Preview:`;

        // Create media element
        const mediaElement = config.createElement(mediaSource);

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-media-btn');
        removeBtn.addEventListener('click', () => {
            mediaPreviewWrapper.remove();
        });

        // Add error handling for media loading
        mediaElement.addEventListener('error', () => {
            alert('Error loading media. Please check the URL.');
            mediaPreviewWrapper.remove();
        });

        // Assemble the preview wrapper
        mediaPreviewContainer.appendChild(previewLabel);
        mediaPreviewContainer.appendChild(mediaElement);

        mediaPreviewWrapper.appendChild(mediaPreviewContainer);
        mediaPreviewWrapper.appendChild(codeDisplayArea);
        mediaPreviewWrapper.appendChild(removeBtn);

        // Add to media preview area
        mediaPreviewArea.appendChild(mediaPreviewWrapper);

        // Clear input fields
        mediaTypeSelector.value = '';
        mediaSourceInput.value = '';
    });
});