document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const navGroups = document.querySelectorAll(".nav-group");
    const contentSection = document.querySelector(".content-section");
    const initialContent = contentSection.innerHTML; // Store the initial content
  
    // Function to update the content section (placeholder for dynamic content)
    function updateContent(contentId) {
      // Replace this with your logic to fetch or inject content dynamically
      if (contentId === "welcome") {
        contentSection.innerHTML = initialContent; // Restore the initial content
      } else {
        contentSection.innerHTML = `
          <h2>Loading Content...</h2>
          <p>Content for <strong>${contentId}</strong> will be loaded here.</p>
        `;
      }
    }
  
    // Function to handle navigation link clicks
    function handleNavLinkClick(event) {
      event.preventDefault();
  
      // Remove active class from all links
      navLinks.forEach((link) => link.classList.remove("active"));
  
      // Add active class to the clicked link
      const clickedLink = event.currentTarget;
      clickedLink.classList.add("active");
  
      // Update the content section
      const contentId = clickedLink.getAttribute("data-content");
      updateContent(contentId);
    }
  
    // Function to handle nav group header clicks (expand/collapse)
    function handleNavGroupHeaderClick(event) {
      const header = event.currentTarget;
      const group = header.parentElement;
  
      // Toggle the expanded class
      group.classList.toggle("expanded");
  
      // Close other expanded groups
      navGroups.forEach((otherGroup) => {
        if (otherGroup !== group && otherGroup.classList.contains("expanded")) {
          otherGroup.classList.remove("expanded");
        }
      });
    }
  
    // Add event listeners to nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });
  
    // Add event listeners to nav group headers
    const navGroupHeaders = document.querySelectorAll(".nav-group-header");
    navGroupHeaders.forEach((header) => {
      header.addEventListener("click", handleNavGroupHeaderClick);
    });
  
    // Initialize the first link as active and load its content
    if (navLinks.length > 0) {
      navLinks[0].classList.add("active");
      updateContent(navLinks[0].getAttribute("data-content"));
    }
  });
  