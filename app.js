// DOM Elements
const modal = document.getElementById('contactModal');
const ctaButtons = document.querySelectorAll('.cta-button');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.querySelector('.modal__overlay');

// Modal functionality
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
        firstElement.focus();
    }
    
    // Handle tab navigation within modal
    const handleModalKeydown = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };
    
    modal.addEventListener('keydown', handleModalKeydown);
    
    // Store the handler so we can remove it later
    modal._keydownHandler = handleModalKeydown;
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove the keydown handler if it exists
    if (modal._keydownHandler) {
        modal.removeEventListener('keydown', modal._keydownHandler);
        modal._keydownHandler = null;
    }
}

// Event listeners for modal
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
        
        // Track which button was clicked
        const buttonText = button.textContent.trim();
        const section = button.closest('section')?.className || 'unknown';
        trackEvent('cta_click', {
            button_text: buttonText,
            section: section
        });
    });
});

closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Copy code functionality
function copyCode() {
    const codeBlock = document.getElementById('codeBlock');
    const textArea = document.createElement('textarea');
    textArea.value = codeBlock.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        
        // Visual feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';
        copyBtn.style.color = '#059669';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.color = '';
        }, 2000);
        
        trackEvent('code_copied', { code_type: 'google_forms_iframe' });
    } catch (err) {
        console.log('Fallback: copy not supported');
        // Fallback: select the text for manual copying
        const range = document.createRange();
        range.selectNodeContents(codeBlock);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    document.body.removeChild(textArea);
}

// Make copyCode function globally available
window.copyCode = copyCode;

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Observe animated elements
    const animatedElements = document.querySelectorAll(
        '.process__step, .benefit__card, .impact__item, .pricing__card'
    );
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Initialize hero animations
    const heroElements = document.querySelectorAll('.hero__badge, .hero__headline, .hero__subtitle, .hero__cta');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.5 });

    heroElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        heroObserver.observe(el);
    });
});

// Enhanced button interactions
ctaButtons.forEach(button => {
    // Add ripple effect
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Enhanced hover effects
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Pricing card interactions
const pricingCards = document.querySelectorAll('.pricing__card');

pricingCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 20px rgba(37, 99, 235, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
    
    // Track pricing card clicks
    card.addEventListener('click', () => {
        const cardTitle = card.querySelector('.card__title')?.textContent || `Card ${index + 1}`;
        trackEvent('pricing_card_view', {
            card_name: cardTitle,
            card_position: index + 1
        });
    });
});

// Performance optimization: Debounced scroll handler
let ticking = false;

function updateScrollPosition() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    // Subtle parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Analytics tracking helper
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, eventData);
}

// Form validation helper (for future Google Forms integration)
function validateForm(formData) {
    const errors = [];
    
    // Basic validation rules
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Email deve ter um formato válido');
    }
    
    if (!formData.phone || formData.phone.length < 10) {
        errors.push('Telefone deve ter pelo menos 10 dígitos');
    }
    
    return errors;
}

// Page load performance tracking
window.addEventListener('load', () => {
    const loadTime = performance.now();
    trackEvent('page_load', {
        load_time: Math.round(loadTime)
    });
    
    // Track page sections viewed
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.className || 'unknown-section';
                trackEvent('section_view', {
                    section: sectionName
                });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    trackEvent('application_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason?.toString() || 'Unknown'
    });
});

// Contact methods interaction tracking
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('contact-item')) {
        const contactMethod = e.target.textContent.includes('@') ? 'email' : 'phone';
        trackEvent('contact_method_click', {
            method: contactMethod
        });
    }
});

// Improved mobile experience
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Optimize touch interactions
    document.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('btn')) {
            e.target.style.transform = 'scale(0.98)';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (e.target.classList.contains('btn')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
    
    // Track mobile usage
    trackEvent('mobile_visit', {
        user_agent: navigator.userAgent.substring(0, 100)
    });
}

// Initialize application
console.log('🚀 Consultoria de IA - Landing Page inicializada com sucesso!');
console.log('📊 Analytics e interações configurados');
console.log('♿ Recursos de acessibilidade ativados');
console.log('📱 Otimizações mobile aplicadas');

// Export functions for potential external use
window.AIConsultancy = {
    openModal,
    closeModal,
    trackEvent,
    validateForm,
    copyCode
};