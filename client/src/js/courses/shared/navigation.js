document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content
  
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
        // Preserve the existing welcome content logic
        if (contentId === "welcome") {
            contentSection.innerHTML = initialContent;
            initializeAccordions();
            initializeRadioButtons();
            return;
        }

        // Mapping of content IDs to their corresponding HTML file paths
        const contentMap = {
            // Pre and Post Assessments
            "pre-assessment": `
                <iframe src="/wmad/WMAD/beginner/pre-assessment" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "post-assessment": `
                <iframe src="/wmad/WMAD/beginner/post-assessment" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,

            // Course Introduction
            "welcome": `
                <iframe src="/pages/courses/WMAD/beginner/index.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "setup": `
                <iframe src="/pages/courses/WMAD/beginner/development_setup.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "web-basics": `
                <iframe src="/pages/courses/WMAD/beginner/web_basics.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,

            // HTML Fundamentals
            "html-intro": `
                <iframe src="/pages/courses/WMAD/beginner/intro_html.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "html-elements": `
                <iframe src="/pages/courses/WMAD/beginner/basic_elements.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "html-forms": `
                <iframe src="/pages/courses/WMAD/beginner/form_input.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "html-media": `
                <iframe src="/pages/courses/WMAD/beginner/media.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "html-quiz": `
                <iframe src="/pages/courses/WMAD/beginner/html_quiz.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,

            // CSS Section
            "css-intro": `
                <iframe src="/pages/courses/WMAD/beginner/intro_css.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "css-selectors": `
                <iframe src="/pages/courses/WMAD/beginner/select_properties.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "css-layout": `
                <iframe src="/pages/courses/WMAD/beginner/layout_box.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "css-responsive": `
                <iframe src="/pages/courses/WMAD/beginner/responsive_design.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "css-quiz": `
                <iframe src="/pages/courses/WMAD/beginner/css_quiz.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,

            // JavaScript Section
            "js-intro": `
                <iframe src="/pages/courses/WMAD/beginner/intro_js.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "js-variables": `
                <iframe src="/pages/courses/WMAD/beginner/variable.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "js-control": `
                <iframe src="/pages/courses/WMAD/beginner/control_flow.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "js-functions": `
                <iframe src="/pages/courses/WMAD/beginner/function.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "js-dom": `
                <iframe src="/pages/courses/WMAD/beginner/dom.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "js-events": `
                <iframe src="/pages/courses/WMAD/beginner/events.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "js-quiz": `
                <iframe src="/pages/courses/WMAD/beginner/js_quiz.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,

            // Projects
            "project-1": `
                <iframe src="/pages/courses/WMAD/beginner/landingpage.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "project-2": `
                <iframe src="/pages/courses/WMAD/beginner/form_project.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "project-3": `
                <iframe src="/pages/courses/WMAD/beginner/todoapp.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `,
            "project-review": `
                <iframe src="/pages/courses/WMAD/beginner/project_review.html" class="content-iframe" width="100%" height="800px" frameborder="0"></iframe>
            `
        };

        // Fetch and load content dynamically
        if (contentMap[contentId]) {
            if (contentMap[contentId].startsWith('<')) {
                // Direct HTML content (for assessments)
                contentSection.innerHTML = contentMap[contentId];
            } else {
                // Fetch HTML template
                fetch(contentMap[contentId])
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Content not found');
                        }
                        return response.text();
                    })
                    .then(html => {
                        contentSection.innerHTML = html;
                        // Re-initialize any necessary components
                        initializeAccordions();
                        initializeRadioButtons();
                    })
                    .catch(error => {
                        console.error('Error loading content:', error);
                        contentSection.innerHTML = `
                            <h2>Content Not Found</h2>
                            <p>Unable to load content for ${contentId}</p>
                        `;
                    });
            }
        } else {
            // Fallback for unknown content
            contentSection.innerHTML = `
                <h2>Content Not Found</h2>
                <p>No content available for ${contentId}</p>
            `;
        }
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
      firstLink.classList.add("active");
      updateContent("welcome");
    }
  
    // Initialize accordions and radio buttons on page load
    initializeAccordions();
    initializeRadioButtons();
  });