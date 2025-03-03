document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("candidatedata.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Initialize containers
        const experienceContainer = document.querySelector(".experience-container");
        const educationContainer = document.getElementById("education-container");
        const publicationsContainer = document.querySelector(".publications-container");

        if (!experienceContainer || !educationContainer || !publicationsContainer) {
            console.error("One or more container elements not found!");
            return;
        }

        // Candidate's Basic Information
        document.getElementById("name").textContent = data.name;
        document.getElementById("tagline").textContent = data.tagline;
        document.getElementById("profile-picture").src = data.profile_picture;
        document.getElementById("about").textContent = data.about_me;

        // Clear existing content
        experienceContainer.innerHTML = '';
        educationContainer.innerHTML = '';
        publicationsContainer.innerHTML = '';

        // Skills
        const skillsContainer = document.querySelector(".skills-container");
        for (const category in data.skills) {
            const categoryDiv = document.createElement("div");
            categoryDiv.className = "skills-category reveal";
            
            // Get appropriate icon for each category
            const iconClass = getIconForCategory(category);
            
            const categoryTitle = document.createElement("h3");
            categoryTitle.innerHTML = `<i class="${iconClass} icon"></i>${category}`;
            categoryDiv.appendChild(categoryTitle);

            const skillList = document.createElement("div");
            skillList.className = "skills-list";
            
            data.skills[category].forEach(skill => {
                const skillSpan = document.createElement("span");
                skillSpan.className = "hover-lift";
                skillSpan.innerHTML = `<i class="${getIconForSkill(skill)} tech-icon"></i>${skill}`;
                skillList.appendChild(skillSpan);
            });
            
            categoryDiv.appendChild(skillList);
            skillsContainer.appendChild(categoryDiv);
        }

        // Projects Section
        const projectsContainer = document.querySelector(".projects-container");
        data.projects.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.className = "reveal hover-lift";
            projectCard.innerHTML = `
                <div class="icon-circle">
                    <i class="fas fa-code-branch"></i>
                </div>
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <p><strong><i class="fas fa-tools"></i> Technologies:</strong> ${project.technologies.join(", ")}</p>
                <a href="${project.link}" target="_blank" class="btn">
                    <i class="fas fa-external-link-alt"></i> View Project
                </a>
            `;
            projectsContainer.appendChild(projectCard);
        });

        // Experience Section
        data.experience.forEach((exp, index) => {
            const expItem = document.createElement("div");
            expItem.className = "experience-card reveal hover-lift";
            expItem.style.animationDelay = `${index * 0.2}s`;

            const responsibilitiesList = exp.responsibilities.map(res => 
                `<li>
                    <i class="fas fa-check-circle"></i>
                    <span>${res}</span>
                </li>`
            ).join("");

            expItem.innerHTML = `
                <div class="experience-header">
                    <div class="icon-circle">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div class="experience-title">
                        <h3>${exp.title}</h3>
                        <p class="company-info">
                            <span><i class="fas fa-building"></i> ${exp.company}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${exp.duration}</span>
                        </p>
                    </div>
                </div>
                <div class="experience-content">
                    <h4><i class="fas fa-tasks"></i> Key Responsibilities:</h4>
                    <ul class="responsibilities">${responsibilitiesList}</ul>
                </div>
            `;
            experienceContainer.appendChild(expItem);
        });

        // Education Section
        const educationData = data.education;
        educationContainer.className = "education-card reveal hover-lift";
        educationContainer.innerHTML = `
            <div class="education-header">
                <div class="icon-circle">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="education-title">
                    <h3>${educationData.degree}</h3>
                    <div class="education-info">
                        <span><i class="fas fa-university"></i> ${educationData.institution}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${educationData.year}</span>
                    </div>
                </div>
            </div>
        `;

        // Publications Section
        data.publications.forEach((pub, index) => {
            const publicationCard = document.createElement("div");
            publicationCard.className = "publication-card reveal hover-lift";
            publicationCard.style.animationDelay = `${index * 0.2}s`;
            publicationCard.innerHTML = `
                <div class="publication-header">
                    <div class="icon-circle">
                        <i class="fas fa-book"></i>
                    </div>
                    <h4>${pub.title}</h4>
                </div>
                <div class="publication-content">
                    <p class="authors">
                        <i class="fas fa-users"></i>
                        <strong>Authors:</strong> ${pub.authors}
                    </p>
                    <a href="${pub.link}" target="_blank" class="btn publication-btn">
                        <i class="fas fa-external-link-alt"></i> Read Publication
                    </a>
                </div>
            `;
            publicationsContainer.appendChild(publicationCard);
        });

        // Contact Information
        document.getElementById("email").href = `mailto:${data.contact.email}`;
        document.getElementById("phone").href = `tel:${data.contact.phone}`;
        document.getElementById("linkedin").href = data.contact.linkedin;
        document.getElementById("github").href = data.contact.github;

        // Dark Mode Toggle
        const themeToggle = document.getElementById("theme-toggle");
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
        });

        // Initialize scroll reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach((element) => {
            observer.observe(element);
        });

    } catch (error) {
        console.error('Error loading or processing data:', error);
    }

    // Helper function to get appropriate icon for skill categories
    function getIconForCategory(category) {
        const iconMap = {
            'Languages': 'fas fa-code',
            '3D Modeling Tools': 'fas fa-cube',
            'Data Management': 'fas fa-database',
            'Tools': 'fas fa-tools',
            'Frontend Framework': 'fas fa-laptop-code',
            'Backend Development': 'fas fa-server',
            'Version Control': 'fab fa-git-alt'
        };
        return iconMap[category] || 'fas fa-star';
    }

    // Helper function to get appropriate icon for individual skills
    function getIconForSkill(skill) {
        const iconMap = {
            'Python': 'fab fa-python',
            'Java': 'fab fa-java',
            'ReactJS': 'fab fa-react',
            'Node': 'fab fa-node-js',
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'GitHub': 'fab fa-github',
            'ExpressJS': 'fab fa-node-js',
            // Add more mappings as needed
        };
        return iconMap[skill] || 'fas fa-code';
    }
});
