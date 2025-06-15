// DOM Elements
const heroCTA = document.getElementById('hero-cta');
const finalCTA = document.getElementById('final-cta');
const pricingCTAs = document.querySelectorAll('.pricing-cta');
const contactModal = document.getElementById('contact-modal');
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');
const successClose = document.getElementById('success-close');
const contactForm = document.getElementById('contact-form');
const packageSelect = document.getElementById('package');

// Modal Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeAllModals() {
    contactModal.classList.remove('active');
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners for CTA Buttons
heroCTA.addEventListener('click', () => {
    openModal(contactModal);
});

finalCTA.addEventListener('click', () => {
    openModal(contactModal);
});

// Pricing CTA Buttons
pricingCTAs.forEach((cta, index) => {
    cta.addEventListener('click', () => {
        // Pre-select package based on button clicked
        const packages = ['essencial', 'avancado', 'continua'];
        packageSelect.value = packages[index];
        openModal(contactModal);
    });
});

// Modal Close Events
modalClose.addEventListener('click', () => {
    closeModal(contactModal);
});

successClose.addEventListener('click', () => {
    closeModal(successModal);
});

// Close modal when clicking overlay
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal || e.target.classList.contains('modal__overlay')) {
        closeModal(contactModal);
    }
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal || e.target.classList.contains('modal__overlay')) {
        closeModal(successModal);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Form Validation and Submission
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) {
        errors.push('Nome é obrigatório');
    }
    
    if (!formData.email.trim()) {
        errors.push('E-mail é obrigatório');
    } else if (!isValidEmail(formData.email)) {
        errors.push('E-mail deve ter um formato válido');
    }
    
    if (!formData.phone.trim()) {
        errors.push('WhatsApp é obrigatório');
    }
    
    if (!formData.profession.trim()) {
        errors.push('Profissão é obrigatória');
    }
    
    if (!formData.package) {
        errors.push('Selecione um pacote');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as Brazilian phone number
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
}

// Real-time phone formatting
document.getElementById('phone').addEventListener('input', (e) => {
    const input = e.target;
    const value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        input.value = formatPhoneNumber(value);
    }
});

// Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        profession: document.getElementById('profession').value,
        package: document.getElementById('package').value
    };
    
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Close contact modal and show success modal
        closeModal(contactModal);
        
        setTimeout(() => {
            openModal(successModal);
        }, 300);
        
        // Reset form
        contactForm.reset();
        
        // Log form data for demonstration
        console.log('Form submitted:', formData);
        
    }, 2000);
});

// Smooth Scrolling for internal links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll('.step, .benefit-card, .impact-item, .pricing-card');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    createIntersectionObserver();
});

// Button hover effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
}

// Card hover effects
function addCardEffects() {
    const cards = document.querySelectorAll('.step, .benefit-card, .impact-item, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Pricing card selection highlight
function addPricingInteraction() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            pricingCards.forEach(c => c.classList.remove('pricing-card--selected'));
            
            // Add active class to clicked card
            card.classList.add('pricing-card--selected');
            
            // Pre-select package in form
            const packages = ['essencial', 'avancado', 'continua'];
            packageSelect.value = packages[index];
        });
    });
}

// Loading animation for hero section
function animateHero() {
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroCTA = document.querySelector('.hero__cta');
    const aiIcon = document.querySelector('.ai-icon');
    
    // Animate elements on load
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 200);
    
    setTimeout(() => {
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
    }, 400);
    
    setTimeout(() => {
        heroCTA.style.opacity = '1';
        heroCTA.style.transform = 'translateY(0)';
    }, 600);
    
    setTimeout(() => {
        aiIcon.style.opacity = '1';
        aiIcon.style.transform = 'scale(1)';
    }, 800);
}

// Scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-primary), #10b981);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize all interactions
document.addEventListener('DOMContentLoaded', () => {
    addButtonEffects();
    addCardEffects();
    addPricingInteraction();
    animateHero();
    addScrollProgress();
    
    // Set initial styles for hero animation
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroCTA = document.querySelector('.hero__cta');
    const aiIcon = document.querySelector('.ai-icon');
    
    [heroTitle, heroSubtitle, heroCTA].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
    });
    
    aiIcon.style.opacity = '0';
    aiIcon.style.transform = 'scale(0.8)';
    aiIcon.style.transition = 'all 0.8s ease-out';
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for animations
const lazyAnimations = debounce(() => {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('animate');
        }
    });
}, 100);

window.addEventListener('scroll', lazyAnimations);

// Form accessibility improvements
function improveFormAccessibility() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus indicators
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)';
        });
        
        input.addEventListener('blur', () => {
            input.style.boxShadow = '';
        });
        
        // Add validation feedback
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.style.borderColor = 'var(--color-error)';
        });
        
        input.addEventListener('input', () => {
            if (input.style.borderColor === 'var(--color-error)') {
                input.style.borderColor = '';
            }
        });
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveFormAccessibility);

// Performance optimization: Reduce animations on low-end devices
function optimizeForPerformance() {
    const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                          navigator.deviceMemory < 4 || 
                          window.innerWidth < 768;
    
    if (isLowEndDevice) {
        document.body.classList.add('reduced-motion');
        
        // Add CSS for reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeForPerformance);