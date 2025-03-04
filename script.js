document.addEventListener("DOMContentLoaded", function () {
    // Initialize scroll reveal with enhanced options
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Add animation classes based on data attributes
                if (entry.target.dataset.animation) {
                    entry.target.style.animation = `${entry.target.dataset.animation} 0.8s ease forwards`;
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach((element) => {
        observer.observe(element);
    });

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
    });

    // Scroll to Top Button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Parallax Effect for Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Enhanced Navigation
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Smooth Scroll with Enhanced Animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Attempt to load the JSON file
    fetch('candidatedata.json')
      .then(response => {
        // Check if the fetch was successful
        if (!response.ok) {
          throw new Error('Failed to fetch candidate data');
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error('No data available');
        }
  
        // Set profile picture and name
        const profilePicture = document.getElementById('profile-picture');
        if (profilePicture) {
          profilePicture.src = data.profile_picture || './assets/profile_picture/default.jpg';
        }
        
        const nameElement = document.getElementById('name');
        if (nameElement) {
          nameElement.textContent = data.name || 'Name not available';
        }
        
        const taglineElement = document.getElementById('tagline');
        if (taglineElement) {
          taglineElement.textContent = data.tagline || 'Tagline not available';
        }
  
        // Set about me
        const aboutMeElement = document.getElementById('about-me');
        if (aboutMeElement) {
          aboutMeElement.textContent = data.about_me || 'About me not available';
        }
  
        // Set skills
        const skillsList = document.getElementById('skills-list');
        if (skillsList && data.skills) {
          // Define category icons
          const categoryIcons = {
            'Languages': 'fas fa-code',
            '3D Modeling Tools': 'fas fa-cube',
            'Data Management': 'fas fa-database',
            'Tools': 'fas fa-tools',
            'Frontend Framework': 'fas fa-paint-brush',
            'Backend Development': 'fas fa-server',
            'Version Control': 'fas fa-code-branch'
          };

          // Define skill icons
          const skillIcons = {
            // Languages
            'C': 'fas fa-code',
            'Python': 'fab fa-python',
            'Java': 'fab fa-java',
            
            // 3D Modeling Tools
            'Meshy API': 'fas fa-cube',
            
            // Data Management
            'Data Tabulation': 'fas fa-table',
            'Data Validation': 'fas fa-check-circle',
            
            // Tools
            'Quantum': 'fas fa-atom',
            'Jupyter Notebook': 'fas fa-book',
            'Colab notebook': 'fab fa-google',
            'Visual Studio Code': 'fas fa-code',
            
            // Frontend Framework
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'ReactJS': 'fab fa-react',
            
            // Backend Development
            'Node': 'fab fa-node-js',
            'ExpressJS': 'fas fa-server',
            
            // Version Control
            'GitHub': 'fab fa-github'
          };

          Object.keys(data.skills).forEach(category => {
            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';
            
            // Add category header with icon
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            const categoryIcon = document.createElement('i');
            categoryIcon.className = categoryIcons[category] || 'fas fa-code';
            categoryHeader.innerHTML = `
              <i class="${categoryIcon.className}"></i>
              <h3>${category}</h3>
            `;
            skillCategory.appendChild(categoryHeader);
            
            // Add skills list
            const skillTags = document.createElement('ul');
            data.skills[category].forEach(skill => {
              const skillItem = document.createElement('li');
              const skillIcon = document.createElement('i');
              skillIcon.className = skillIcons[skill] || 'fas fa-check';
              skillItem.innerHTML = `
                <i class="${skillIcon.className}"></i>
                <span>${skill}</span>
              `;
              skillTags.appendChild(skillItem);
            });
            skillCategory.appendChild(skillTags);
            skillsList.appendChild(skillCategory);
          });
        }
  
        // Set projects
        const projectsList = document.getElementById('projects-list');
        if (projectsList && data.projects) {
        data.projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-card';
            projectDiv.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
              <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
              <a href="${project.link}" target="_blank" class="btn">View Project</a>
            `;
            projectsList.appendChild(projectDiv);
          });
        }
  
        // Set experience
        const experienceList = document.getElementById('experience-list');
        if (experienceList && data.experience) {
          data.experience.forEach(job => {
            const jobDiv = document.createElement('div');
            jobDiv.className = 'experience-card';
            jobDiv.innerHTML = `
              <h3>${job.title} at ${job.company}</h3>
              <p class="duration">${job.duration}</p>
              <ul>
                ${job.responsibilities.map(res => `<li>${res}</li>`).join('')}
              </ul>
            `;
            experienceList.appendChild(jobDiv);
          });
        }
  
        // Set education
        const educationDetails = document.getElementById('education-details');
        if (educationDetails && data.education) {
          educationDetails.innerHTML = `
            <div class="education-item">
              <div class="education-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
              <div class="education-content">
                <h3>${data.education.degree}</h3>
                <div class="education-details">
                  <p><i class="fas fa-university"></i> <strong>Institution:</strong> ${data.education.institution}</p>
                  <p><i class="fas fa-calendar-alt"></i> <strong>Year:</strong> ${data.education.year}</p>
                </div>
                </div>
            </div>
        `;
        }
  
        // Set publications
        const publicationsList = document.getElementById('publications-list');
        if (publicationsList && data.publications) {
          data.publications.forEach(publication => {
            const publicationDiv = document.createElement('div');
            publicationDiv.className = 'publication-card';
            publicationDiv.innerHTML = `
              <h3>${publication.title}</h3>
              <p><strong>Authors:</strong> ${publication.authors}</p>
              <a href="${publication.link}" target="_blank" class="btn">Read Publication</a>
            `;
            publicationsList.appendChild(publicationDiv);
          });
        }
  
        // Set contact info
        const emailElement = document.getElementById('email');
        if (emailElement && data.contact) {
          emailElement.href = `mailto:${data.contact.email}`;
          emailElement.textContent = data.contact.email;
        }
        
        const phoneElement = document.getElementById('phone');
        if (phoneElement && data.contact) {
          phoneElement.textContent = data.contact.phone;
        }
        
        const linkedinElement = document.getElementById('linkedin');
        if (linkedinElement && data.contact) {
          linkedinElement.href = data.contact.linkedin;
        }
        
        const githubElement = document.getElementById('github');
        if (githubElement && data.contact) {
          githubElement.href = data.contact.github;
        }
  
        // Set resume link
        const resumeLink = document.getElementById('resume-link');
        if (resumeLink && data.resume_link) {
          resumeLink.href = data.resume_link;
          resumeLink.textContent = "Download Resume";
        }
      })
      .catch(error => {
        console.error('Error loading data:', error);
        alert('There was an error loading your data. Please check the console for details.');
      });
  });
  
// Navigation and Dark Mode
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Dark Mode Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });

    // Form Validation
    const contactForm = document.getElementById('contact-form');
    const formGroups = contactForm.querySelectorAll('.form-group');

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        input.classList.add('error');
        input.classList.remove('success');
    }

    function showSuccess(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        input.classList.remove('error');
        input.classList.add('success');
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        input.classList.remove('error', 'success');
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset previous errors
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            clearError(input);
        });

        // Validate name
        const nameInput = contactForm.querySelector('#name');
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters long');
            isValid = false;
        } else {
            showSuccess(nameInput);
        }

        // Validate email
        const emailInput = contactForm.querySelector('#email');
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }

        // Validate message
        const messageInput = contactForm.querySelector('#message');
        if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters long');
            isValid = false;
        } else {
            showSuccess(messageInput);
        }

        if (isValid) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                // Here you would typically send the form data to a server
                // For now, we'll simulate a delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            } catch (error) {
                // Show error message
                submitButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error Sending';
                console.error('Error sending message:', error);
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        }
    });

    // Add input event listeners for real-time validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        input.addEventListener('input', () => {
            clearError(input);
            
            if (input === nameInput) {
                if (input.value.trim().length < 2) {
                    showError(input, 'Name must be at least 2 characters long');
                } else {
                    showSuccess(input);
                }
            } else if (input === emailInput) {
                if (!validateEmail(input.value)) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    showSuccess(input);
                }
            } else if (input === messageInput) {
                if (input.value.trim().length < 10) {
                    showError(input, 'Message must be at least 10 characters long');
                } else {
                    showSuccess(input);
                }
            }
        });
    });
});
