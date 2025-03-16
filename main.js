// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-toggle i');
    const html = document.documentElement;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');
    
    // Theme toggle handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === 'dark');
    });
});

// Helper function to update theme icon
function updateThemeIcon(isDark) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Navigation smooth scroll
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    
    if (!contactForm || !formAlert) {
        console.error('Contact form elements not found');
        return;
    }

    function showLoading(loading) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = loading;
            submitButton.innerHTML = loading ? 
                '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...' : 
                'Send Message';
        }
    }

    function showAlert(message, isSuccess) {
        if (formAlert) {
            formAlert.textContent = message;
            formAlert.classList.remove('d-none', 'alert-success', 'alert-danger');
            formAlert.classList.add(isSuccess ? 'alert-success' : 'alert-danger');
        }
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showLoading(true);

        const serviceId = '${process.env.EMAILJS_SERVICE_ID}';
        const templateId = '${process.env.EMAILJS_TEMPLATE_ID}';

        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        emailjs.send(serviceId, templateId, templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                showAlert('Your message has been sent successfully!', true);
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                showAlert('Failed to send message. Please try again later.', false);
            })
            .finally(function() {
                showLoading(false);
            });
    });
});
