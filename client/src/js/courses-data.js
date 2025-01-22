// COURSES SECTION
const coursesData = {
    BSIT: {
      WMAD: [
        {
          title: "Web Development Fundamentals",
          description:
            "Learn the basics of HTML, CSS, and JavaScript for web development.",
        },
        {
          title: "Advanced JavaScript",
          description: "Master modern JavaScript features and best practices.",
        },
        {
          title: "React.js Essentials",
          description: "Build interactive user interfaces with React.js.",
        },
        {
          title: "Node.js and Express",
          description:
            "Create server-side applications with Node.js and Express.",
        },
        {
          title: "Mobile App Development with React Native",
          description: "Develop cross-platform mobile apps using React Native.",
        },
        {
          title: "Full-Stack Web Development",
          description:
            "Combine front-end and back-end technologies for complete web applications.",
        },
      ],
      AMG: [
        {
          title: "3D Modeling Fundamentals",
          description:
            "Learn the basics of 3D modeling using industry-standard software.",
        },
        {
          title: "Digital Animation Techniques",
          description:
            "Master various digital animation techniques and principles.",
        },
        {
          title: "Character Design for Animation",
          description: "Create compelling characters for animated projects.",
        },
        {
          title: "Motion Graphics and Visual Effects",
          description:
            "Produce stunning motion graphics and visual effects for video.",
        },
        {
          title: "3D Rigging and Animation",
          description: "Learn to rig and animate 3D characters and objects.",
        },
        {
          title: "Rendering and Compositing",
          description:
            "Master the art of rendering and compositing for final output.",
        },
      ],
      SMP: [
        {
          title: "IT Service Management Fundamentals",
          description:
            "Understand the principles of IT service management and ITIL framework.",
        },
        {
          title: "Cloud Service Management",
          description:
            "Learn to manage and optimize cloud services for businesses.",
        },
        {
          title: "IT Project Management",
          description: "Apply project management principles to IT projects.",
        },
        {
          title: "Service Desk and Incident Management",
          description:
            "Master the skills for effective service desk operations and incident management.",
        },
        {
          title: "IT Asset Management",
          description:
            "Learn strategies for managing IT assets throughout their lifecycle.",
        },
        {
          title: "Continual Service Improvement",
          description:
            "Implement processes for ongoing improvement of IT services.",
        },
      ],
      NETWORKING: [
        {
          title: "Network Fundamentals",
          description:
            "Understand the basic concepts of computer networks, including topologies, protocols, and the OSI model.",
        },
        {
          title: "TCP-IP and Subnetting",
          description:
            "Master the TCP/IP protocol suite and learn how to perform IP addressing and subnetting.",
        },
        {
          title: "Network Security Essentials",
          description:
            "Learn about common network threats and implement basic security measures to protect networks.",
        },
        {
          title: "Routing and Switching",
          description:
            "Explore the principles of routing and switching, including VLAN configuration and routing protocols.",
        },
        {
          title: "Wireless Networking",
          description:
            "Understand wireless network technologies, standards, and best practices for implementation and security.",
        },
        {
          title: "Network Troubleshooting",
          description:
            "Develop skills to identify, diagnose, and resolve common network issues using various tools and techniques.",
        },
        {
          title: "Cloud Networking",
          description:
            "Learn about cloud networking concepts, architectures, and how to integrate on-premises networks with cloud services.",
        },
        {
          title: "Network Automation and SDN",
          description:
            "Explore network automation tools and Software-Defined Networking (SDN) principles for modern network management.",
        },
      ],
    },
    BSCS: {
      "Graphics and Visualization": [
        {
          title: "Computer Graphics Fundamentals",
          description:
            "Learn the basics of computer graphics and rendering techniques.",
        },
        {
          title: "3D Graphics Programming",
          description:
            "Develop skills in 3D graphics programming using OpenGL or DirectX.",
        },
        {
          title: "Data Visualization Techniques",
          description:
            "Master various techniques for visualizing complex data sets.",
        },
        {
          title: "Virtual Reality Development",
          description:
            "Create immersive VR experiences using modern VR frameworks.",
        },
        {
          title: "Augmented Reality Applications",
          description: "Develop AR applications for mobile and wearable devices.",
        },
        {
          title: "Scientific Visualization",
          description:
            "Learn to create visualizations for scientific and medical data.",
        },
      ],
      "Intelligent Systems": [
        {
          title: "Artificial Intelligence Fundamentals",
          description: "Understand the basics of AI and its applications.",
        },
        {
          title: "Machine Learning Algorithms",
          description: "Learn and implement various machine learning algorithms.",
        },
        {
          title: "Natural Language Processing",
          description:
            "Develop systems that can understand and generate human language.",
        },
        {
          title: "Computer Vision",
          description: "Master techniques for image and video analysis using AI.",
        },
        {
          title: "Robotics and Autonomous Systems",
          description: "Design and program intelligent robotic systems.",
        },
        {
          title: "Deep Learning and Neural Networks",
          description:
            "Explore advanced topics in deep learning and neural networks.",
        },
      ],
    },
    BSIS: {
      BIA: [
        {
          title: "Business Intelligence Fundamentals",
          description:
            "Learn the basics of business intelligence and its applications.",
        },
        {
          title: "Data Warehousing and ETL",
          description: "Design and implement data warehouses and ETL processes.",
        },
        {
          title: "Data Mining Techniques",
          description:
            "Explore various data mining techniques for business insights.",
        },
        {
          title: "Predictive Analytics",
          description:
            "Apply statistical techniques to predict future trends and behaviors.",
        },
        {
          title: "Big Data Analytics",
          description: "Learn to process and analyze large-scale datasets.",
        },
        {
          title: "Business Analytics Visualization",
          description: "Create effective visualizations for business analytics.",
        },
      ],
      ISM: [
        {
          title: "Information Systems Strategy",
          description:
            "Develop strategies for aligning IT with business objectives.",
        },
        {
          title: "Enterprise Architecture",
          description: "Design and manage complex enterprise IT systems.",
        },
        {
          title: "IT Governance and Compliance",
          description:
            "Implement IT governance frameworks and ensure regulatory compliance.",
        },
        {
          title: "Business Process Management",
          description:
            "Analyze and improve business processes using IT solutions.",
        },
        {
          title: "Information Security Management",
          description: "Develop and implement information security strategies.",
        },
        {
          title: "Digital Transformation Strategies",
          description:
            "Lead digital transformation initiatives in organizations.",
        },
      ],
      ERP: [
        {
          title: "ERP Fundamentals",
          description:
            "Understand the basics of Enterprise Resource Planning systems.",
        },
        {
          title: "ERP Implementation Strategies",
          description: "Learn effective strategies for implementing ERP systems.",
        },
        {
          title: "SAP Basics",
          description: "Get started with SAP, a leading ERP software.",
        },
        {
          title: "Oracle E-Business Suite",
          description: "Learn to use and customize Oracle E-Business Suite.",
        },
        {
          title: "ERP for Supply Chain Management",
          description: "Apply ERP concepts to improve supply chain operations.",
        },
        {
          title: "ERP System Integration",
          description:
            "Master techniques for integrating ERP with other business systems.",
        },
      ],
      DM: [
        {
          title: "Database Design Fundamentals",
          description: "Learn the principles of effective database design.",
        },
        {
          title: "SQL and Relational Databases",
          description: "Master SQL for managing relational databases.",
        },
        {
          title: "NoSQL Databases",
          description:
            "Explore non-relational database systems and their applications.",
        },
        {
          title: "Data Modeling Techniques",
          description:
            "Learn various data modeling techniques for complex systems.",
        },
        {
          title: "Database Administration",
          description:
            "Develop skills for managing and maintaining database systems.",
        },
        {
          title: "Data Integration and Migration",
          description:
            "Master strategies for data integration and migration projects.",
        },
      ],
    },
    OOS: {
      "Basic Computer Skills": [
        {
          title: "Computer Basics",
          description:
            "Learn the fundamentals of computer hardware and software.",
        },
        {
          title: "Operating System Essentials",
          description: "Master the basics of using Windows and macOS.",
        },
        {
          title: "File Management and Organization",
          description:
            "Learn effective strategies for managing digital files and folders.",
        },
        {
          title: "Basic Troubleshooting",
          description: "Develop skills to solve common computer problems.",
        },
        {
          title: "Introduction to Word Processing",
          description:
            "Learn to create and edit documents using word processors.",
        },
        {
          title: "Spreadsheet Basics",
          description: "Master the fundamentals of using spreadsheet software.",
        },
      ],
      "Internet and Web Basics": [
        {
          title: "Internet Fundamentals",
          description:
            "Understand how the internet works and its core technologies.",
        },
        {
          title: "Web Browsing and Search Techniques",
          description:
            "Learn effective web browsing and online search strategies.",
        },
        {
          title: "Email Management",
          description:
            "Master email usage, organization, and security best practices.",
        },
        {
          title: "Social Media Basics",
          description: "Learn to use popular social media platforms effectively.",
        },
        {
          title: "Online Privacy and Security",
          description:
            "Understand online privacy issues and learn to protect yourself.",
        },
        {
          title: "Cloud Computing Basics",
          description:
            "Get started with cloud storage and cloud-based applications.",
        },
      ],
      "Digital Literacy": [
        {
          title: "Digital Information Literacy",
          description:
            "Learn to find, evaluate, and use digital information effectively.",
        },
        {
          title: "Digital Communication Tools",
          description:
            "Master various digital communication tools and platforms.",
        },
        {
          title: "Digital Citizenship",
          description:
            "Understand the rights and responsibilities of digital citizens.",
        },
        {
          title: "Basic Content Creation",
          description:
            "Learn to create and edit various types of digital content.",
        },
        {
          title: "Online Collaboration Tools",
          description:
            "Master the use of online collaboration and productivity tools.",
        },
        {
          title: "Digital Problem-Solving",
          description:
            "Develop skills to solve problems using digital tools and resources.",
        },
      ],
      "Cybersecurity Awareness": [
        {
          title: "Cybersecurity Fundamentals",
          description: "Understand basic cybersecurity principles and threats.",
        },
        {
          title: "Password Management and Security",
          description:
            "Learn best practices for creating and managing secure passwords.",
        },
        {
          title: "Safe Web Browsing",
          description: "Master techniques for safe and secure web browsing.",
        },
        {
          title: "Phishing and Social Engineering Awareness",
          description:
            "Learn to identify and avoid phishing and social engineering attacks.",
        },
        {
          title: "Mobile Device Security",
          description:
            "Understand security risks and best practices for mobile devices.",
        },
        {
          title: "Data Privacy and Protection",
          description:
            "Learn how to protect your personal data in the digital world.",
        },
      ],
    },
  };

  // Add course URLs to your coursesData object
  const courseUrls = {
    BSIT: {
        WMAD: "https://www.coursera.org/specializations/web-design",
        AMG: "https://www.coursera.org/specializations/animation-design",
        SMP: "https://www.coursera.org/professional-certificates/it-support",
        NETWORKING: "https://www.coursera.org/specializations/networking-basics"
    },
    BSCS: {
        "Graphics and Visualization": "https://www.coursera.org/specializations/computer-graphics",
        "Intelligent Systems": "https://www.coursera.org/specializations/artificial-intelligence"
    },
    BSIS: {
        BIA: "https://www.coursera.org/specializations/business-analytics",
        ISM: "https://www.coursera.org/specializations/information-systems",
        ERP: "https://www.coursera.org/specializations/enterprise-systems",
        DM: "https://www.coursera.org/specializations/database-systems"
    },
    OOS: {
        "Basic Computer Skills": "https://www.coursera.org/specializations/computer-basics",
        "Internet and Web Basics": "https://www.w3schools.com",
        "Digital Literacy": "https://www.coursera.org/specializations/digital-literacy",
        "Cybersecurity Awareness": "https://www.coursera.org/specializations/cyber-security-awareness"
    }
  };

  let currentProgram = "BSIT";
  let currentMajor = "WMAD";
  let currentCardIndex = 0;

  function updateMajors() {
    const majorsContainer = document.getElementById("majors");
    majorsContainer.innerHTML = "";

    Object.keys(coursesData[currentProgram]).forEach((major, index) => {
      const button = document.createElement("button");
      button.textContent = major;
      button.classList.add("major-btn");
      if (index === 0) {
        button.classList.add("active");
        currentMajor = major;
      }
      button.addEventListener("click", () => selectMajor(major));
      majorsContainer.appendChild(button);
    });

    updateCourseContent();
    updateCourseCards();
  }

  function updateMajorImage() {
    const majorImage = document.getElementById("major-image");
    majorImage.src = `../public/images/${currentMajor.toLowerCase().replace(/ /g, "-")}.png`;
    majorImage.alt = `${currentMajor} Image`;
  }

  function updateCourseCards() {
    const courseCards = document.getElementById("course-cards");
    courseCards.innerHTML = "";
    currentCardIndex = 0;

    coursesData[currentProgram][currentMajor].forEach((course) => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        card.classList.add("fade-in");
        
        const courseImageName = course.title
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')  
        .replace(/-+/g, '-')           
        .replace(/^-|-$/g, '')        
        .replace(/\.+/g, '.') 
        .replace(/^\.|\.$/, '');  
            
        card.innerHTML = `
            <div class="image-wrapper">
                <div class="image-placeholder"></div>
                <img src="/public/images/${courseImageName}.png" 
                     alt="${course.title}" 
                     onerror="this.src='/public/images/default-course.png'"
                     loading="lazy"
                     onload="this.classList.add('loaded')">
            </div>
            <div class="card-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
            </div>
        `;
        courseCards.appendChild(card);
    });

    updateCardVisibility();
  }

  function selectProgram(program) {
    currentProgram = program;
    document
      .querySelectorAll(".program-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document.querySelector(`[data-program="${program}"]`).classList.add("active");
    updateMajors();
  }

  function selectMajor(major) {
    currentMajor = major;
    document
      .querySelectorAll(".major-btn")
      .forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
    updateCourseContent();
    updateCourseCards();
    updateMajorImage();
  }

  function updateCourseContent() {
    document.getElementById(
      "skill-courses-title"
    ).textContent = `${currentMajor} Courses`;
    document.getElementById(
      "skill-courses-description"
    ).textContent = `Explore our curated selection of ${currentMajor} courses designed to enhance your skills and advance your career in ${currentProgram}.`;
    
    // Add click event listener to Learn More button
    const learnMoreBtn = document.getElementById("learn-more");
    learnMoreBtn.onclick = () => {
        const courseUrl = courseUrls[currentProgram][currentMajor];
        if (courseUrl) {
            window.open(courseUrl, '_blank');
        }
    };
  }

  function updateCardVisibility() {
    const cards = document.querySelectorAll(".course-card");
    cards.forEach((card, index) => {
      if (index >= currentCardIndex && index < currentCardIndex + 3) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Add smooth scrolling for course navigation
  function smoothScroll(element, change) {
    const start = element.scrollLeft;
    const target = start + change;
    const duration = 500; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        element.scrollLeft = start + (target - start) * easeProgress;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
  }

  // Update navigation functions
  function nextCard() {
    const cards = document.querySelectorAll(".course-card");
    if (currentCardIndex < cards.length - 3) {
        currentCardIndex++;
        smoothScroll(document.getElementById("course-cards"), 340); // Adjust value based on card width + gap
        updateCardVisibility();
    }
  }

  function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        smoothScroll(document.getElementById("course-cards"), -340); // Adjust value based on card width + gap
        updateCardVisibility();
    }
  }

  document.querySelectorAll(".program-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectProgram(btn.getAttribute("data-program"))
    );
  });

  document.getElementById("next-btn").addEventListener("click", nextCard);
  document.getElementById("prev-btn").addEventListener("click", prevCard);

  // Initialize the page
  updateMajors();
  updateMajorImage();