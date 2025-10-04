// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const langToggle = document.getElementById('langToggle');
const contactForm = document.getElementById('contactForm');

// Create and add backdrop for mobile menu
const menuBackdrop = document.createElement('div');
menuBackdrop.className = 'menu-backdrop';
document.body.appendChild(menuBackdrop);

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

// Contact Form Validation and Submission
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

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and features
const animateElements = document.querySelectorAll('.service-card, .feature');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
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
