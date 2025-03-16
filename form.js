document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    function updateTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        const themeIcon = document.querySelector('.theme-toggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Update theme-specific styles
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--bs-body-bg', '#212529');
            document.documentElement.style.setProperty('--bs-body-color', '#f8f9fa');
            document.documentElement.style.setProperty('--hero-gradient-start', '#1a1a1a');
            document.documentElement.style.setProperty('--hero-gradient-end', '#2c4a7c');
        } else {
            document.documentElement.style.setProperty('--bs-body-bg', '#ffffff');
            document.documentElement.style.setProperty('--bs-body-color', '#212529');
            document.documentElement.style.setProperty('--hero-gradient-start', '#e9ecef');
            document.documentElement.style.setProperty('--hero-gradient-end', '#c8d6e5');
        }
    }

    // Theme toggle handler
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        updateTheme(newTheme);
    });

    // Initial theme setup
    updateTheme(savedTheme);

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return; // Skip empty or # anchors
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                const menuToggle = document.getElementById('navbarNav');
                if (menuToggle && menuToggle.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(menuToggle);
                    bsCollapse.hide();
                }
            }
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href !== '#' && href.startsWith('#')) {
                const sectionId = href.substring(1);
                if (sectionId === current) {
                    link.classList.add('active');
                }
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Display success message (in a real application, you would send this data to a server)
            alert('Thanks for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});
