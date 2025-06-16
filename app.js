// DOM Elements
const modal = document.getElementById('contactModal');
const modalContainer = modal.querySelector('.modal__container');
const modalBackdrop = modal.querySelector('.modal__backdrop');
const modalClose = document.getElementById('closeModal');
const modalLoading = document.getElementById('modalLoading');
const contactForm = document.getElementById('contactForm');
const openModalButtons = document.querySelectorAll('#openModal, #openModalFinal, .plan__cta');

// State Management
let isModalOpen = false;
let focusedElementBeforeModal = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeScrollAnimations();
    initializeAccessibility();
});

// Event Listeners
function initializeEventListeners() {
    // Modal Open Buttons
    openModalButtons.forEach(button => {
        button.addEventListener('click', handleModalOpen);
    });

    // Modal Close Events
    modalClose.addEventListener('click', handleModalClose);
    modalBackdrop.addEventListener('click', handleModalClose);
    
    // Keyboard Events
    document.addEventListener('keydown', handleKeyDown);
    
    // Iframe Load Event
    contactForm.addEventListener('load', handleIframeLoad);
    
    // Plan Selection
    document.querySelectorAll('.plan__cta').forEach(button => {
        button.addEventListener('click', handlePlanSelection);
    });
    
    // Smooth Scrolling for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// Modal Functions
function handleModalOpen(event) {
    event.preventDefault();
    
    // Store focused element for accessibility
    focusedElementBeforeModal = document.activeElement;
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    isModalOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show loading state
    modalLoading.style.display = 'flex';
    contactForm.style.opacity = '0';
    
    // Focus management
    setTimeout(() => {
        modalClose.focus();
    }, 100);
    
    // Reload iframe to ensure fresh form
    const currentSrc = contactForm.src;
    contactForm.src = '';
    contactForm.src = currentSrc;
    
    // Add animation classes
    modalContainer.style.animation = 'modalSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    modalBackdrop.style.animation = 'fadeIn 0.3s ease-out';
}

function handleModalClose(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (!isModalOpen) return;
    
    // Hide modal with animation
    modalContainer.style.animation = 'modalSlideOut 0.3s ease-in';
    modalBackdrop.style.animation = 'fadeOut 0.3s ease-in';
    
    setTimeout(() => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        isModalOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset animations
        modalContainer.style.animation = '';
        modalBackdrop.style.animation = '';
        
        // Restore focus
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
            focusedElementBeforeModal = null;
        }
    }, 300);
}

function handleIframeLoad() {
    // Hide loading state
    setTimeout(() => {
        modalLoading.style.display = 'none';
        contactForm.style.opacity = '1';
        contactForm.style.transition = 'opacity 0.3s ease';
    }, 500);
}

// Plan Selection
function handlePlanSelection(event) {
    const planType = event.target.getAttribute('data-plan');
    
    // Add visual feedback
    event.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.target.style.transform = '';
    }, 150);
    
    // Store selected plan in sessionStorage for form pre-filling
    if (planType) {
        sessionStorage.setItem('selectedPlan', planType);
    }
    
    // Open modal
    handleModalOpen(event);
}

// Keyboard Navigation
function handleKeyDown(event) {
    if (!isModalOpen) return;
    
    switch (event.key) {
        case 'Escape':
            handleModalClose();
            break;
        case 'Tab':
            handleTabNavigation(event);
            break;
    }
}

function handleTabNavigation(event) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            event.preventDefault();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            event.preventDefault();
        }
    }
}

// Smooth Scrolling
function handleSmoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    // Only add animations if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'scrollFadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.process__step, .benefit__card, .impact__item, .plan__card'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Add ARIA labels to interactive elements
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            const text = button.textContent.trim();
            button.setAttribute('aria-label', text);
        }
    });
    
    // Add role attributes
    const cards = document.querySelectorAll('.plan__card, .benefit__card, .process__step');
    cards.forEach(card => {
        card.setAttribute('role', 'article');
    });
    
    // Enhance form accessibility
    const iframe = document.getElementById('contactForm');
    iframe.setAttribute('title', 'Formulário de Contato para Consultoria de IA');
}

// Performance Optimizations
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

// Hover Effects Enhancement
function initializeHoverEffects() {
    const cards = document.querySelectorAll('.process__step, .benefit__card, .plan__card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Button Click Effects
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', function() {
    initializeHoverEffects();
    initializeButtonEffects();
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        to {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Handle Form Submission Feedback
function handleFormSubmission() {
    // Listen for form submission events from iframe
    window.addEventListener('message', function(event) {
        if (event.origin === 'https://docs.google.com') {
            if (event.data.type === 'form-submitted') {
                // Show success message
                showSuccessMessage();
            }
        }
    });
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <h3>✅ Formulário Enviado com Sucesso!</h3>
            <p>Obrigado pelo seu interesse. Entrarei em contato em breve!</p>
        </div>
    `;
    
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
        handleModalClose();
    }, 3000);
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', handleFormSubmission);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Add error handling for iframe
contactForm.addEventListener('error', function() {
    modalLoading.innerHTML = `
        <div style="text-align: center; color: #dc2626;">
            <h3>Erro ao carregar formulário</h3>
            <p>Por favor, tente novamente ou entre em contato diretamente.</p>
            <button class="btn btn--primary" onclick="location.reload()">Tentar Novamente</button>
        </div>
    `;
});

// Preload critical resources
function preloadResources() {
    // Preload Google Forms
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'https://docs.google.com/forms/d/e/1FAIpQLScKvJPWVrWIpeqJxOV2D9gDuxjlq-ZnsN_y067wphELMbGi3w/viewform';
    document.head.appendChild(link);
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadResources);
