// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const langToggle = document.getElementById('langToggle');
const contactForm = document.getElementById('contactForm');
const heroSection = document.querySelector('.hero');
const heroSlideshow = document.querySelector('.hero-slideshow');
const headerEl = document.querySelector('.header');

// Create and add backdrop for mobile menu
const menuBackdrop = document.createElement('div');
menuBackdrop.className = 'menu-backdrop';
document.body.appendChild(menuBackdrop);

// Dynamic viewport height for mobile (full-bleed hero)
const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const setHeaderH = () => {
    const h = headerEl ? headerEl.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
};

const updateViewportVars = () => {
    setVh();
    setHeaderH();
};

updateViewportVars();
window.addEventListener('resize', updateViewportVars, { passive: true });
window.addEventListener('orientationchange', () => setTimeout(updateViewportVars, 100));
window.addEventListener('load', updateViewportVars);

// Current language state
let currentLang = 'ja';

// Mobile Menu Toggle
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navList.classList.toggle('active');
    menuBackdrop.classList.toggle('active');

    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    if (navList.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking backdrop
menuBackdrop.addEventListener('click', () => {
    navList.classList.remove('active');
    menuBackdrop.classList.remove('active');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        menuBackdrop.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth Scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Language Toggle
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ja' ? 'en' : 'ja';
    updateLanguage();
});

function updateLanguage() {
    const elements = document.querySelectorAll('[data-ja][data-en]');

    elements.forEach(element => {
        const jaText = element.getAttribute('data-ja');
        const enText = element.getAttribute('data-en');

        // Update text content or placeholder depending on element type
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = currentLang === 'ja' ? jaText : enText;
        } else if (element.tagName === 'BUTTON') {
            element.textContent = currentLang === 'ja' ? jaText : enText;
        } else {
            element.textContent = currentLang === 'ja' ? jaText : enText;
        }
    });

    // Update language toggle active state
    const langJa = document.querySelector('.lang-ja');
    const langEn = document.querySelector('.lang-en');

    if (currentLang === 'ja') {
        langJa.classList.add('active');
        langEn.classList.remove('active');
        document.documentElement.lang = 'ja';
    } else {
        langJa.classList.remove('active');
        langEn.classList.add('active');
        document.documentElement.lang = 'en';
    }
}

// Hero background slideshow
if (heroSlideshow) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Default images representing services (AI, IoT, Development, Cloud/Business)
    const heroImages = [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=60', // AI
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1920&q=60', // IoT
        'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1920&q=60', // Development
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=60'  // Cloud/Infra
    ];

    const slides = heroImages.map((url, idx) => {
        const div = document.createElement('div');
        div.className = 'hero-slide' + (idx === 0 ? ' active' : '');
        div.style.backgroundImage = `url("${url}")`;
        heroSlideshow.appendChild(div);
        return div;
    });

    if (!prefersReducedMotion && slides.length > 1) {
        let current = 0;
        const intervalMs = Number(heroSection?.dataset.interval) || 7000;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, intervalMs);
    }
}

