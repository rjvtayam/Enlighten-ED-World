document.addEventListener('DOMContentLoaded', () => {
    // Video Playlist Functionality
    const videoPlayer = document.getElementById('htmlElementsVideo');
    const videoTitle = document.getElementById('currentVideoTitle');
    const playlistButtons = document.querySelectorAll('.playlist-btn');

    const videoPlaylist = {
        'qz0aGYrrlhU': 'HTML Elements Intro',
        'ysEN5RaKOlA': 'Advanced HTML Elements',
        '3PHXvlpVIRk': 'HTML Semantic Elements'
    };

    playlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            playlistButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');

            // Get video ID and update iframe source
            const videoId = button.dataset.video;
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;

            // Update video title
            videoTitle.textContent = videoPlaylist[videoId];
        });
    });

    // Interactive Code Playground
    const htmlCodeEditor = document.getElementById('htmlCodeEditor');
    const htmlPreviewFrame = document.getElementById('htmlPreviewFrame');
    const renderButton = document.getElementById('renderHTML');
    const clearButton = document.getElementById('clearHTML');

    // Render HTML in preview frame
    renderButton.addEventListener('click', () => {
        const htmlCode = htmlCodeEditor.value;
        const previewDocument = htmlPreviewFrame.contentDocument;
        
        previewDocument.open();
        previewDocument.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        padding: 1rem; 
                        max-width: 800px; 
                        margin: 0 auto; 
                    }
                    h1 { color: #3498db; }
                    a { color: #e74c3c; }
                </style>
            </head>
            <body>
                ${htmlCode}
            </body>
            </html>
        `);
        previewDocument.close();
    });

    // Clear HTML editor and preview
    clearButton.addEventListener('click', () => {
        htmlCodeEditor.value = '';
        const previewDocument = htmlPreviewFrame.contentDocument;
        previewDocument.open();
        previewDocument.write('');
        previewDocument.close();
    });

    // Set default HTML content
    htmlCodeEditor.value = `
<!-- HTML Basic Elements Example -->
<h1>Welcome to HTML Elements</h1>
<p>This is a paragraph demonstrating basic HTML elements.</p>
<a href="https://www.example.com">Learn More</a>
<ul>
    <li>List item 1</li>
    <li>List item 2</li>
</ul>
    `.trim();
});