// Animations avancées pour la landing page

// Animation des compteurs (métriques)
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animation au scroll avec Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Délai progressif pour créer un effet de cascade
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer tous les éléments à animer
    const animatedElements = document.querySelectorAll('.card, .testimonial, .pricing-card, .highlight-card, .demo-card');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Parallax subtil pour le hero
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Animation du header au scroll
function initHeaderAnimation() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Ajouter une ombre au header quand on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// Effet de typing pour le titre (optionnel)
function initTypingEffect() {
    const gradientText = document.querySelector('.hero h1 .gradient-text');
    if (!gradientText) return;

    const text = gradientText.textContent;
    gradientText.textContent = '';
    gradientText.style.opacity = '1';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            gradientText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };

    // Démarrer après un court délai
    setTimeout(typeWriter, 500);
}

// Animation de rotation douce pour les logos/icônes
function initIconAnimations() {
    const icons = document.querySelectorAll('.demo-card-icon');

    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Effet de cursor personnalisé (optionnel, très moderne)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation fluide du curseur
    const animateCursor = () => {
        const delay = 0.1;

        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;

        followerX += (mouseX - followerX) * (delay * 0.5);
        followerY += (mouseY - followerY) * (delay * 0.5);

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        requestAnimationFrame(animateCursor);
    };

    // Activer uniquement sur desktop
    if (window.innerWidth > 768) {
        animateCursor();
    }

    // Agrandir au survol des liens
    const links = document.querySelectorAll('a, button, .cta-primary, .cta-secondary');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Smooth scroll pour les ancres
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initialisation des animations...');

    // Animations de base
    initScrollAnimations();
    initHeaderAnimation();
    initSmoothScroll();
    initIconAnimations();

    // Animations optionnelles (décommenter si souhaité)
    // initParallax(); // Peut ralentir sur mobile
    // initTypingEffect(); // Effet "typewriter" sur le titre
    // initCustomCursor(); // Curseur personnalisé (très moderne)

    console.log('✅ Animations chargées');
});

// Animation des métriques au scroll
const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricCards = entry.target.querySelectorAll('.metric-card strong');
            metricCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 150);
            });
            metricsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const heroMetrics = document.querySelector('.hero-metrics');
    if (heroMetrics) {
        metricsObserver.observe(heroMetrics);
    }
});
