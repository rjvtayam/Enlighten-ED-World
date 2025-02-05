document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content

    // Mapping of content IDs to their corresponding HTML file paths
    const contentRoutes = {
        // Pre and Post Assessments
        "pre-assessment": "/courses/WMAD/beginner/pre-assessment.html",
        "post-assessment": "/courses/WMAD/beginner/post-assessment.html",

        // Course Introduction
        "welcome": "/courses/WMAD/beginner/index.html",
        "setup": "/courses/WMAD/beginner/development_setup.html",
        "web-basics": "/courses/WMAD/beginner/web_basics.html",

        // HTML Fundamentals
        "html-intro": "/courses/WMAD/beginner/intro_html.html",
        "html-elements": "/courses/WMAD/beginner/basic_elements.html",
        "html-forms": "/courses/WMAD/beginner/forms_input.html",
        "html-media": "/courses/WMAD/beginner/media_elements.html",
        "html-quiz": "#", // No actual file for quiz

        // CSS Section
        "css-intro": "/courses/WMAD/beginner/intro_css.html",
        "css-selectors": "/courses/WMAD/beginner/selectors_properties.html",
        "css-layout": "/courses/WMAD/beginner/layout_box_model.html",
        "css-responsive": "/courses/WMAD/beginner/responsive_design.html",
        "css-quiz": "/courses/WMAD/beginner/css_quiz.html",

        // JavaScript Section
        "js-intro": "/courses/WMAD/beginner/intro_js.html",
        "js-variables": "/courses/WMAD/beginner/variable.html",
        "js-control": "/courses/WMAD/beginner/control_flow.html",
        "js-functions": "/courses/WMAD/beginner/functions.html",
        "js-dom": "/courses/WMAD/beginner/dom_manipulation.html",
        "js-events": "/courses/WMAD/beginner/events.html",
        "js-quiz": "/courses/WMAD/beginner/quiz_js.html",

        // Projects
        "project-1": "/courses/WMAD/beginner/landingpage.html",
        "project-2": "/courses/WMAD/beginner/interactiveform.html",
        "project-3": "/courses/WMAD/beginner/todoapp.html",
        "project-review": "/courses/WMAD/beginner/projectreview.html"
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