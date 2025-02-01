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
      switch(contentId) {
        case "welcome":
          contentSection.innerHTML = initialContent;
          initializeAccordions();
          initializeRadioButtons();
          break;
        case "pre-assessment":
          contentSection.innerHTML = `
            <iframe src="/courses/WMAD/beginner/pre-assessment.html" class="assessment-iframe" width="100%" height="800px" frameborder="0"></iframe>
          `;
          break;
        case "post-assessment":
          contentSection.innerHTML = `
            <iframe src="/courses/WMAD/beginner/post-assessment.html" class="assessment-iframe" width="100%" height="800px" frameborder="0"></iframe>
          `;
          break;
        default:
          contentSection.innerHTML = `
            <h2>Loading Content...</h2>
            <p>Content for <strong>${contentId}</strong> will be loaded here.</p>
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