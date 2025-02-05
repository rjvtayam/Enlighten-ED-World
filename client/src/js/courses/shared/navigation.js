document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content

    // Mapping of content IDs to their corresponding routes
    const contentRoutes = {
        // Pre and Post Assessments
        "pre-assessment": "/WMAD/beginner/pre-assessment",
        "post-assessment": "/WMAD/beginner/post-assessment",

        // Course Introduction
        "welcome": "/courses/wmad/beginner",
        "setup": "/courses/wmad/beginner/development-setup",
        "web-basics": "/courses/wmad/beginner/web-basics",

        // HTML Fundamentals
        "html-intro": "/courses/wmad/beginner/intro-html",
        "html-elements": "/courses/wmad/beginner/basic-elements",
        "html-forms": "/courses/wmad/beginner/form-input",
        "html-media": "/courses/wmad/beginner/media",
        "html-quiz": "/courses/wmad/beginner/html-quiz",

        // CSS Section
        "css-intro": "/courses/wmad/beginner/intro-css",
        "css-selectors": "/courses/wmad/beginner/select-properties",
        "css-layout": "/courses/wmad/beginner/layout-box",
        "css-responsive": "/courses/wmad/beginner/responsive-design",
        "css-quiz": "/courses/wmad/beginner/css-quiz",

        // JavaScript Section
        "js-intro": "/courses/wmad/beginner/intro-js",
        "js-variables": "/courses/wmad/beginner/variable",
        "js-control": "/courses/wmad/beginner/control-flow",
        "js-functions": "/courses/wmad/beginner/function",
        "js-dom": "/courses/wmad/beginner/dom",
        "js-events": "/courses/wmad/beginner/events",
        "js-quiz": "/courses/wmad/beginner/js-quiz",

        // Projects
        "project-1": "/courses/wmad/beginner/landingpage",
        "project-2": "/courses/wmad/beginner/form-project",
        "project-3": "/courses/wmad/beginner/todoapp",
        "project-review": "/courses/wmad/beginner/project-review"
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