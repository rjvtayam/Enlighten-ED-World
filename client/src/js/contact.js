// Initialize EmailJS
emailjs.init("dsXM4k8iyblu7LBZ4");

// Location Card Function
function openLocation() {
    // LSPU coordinates
    const lat = 14.413402;
    const lng = 121.447901;
    
    // Check if device is mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Open in Google Maps app on mobile
        window.open(`geo:${lat},${lng}?q=${lat},${lng}(LSPU Siniloan Campus)`);
    } else {
        // Open in OpenStreetMap on desktop
        window.open(`https://www.openstreetmap.org/directions?from=&to=${lat}%2C${lng}`);
    }
}

// Email Card Function
function openEmailForm() {
    // Scroll to contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.scrollIntoView({ behavior: 'smooth' });
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 800);
}

// Phone Card Functions
function openCallOptions() {
    const modal = document.getElementById('callModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCallModal() {
    const modal = document.getElementById('callModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Initialize map
function initMap() {
    // LSPU coordinates
    const lat = 14.413402;
    const lng = 121.447901;
    
    // Create map
    const map = L.map('map').setView([lat, lng], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker
    const marker = L.marker([lat, lng]).addTo(map);
    
    // Create popup content with HTML formatting
    const popupContent = `
        <div class="map-popup">
            <h3>LSPU Siniloan Campus</h3>
            <p><i class="fas fa-map-marker-alt"></i> L. de Leon St., Siniloan, Laguna</p>
            <p><i class="fas fa-phone"></i> (049) 813-0452</p>
            <p><i class="fas fa-envelope"></i> icts@lspusc.edu.ph</p>
        </div>
    `;
    
    // Add popup with the formatted content
    marker.bindPopup(popupContent).openPopup();
}

// Add event listeners when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add click listener to phone card
    const phoneCard = document.querySelector('.info-card[onclick="openCallOptions()"]');
    if (phoneCard) {
        phoneCard.addEventListener('click', openCallOptions);
    }

    // Add click listener to close button
    const closeBtn = document.querySelector('.call-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCallModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('callModal');
        if (event.target === modal) {
            closeCallModal();
        }
    });

    const mapElement = document.getElementById('map');
    if (mapElement) {
        initMap();
    }
});

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Get current year for template
    const currentYear = new Date().getFullYear();

    // Prepare template parameters
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        current_year: currentYear
    };

    // Send email using EmailJS
    emailjs.send("service_b1cu7sc", "ft307ah", templateParams)
        .then(function() {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            document.getElementById('contactForm').reset();
        })
        .catch(function(error) {
            showNotification('Failed to send message. Please try again.', 'error');
            console.error('EmailJS Error:', error);
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
} 