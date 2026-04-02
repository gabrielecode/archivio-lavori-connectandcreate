document.addEventListener('DOMContentLoaded', () => {
    // Header & Back to Top behavior on scroll
    const header = document.querySelector('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Header
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
            header.style.padding = '15px 0';
        }

        // Back to top
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Form submission handler with validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formValidator = initFormValidator('.contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!formValidator.validateAll()) {
                showNotification('Per favore, compila tutti i campi correttamente', 'error');
                return;
            }
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Inviando...';
            btn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                const data = formValidator.getFormData();
                showNotification(`Grazie ${data.name}! Il tuo messaggio è stato inviato con successo.`, 'success');
                formValidator.reset();
                
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Track items for animation
    const animateItems = document.querySelectorAll('.product-card, .review-card, .story-text, .story-img, .section-title');
    animateItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.8s ease-out';
        observer.observe(item);
    });
});
