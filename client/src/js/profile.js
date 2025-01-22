// Tab Switching Animation
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    function switchTab(targetId) {
        // Remove active class from all tabs and contents
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Add active class to clicked tab and corresponding content
        const selectedTab = document.querySelector(`[data-tab="${targetId}"]`);
        const selectedContent = document.getElementById(targetId);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.style.display = 'block';
            
            // Trigger animation
            setTimeout(() => {
                selectedContent.classList.add('active');
            }, 10);
        }
    }

    // Add click event to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            switchTab(targetId);
        });
    });

    // Initialize first tab
    if (tabs.length > 0) {
        const firstTabId = tabs[0].getAttribute('data-tab');
        switchTab(firstTabId);
    }
});

// File Upload Preview
function handleFileUpload(inputId, previewType, callback) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should not exceed 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            if (callback) {
                callback(event.target.result);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Initialize file upload previews
handleFileUpload('avatarInput', 'avatar', (result) => {
    const avatar = document.querySelector('.profile-avatar img');
    if (avatar) {
        avatar.src = result;
        uploadFile('avatarInput', 'avatar');
    }
});

handleFileUpload('coverInput', 'cover', (result) => {
    const cover = document.querySelector('.cover-photo');
    if (cover) {
        cover.style.backgroundImage = `url(${result})`;
        uploadFile('coverInput', 'cover');
    }
});

// File Upload to Server
async function uploadFile(inputId, type) {
    const input = document.getElementById(inputId);
    if (!input || !input.files[0]) return;

    const formData = new FormData();
    formData.append('file', input.files[0]);
    formData.append('type', type);

    try {
        const response = await fetch('/api/upload-profile-image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }

        // Show success message
        showNotification('success', 'Image uploaded successfully');
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('error', error.message || 'Failed to upload image');
    }
}

// Notification System
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Profile Stats Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-value') || '0');
                
                let current = 0;
                const duration = 1000; // 1 second
                const increment = value / (duration / 16); // 60fps

                const animate = () => {
                    current += increment;
                    if (current < value) {
                        target.textContent = Math.round(current);
                        requestAnimationFrame(animate);
                    } else {
                        target.textContent = value;
                    }
                };

                animate();
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    stats.forEach(stat => observer.observe(stat));
}

// Initialize stats animation
document.addEventListener('DOMContentLoaded', animateStats);

// Smooth Scroll to Sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
