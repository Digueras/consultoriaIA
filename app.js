// Modal functionality - Versão Corrigida
document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements - IDs corrigidos para corresponder ao HTML
    const contactModal = document.getElementById('contact-modal');
    const successModal = document.getElementById('success-modal');
    const formsIframe = document.getElementById('formsIframe');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Buttons
    const openModalBtns = document.querySelectorAll('.btn--primary, .hero__cta, .pricing-cta, .final-cta__button');
    const closeModalBtns = document.querySelectorAll('#modal-close, #success-close');
    
    // Verificar se elementos existem antes de adicionar listeners
    if (openModalBtns.length > 0 && contactModal) {
        // Abrir modal
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(contactModal);
            });
        });
    }
    
    if (closeModalBtns.length > 0) {
        // Fechar modal
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (btn.id === 'modal-close') {
                    closeModal(contactModal);
                } else {
                    closeModal(successModal);
                }
            });
        });
    }
    
    // Fechar modal clicando no overlay
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeModal(contactModal);
            }
        });
    }
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal || e.target.classList.contains('modal__overlay')) {
                closeModal(successModal);
            }
        });
    }
    
    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (contactModal && contactModal.classList.contains('modal--active')) {
                closeModal(contactModal);
            }
            if (successModal && successModal.classList.contains('active')) {
                closeModal(successModal);
            }
        }
    });
    
    // Funções do modal
    function openModal(modal) {
        if (modal) {
            if (modal === contactModal) {
                modal.classList.add('modal--active');
            } else {
                modal.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
            
            // Foco para acessibilidade
            const firstFocusable = modal.querySelector('input, button, select, textarea, iframe');
            if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'modal_open', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form'
                });
            }
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            if (modal === contactModal) {
                modal.classList.remove('modal--active');
            } else {
                modal.classList.remove('active');
            }
            document.body.style.overflow = '';
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'modal_close', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form'
                });
            }
        }
    }
    
    // Controle do loading do iframe
    if (formsIframe && loadingOverlay) {
        formsIframe.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }, 800);
        });
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
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll('.step, .benefit-card, .impact-item, .pricing-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }
    
    // Button hover effects
    function addButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.style.transform.includes('scale')) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.style.transform.includes('scale')) {
                    button.style.transform = 'translateY(0)';
                }
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
                
                // Open modal
                openModal(contactModal);
            });
        });
    }
    
    // Loading animation for hero section
    function animateHero() {
        const heroTitle = document.querySelector('.hero__title');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroCTA = document.querySelector('.hero__cta');
        const aiIcon = document.querySelector('.ai-icon');
        
        // Set initial styles
        [heroTitle, heroSubtitle, heroCTA].forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease-out';
            }
        });
        
        if (aiIcon) {
            aiIcon.style.opacity = '0';
            aiIcon.style.transform = 'scale(0.8)';
            aiIcon.style.transition = 'all 0.8s ease-out';
        }
        
        // Animate elements on load
        setTimeout(() => {
            if (heroTitle) {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }
        }, 200);
        
        setTimeout(() => {
            if (heroSubtitle) {
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }
        }, 400);
        
        setTimeout(() => {
            if (heroCTA) {
                heroCTA.style.opacity = '1';
                heroCTA.style.transform = 'translateY(0)';
            }
        }, 600);
        
        setTimeout(() => {
            if (aiIcon) {
                aiIcon.style.opacity = '1';
                aiIcon.style.transform = 'scale(1)';
            }
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
            background: linear-gradient(90deg, var(--color-primary), #00d4aa);
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
    
    // Form accessibility improvements
    function improveFormAccessibility() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add focus indicators
            input.addEventListener('focus', () => {
                input.style.boxShadow = '0 0 0 3px rgba(0, 255, 135, 0.3)';
            });
            
            input.addEventListener('blur', () => {
                input.style.boxShadow = '';
            });
        });
    }
    
    // Performance optimization: Reduce animations on low-end devices
    function optimizeForPerformance() {
        const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                              navigator.deviceMemory < 4 || 
                              window.innerWidth < 768;
        
        if (isLowEndDevice) {
            document.body.classList.add('reduced-motion');
        }
    }
    
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
    
    // Initialize all features
    createIntersectionObserver();
    addButtonEffects();
    addPricingInteraction();
    animateHero();
    addScrollProgress();
    improveFormAccessibility();
    optimizeForPerformance();
    
    // Smooth scrolling for performance
    const smoothScroll = debounce(() => {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('animate');
            }
        });
    }, 100);
    
    window.addEventListener('scroll', smoothScroll);
});
