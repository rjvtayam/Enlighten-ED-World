document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content

    // Mapping of content IDs to their corresponding HTML file paths with full routes
    const contentRoutes = {
        // Pre and Post Assessments
        "pre-assessment": "/WMAD/beginner/pre-assessment",
        "post-assessment": "/WMAD/beginner/post-assessment",

        // Course Introduction
        "welcome": "/courses/WMAD/beginner", // Points to index page
        "setup": "/WMAD/beginner/development_setup",
        "web-basics": "/WMAD/beginner/web_basics",

        // HTML Fundamentals
        "html-intro": "/WMAD/beginner/intro_html",
        "html-elements": "/WMAD/beginner/basic_elements",
        "html-forms": "/WMAD/beginner/form_input",
        "html-media": "/WMAD/beginner/media",
        "html-quiz": "#", // No actual file for quiz

        // CSS Section
        "css-intro": "/WMAD/beginner/intro_css",
        "css-selectors": "/WMAD/beginner/select_properties",
        "css-layout": "/WMAD/beginner/layout_box",
        "css-responsive": "/WMAD/beginner/responsive_design",
        "css-quiz": "#",

        // JavaScript Section
        "js-intro": "/WMAD/beginner/intro_js",
        "js-variables": "/WMAD/beginner/variable",
        "js-control": "/WMAD/beginner/control_flow",
        "js-functions": "/WMAD/beginner/function",
        "js-dom": "/WMAD/beginner/dom",
        "js-events": "/WMAD/beginner/events",
        "js-quiz": "#",

        // Projects
        "project-1": "/WMAD/beginner/landingpage",
        "project-2": "/WMAD/beginner/form_project",
        "project-3": "/WMAD/beginner/project_review",
        "project-review": "/WMAD/beginner/project_review"
    };

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

        // If route is a hash or empty, do nothing
        if (route === '#') {
            return;
        }

        // Fetch the content
        fetch(route)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                contentSection.innerHTML = html;
                // Re-run any necessary setup for the new content
                initializeAccordions();
                initializeRadioButtons();
            })
            .catch(error => {
                console.error('Error loading content:', error);
                contentSection.innerHTML = `
                    <div class="error-message">
                        <h2>Content Loading Error</h2>
                        <p>Unable to load the requested content. Please try again later.</p>
                        <p>Error details: ${error}</p>
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
        const group = event.target.closest('.nav-group');
        group.classList.toggle('active');
    }

    // Accordion Functionality
    function initializeAccordions() {
        const accordions = document.querySelectorAll('.accordion');
        accordions.forEach(accordion => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                accordion.classList.toggle('active');
                
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
        const radioGroups = document.querySelectorAll('.radio-group');
        radioGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    radios.forEach(r => r.closest('.radio-option').classList.remove('selected'));
                    radio.closest('.radio-option').classList.add('selected');
                });
            });
        });
    }

    // Initialize functionality
    initializeAccordions();
    initializeRadioButtons();

    // Add event listeners
    navLinks.forEach((link) => {
        link.addEventListener("click", handleNavLinkClick);
    });

    navGroups.forEach((group) => {
        const header = group.querySelector('.nav-group-header');
        if (header) {
            header.addEventListener('click', handleNavGroupHeaderClick);
        }
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
});