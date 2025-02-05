document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content

    // Mapping of content IDs to their corresponding HTML file paths
    const contentRoutes = {
        // Pre and Post Assessments
        "pre-assessment": "/WMAD/beginner/pre-assessment",
        "post-assessment": "/WMAD/beginner/post-assessment",

        // Course Introduction
        "welcome": "/WMAD/beginner",
        "setup": "/WMAD/beginner/development_setup",
        "web-basics": "/WMAD/beginner/web_basics",

        // HTML Fundamentals
        "html-intro": "/WMAD/beginner/intro_html",
        "html-elements": "/WMAD/beginner/basic_elements",
        "html-forms": "/WMAD/beginner/form_input",
        "html-media": "/WMAD/beginner/media",
        "html-quiz": "/WMAD/beginner/html_knowledge", // No actual file for quiz

        // CSS Section
        "css-intro": "/WMAD/beginner/intro_css",
        "css-selectors": "/WMAD/beginner/select_properties",
        "css-layout": "/WMAD/beginner/layout_box",
        "css-responsive": "/WMAD/beginner/responsive_design",
        "css-quiz": "/WMAD/beginner/css_knowledge",

        // JavaScript Section
        "js-intro": "/WMAD/beginner/intro_js",
        "js-variables": "/WMAD/beginner/variable",
        "js-control": "/WMAD/beginner/control_flow",
        "js-functions": "/WMAD/beginner/function",
        "js-dom": "/WMAD/beginner/dom",
        "js-events": "/WMAD/beginner/events",
        "js-quiz": "/WMAD/beginner/js_knowledge",

        // Projects
        "project-1": "/WMAD/beginner/landingpage",
        "project-2": "/WMAD/beginner/interactiveform",
        "project-3": "/WMAD/beginner/todoapp",
        "project-review": "/WMAD/beginner/project_review"
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

        // Create an iframe to load the content
        const iframe = document.createElement('iframe');
        iframe.src = route;
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.onload = () => {
            // Adjust iframe height to content
            iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
        };
        iframe.onerror = (error) => {
            console.error('Error loading content:', error);
            contentSection.innerHTML = `
                <div class="error-message">
                    <h2>Content Loading Error</h2>
                    <p>Unable to load the requested content. Please try again later.</p>
                    <p>Error details: ${error}</p>
                </div>
            `;
        };

        // Clear existing content and add iframe
        contentSection.innerHTML = '';
        contentSection.appendChild(iframe);
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
    function initializeFirstLink() {
        const firstLink = document.querySelector(".nav-link[data-content='welcome']");
        if (firstLink) {
            updateContent("welcome");
        }
    }

    // Initialize accordions and radio buttons on page load
    initializeAccordions();
    initializeRadioButtons();
    initializeFirstLink();
});