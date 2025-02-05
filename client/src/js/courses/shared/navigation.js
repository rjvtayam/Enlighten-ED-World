document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content

    // Mapping of content IDs to their corresponding HTML file paths
    const contentRoutes = {
        // Beginner Course Content
        "welcome": "/courses/WMAD/beginner/index.html",
        "landing": "/courses/WMAD/beginner/landingpage.html",
        "setup": "/courses/WMAD/beginner/development_setup.html",
        "web-basics": "/courses/WMAD/beginner/web_basics.html",
        "basic-elements": "/courses/WMAD/beginner/basic_elements.html",
        "form-input": "/courses/WMAD/beginner/form_input.html",
        "form-project": "/courses/WMAD/beginner/form_project.html",
        "responsive-design": "/courses/WMAD/beginner/responsive_design.html",
        
        // HTML Content
        "intro-html": "/courses/WMAD/beginner/intro_html.html",
        
        // CSS Content
        "intro-css": "/courses/WMAD/beginner/intro_css.html",
        "layout-box": "/courses/WMAD/beginner/layout_box.html",
        "select-properties": "/courses/WMAD/beginner/select_properties.html",
        "media": "/courses/WMAD/beginner/media.html",
        
        // JavaScript Content
        "intro-js": "/courses/WMAD/beginner/intro_js.html",
        "variables": "/courses/WMAD/beginner/variable.html",
        "control-flow": "/courses/WMAD/beginner/control_flow.html",
        "functions": "/courses/WMAD/beginner/function.html",
        "dom": "/courses/WMAD/beginner/dom.html",
        "events": "/courses/WMAD/beginner/events.html",
        
        // Projects and Reviews
        "project-review": "/courses/WMAD/beginner/project_review.html",
        
        // Assessments
        "pre-assessment": "/courses/WMAD/beginner/pre-assessment.html",
        "post-assessment": "/courses/WMAD/beginner/post-assessment.html"
    };

    // Accordion Functionality
    function initializeAccordions() {
      const accordions = document.querySelectorAll('.accordion');
      accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        
        // Set initial state - show prerequisites content
        content.style.maxHeight = content.scrollHeight + "px";
        header.classList.add('active');
        
        header.addEventListener('click', () => {
          header.classList.toggle('active');
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      });
    }

    // Radio Button Functionality
    function initializeRadioButtons() {
      const radioButtons = document.querySelectorAll('.prerequisite-item input[type="radio"]');
      radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
          const label = this.closest('.prerequisite-item');
          if (this.checked) {
            label.classList.add('checked');
          } else {
            label.classList.remove('checked');
          }
        });
      });
    }

    function updateContent(contentId) {
        // If it's the welcome content, use the initial content
        if (contentId === "welcome") {
            contentSection.innerHTML = initialContent;
            initializeAccordions();
            initializeRadioButtons();
            return;
        }

        // Get the corresponding route
        const route = contentRoutes[contentId];
        if (!route) {
            console.error(`No route found for content: ${contentId}`);
            return;
        }

        // Fetch the content dynamically
        fetch(route)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Create a temporary div to parse the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Extract the main content (adjust selector as needed)
                const mainContent = tempDiv.querySelector('.course-content') || 
                                    tempDiv.querySelector('main') || 
                                    tempDiv.querySelector('.content-section') || 
                                    tempDiv;

                // Update the content section
                contentSection.innerHTML = mainContent.innerHTML;

                // Re-initialize any interactive elements
                initializeAccordions();
                initializeRadioButtons();
            })
            .catch(error => {
                console.error('Error loading content:', error);
                contentSection.innerHTML = `
                    <div class="error-message">
                        <h2>Content Loading Error</h2>
                        <p>Unable to load the requested content. Please try again later.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
    }

    function handleNavLinkClick(event) {
        event.preventDefault();
        navLinks.forEach((link) => link.classList.remove("active"));
        const clickedLink = event.currentTarget;
        clickedLink.classList.add("active");
        const contentId = clickedLink.getAttribute("data-content");
        updateContent(contentId);
    }

    function handleNavGroupHeaderClick(event) {
        const header = event.currentTarget;
        const group = header.parentElement;
        group.classList.toggle("expanded");
        navGroups.forEach((otherGroup) => {
            if (otherGroup !== group && otherGroup.classList.contains("expanded")) {
                otherGroup.classList.remove("expanded");
            }
        });
    }

    // Add event listeners
    navLinks.forEach((link) => {
        link.addEventListener("click", handleNavLinkClick);
    });

    const navGroupHeaders = document.querySelectorAll(".nav-group-header");
    navGroupHeaders.forEach((header) => {
        header.addEventListener("click", handleNavGroupHeaderClick);
    });

    // Initialize first link, accordion, and radio buttons
    if (navLinks.length > 0) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const firstLink = document.querySelector(".nav-link[data-content='welcome']");
        if (firstLink) {
            firstLink.classList.add("active");
            updateContent("welcome");
        }
    }

    // Initialize accordions and radio buttons on page load
    initializeAccordions();
    initializeRadioButtons();
});