// Contact Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const company = document.getElementById('company').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage(
                currentLang === 'ja' ?
                '有効なメールアドレスを入力してください。' :
                'Please enter a valid email address.',
                'error'
            );
            return;
        }

        // Validate required fields
        if (!name || !email || !message) {
            showMessage(
                currentLang === 'ja' ?
                '必須項目をすべて入力してください。' :
                'Please fill in all required fields.',
                'error'
            );
            return;
        }

        // Simulate form submission (replace with actual API call)
        showMessage(
            currentLang === 'ja' ?
            'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。' :
            'Thank you for your inquiry. We will get back to you soon.',
            'success'
        );

        // Reset form
        contactForm.reset();
    });

    // Show message function
    function showMessage(text, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 6px;
            font-weight: 500;
            animation: fadeIn 0.3s ease;
            ${type === 'success' ?
                'background-color: #d1fae5; color: #065f46; border: 1px solid #10b981;' :
                'background-color: #fee2e2; color: #991b1b; border: 1px solid #ef4444;'}
        `;

        contactForm.appendChild(message);

        // Remove message after 5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
}

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Scroll Reveal Animation (services + features)
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
};

const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const card = entry.target;
        // Card final state
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.filter = 'blur(0)';
        card.style.willChange = 'auto';

        // Animate inner parts with slight extra stagger
        const icon = card.querySelector('.service-icon');
        const title = card.querySelector('.service-title');
        const desc = card.querySelector('.service-description');
        if (icon) {
            requestAnimationFrame(() => {
                icon.style.opacity = '1';
                icon.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        }
        if (title) {
            requestAnimationFrame(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            });
        }
        if (desc) {
            requestAnimationFrame(() => {
                desc.style.opacity = '1';
                desc.style.transform = 'translateY(0)';
            });
        }

        obs.unobserve(card);
    });
}, observerOptions);

// Staggered, emphasized reveal for service cards
const serviceCards = document.querySelectorAll('.services .service-card');
serviceCards.forEach((el, idx) => {
    // Card initial state (stronger emphasis)
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px) scale(0.96)';
    el.style.filter = 'blur(6px)';
    el.style.transition = [
        'opacity 900ms ease',
        'transform 900ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'filter 700ms ease'
    ].join(', ');
    el.style.transitionDelay = `${idx * 120}ms`;
    el.style.willChange = 'opacity, transform, filter';

    // Inner parts initial state
    const icon = el.querySelector('.service-icon');
    const title = el.querySelector('.service-title');
    const desc = el.querySelector('.service-description');
    if (icon) {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(10px) scale(0.9) rotate(-3deg)';
        icon.style.transition = 'opacity 700ms ease, transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1.2)';
        icon.style.transitionDelay = `${idx * 120 + 150}ms`;
        icon.style.willChange = 'opacity, transform';
    }
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(10px)';
        title.style.transition = 'opacity 650ms ease, transform 650ms ease';
        title.style.transitionDelay = `${idx * 120 + 200}ms`;
        title.style.willChange = 'opacity, transform';
    }
    if (desc) {
        desc.style.opacity = '0';
        desc.style.transform = 'translateY(12px)';
        desc.style.transition = 'opacity 650ms ease, transform 650ms ease';
        desc.style.transitionDelay = `${idx * 120 + 260}ms`;
        desc.style.willChange = 'opacity, transform';
    }

    revealObserver.observe(el);
});

// Subtle reveal for about features (no stagger needed)
const features = document.querySelectorAll('.about .feature');
features.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.willChange = 'opacity, transform';
    revealObserver.observe(el);
});

// Reveal: tech stack cards + chips
const stackCards = document.querySelectorAll('.stack .stack-card');
stackCards.forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px) scale(0.98)';
    card.style.transition = 'opacity 800ms ease, transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    card.style.transitionDelay = `${idx * 100}ms`;
    revealObserver.observe(card);

    const chips = card.querySelectorAll('.chip');
    chips.forEach((chip, cIdx) => {
        chip.style.opacity = '0';
        chip.style.transform = 'translateY(8px)';
        chip.style.transition = 'opacity 500ms ease, transform 500ms ease';
        chip.style.transitionDelay = `${idx * 100 + 150 + cIdx * 60}ms`;
        revealObserver.observe(chip);
    });
});

// Reveal: pricing models (merged layout)
const pricingModels = document.querySelectorAll('.pricing .pricing-model');
pricingModels.forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 700ms ease, transform 700ms ease';
    card.style.transitionDelay = `${idx * 120}ms`;
    revealObserver.observe(card);
});

// Active Navigation Highlight on Scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) {
        navList.classList.remove('active');
        menuBackdrop.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Initialize form placeholders
function initializeFormPlaceholders() {
    const formInputs = contactForm.querySelectorAll('[data-ja][data-en]');
    formInputs.forEach(input => {
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                // Keep labels as is, they will be updated by language toggle
            }
        }
    });
}

// Initialize
initializeFormPlaceholders();

// Prevent horizontal scroll
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflowX = 'hidden';
});
