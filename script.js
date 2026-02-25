/* ═══════════════════════════════════════════════
   AVIATOR — Modern Redesign
   JavaScript: Animations & Interactions
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initRevealAnimations();
    initMobileNav();
    initSmoothScroll();
    initCounterAnimation();
    initClientsCarousel();
    init3DTiltEffect();
});

/* ── Infinite looping clients carousel ── */
function initClientsCarousel() {
    const track = document.querySelector('.clients-track');
    if (!track) return;

    let position = 0;
    let speed = 0.5; // pixels per frame
    let paused = false;
    let halfWidth = 0;

    function measure() {
        // Each "set" is half the total width (we duplicated the cards)
        halfWidth = track.scrollWidth / 2;
    }

    measure();
    window.addEventListener('resize', measure);

    // Pause on hover
    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });

    function animate() {
        if (!paused) {
            position += speed;
            // Reset when we've scrolled past the first set (seamless loop)
            if (position >= halfWidth) {
                position -= halfWidth;
            }
            track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

/* ── Navbar scroll effect ── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ── Scroll reveal animations ── */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    reveals.forEach((el) => observer.observe(el));
}

/* ── Mobile navigation ── */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        // Animate hamburger
        const spans = toggle.querySelectorAll('span');
        if (links.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close nav on link click
    links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            links.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const targetId = a.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = 80; // navbar height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

/* ── Counter animation for stats ── */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ── 3D Image Interactive Hover Effect ── */
function init3DTiltEffect() {
    const tiltElements = document.querySelectorAll('.page-image img, .workshop-gallery-item, .service-card, .gallery-item, .about-image img');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', handleTilt);
        el.addEventListener('mouseleave', resetTilt);
        // Add a class for base transition
        el.style.willChange = 'transform';
    });

    function handleTilt(e) {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();

        // Calculate mouse position relative to the element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentages from the center (-1 to 1)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation vertically
        const rotateY = ((x - centerX) / centerX) * 10;  // Max 10 deg rotation horizontally

        // Apply transform
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        el.style.transition = 'transform 0.1s ease-out';
        el.style.zIndex = '10';

        if (el.classList.contains('service-card') || el.classList.contains('workshop-gallery-item')) {
            el.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(0, 0, 0, 0.4)`;
        }
    }

    function resetTilt(e) {
        const el = e.currentTarget;
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        el.style.transition = 'transform 0.5s ease-out';
        el.style.zIndex = '1';

        if (el.classList.contains('service-card') || el.classList.contains('workshop-gallery-item')) {
            el.style.boxShadow = '';
        }
    }
}
