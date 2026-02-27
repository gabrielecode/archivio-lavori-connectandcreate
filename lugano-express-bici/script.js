// 1. SCROLL REVEAL (Lightship + Architect Precision)
const initScrollReveal = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animation has triggered
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => revealObserver.observe(el));
};

// 2. HEADER TRANSITIONS (Scrolled state for readability)
const initHeaderScroll = () => {
    const header = document.querySelector('.main-header');

    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
};

// 3. SMOOTH SCROLL (Navigation Hierarchy)
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = 80;
                const offsetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// 4. HERO PARALLAX (Cinematic Depth)
const initHeroParallax = () => {
    const heroMedia = document.querySelector('.media-placeholder');
    if (!heroMedia) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            // Very subtle scale and translate
            const val = 1.1 - (scrolled * 0.0001);
            const transl = scrolled * 0.15;
            heroMedia.style.transform = `scale(${val > 1 ? val : 1}) translateY(${transl}px)`;
            heroMedia.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }, { passive: true });
};

// 5. FORM SUBMISSION HANDLING
const initFormHandling = () => {
    const form = document.getElementById('express-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple visual feedback
        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerText;

        submitBtn.innerText = 'Inviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert(`Grazie ${data.name}! La tua richiesta per il servizio ${data.service} è stata ricevuta. Ti contatteremo a breve.`);
            form.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
};

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initHeaderScroll();
    initSmoothScroll();
    initHeroParallax();
    initFormHandling();
});
