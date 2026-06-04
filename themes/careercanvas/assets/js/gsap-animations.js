// GSAP Animations System - Hero Section Only

// Configuration object for hero animations
const ANIMATION_CONFIG = {
    hero: {
        diagonalLines: { count: 4, opacity: 0.4, scaleX: 4.0 }
    }
};

const HERO_BACKGROUND_THEMES = [
    'aurora-flow',
    'orbital-math',
    'signal-grid',
    'constellation-drift',
    'tidal-spectrum',
    'lattice-orbits',
    'scholar-glow',
    'wavefront-field',
    'solar-system',
    'equation-drift',
    'kdv-soliton',
    'kdv-soliton',
    'black-hole-lensing',
    'math-symbol-drift',
    'physics-equations',
    'physics-equations',
    'phase-portrait',
    'nebula-equations',
    'resonance-rings',
    'harmonic-mesh',
    'wave-packets',
    'eclipse-grid',
    'tensor-cloud',
    'spiral-spectra'
];

const PHYSICS_EQUATION_SNIPPETS = [
    '\\(R_{\\mu\\nu} - \\frac{1}{2} R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = 8\\pi T_{\\mu\\nu}\\)',
    '\\(\\nabla \\cdot \\mathbf{E} = \\rho / \\varepsilon_0\\)',
    '\\(\\nabla \\times \\mathbf{B} - \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} = \\mu_0 \\mathbf{J}\\)',
    '\\((i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0\\)',
    '\\(\\nabla \\cdot \\mathbf{B} = 0\\)',
    '\\(\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}\\)',
    '\\(u_t + u u_x - u_{t x x} = 0\\)',
    '\\(i u_t + u_{x x} + \\beta |u|^2 u = 0\\)'
];

function typesetHeroMath(elements, attempt = 0) {
    const nodes = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
    if (nodes.length === 0) return;

    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise(nodes).catch((error) => {
            console.warn('MathJax typesetting skipped for hero animation:', error);
        });
        return;
    }

    if (attempt < 24) {
        window.setTimeout(() => typesetHeroMath(nodes, attempt + 1), 250);
    }
}

// Common animation properties for hero
const COMMON_ANIMATIONS = {
    fadeIn: { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power2.out" },
    scrollEnter: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
};

// Central animation registry to prevent duplicates
const ANIMATION_REGISTRY = {
    registeredElements: new Set(),
    
    // Register an element to prevent duplicate animations
    registerElement: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        if (ANIMATION_REGISTRY.registeredElements.has(key)) {
            return false; // Already registered
        }
        ANIMATION_REGISTRY.registeredElements.add(key);
        return true;
    },
    
    // Check if element is already animated
    isElementAnimated: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        return ANIMATION_REGISTRY.registeredElements.has(key);
    }
};

// Utility functions for hero animations
const Utils = {
    // Create container with fallback
    createContainer: (parent, className, fallback) => {
        return parent.querySelector(className) || (() => {
            const container = document.createElement('div');
            container.className = fallback;
            parent.appendChild(container);
            return container;
        })();
    },

    // Random position generator
    randomPosition: (min = 10, max = 90) => ({
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
    })
};

// Mouse tracking for quick fact lighting effects
function initQuickFactLighting() {
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    
    if (quickFactCards.length === 0) return;
    
    quickFactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    initializeHeroAnimations();
});


// GSAP loader with fallback
function loadGSAP() {
    const loadScript = (src, fallback, onLoad) => {
        console.log(`Loading GSAP from: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onerror = (error) => {
            console.warn(`Failed to load GSAP from ${src}, trying fallback: ${fallback}`);
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallback;
            fallbackScript.onload = () => {
                console.log('GSAP loaded from fallback successfully');
                onLoad();
            };
            fallbackScript.onerror = (fallbackError) => {
                console.error('Both GSAP sources failed to load:', error, fallbackError);
            };
            document.head.appendChild(fallbackScript);
        };
        script.onload = () => {
            console.log('GSAP loaded successfully from primary source');
            onLoad();
        };
        document.head.appendChild(script);
    };

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js', 
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js',
        () => {
            initializeHeroAnimations();
        });
}

// Main initialization function - Hero only (optimized)
function initializeHeroAnimations() {
    console.log('Initializing hero animation system...');
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    console.log('🎯 Initializing hero animations...');
    
    // Set initial states for all animated elements
    const animatedElements = heroSection.querySelectorAll('[data-animation]');
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    const locationBadge = heroSection.querySelector('[data-animation="location-badge"]');
    
    // Only animate elements that exist
    if (animatedElements.length > 0) {
        gsap.set(animatedElements, { opacity: 0, y: 50, rotationX: -15 });
    }
    if (bgDecorations.length > 0) {
        gsap.set(bgDecorations, { opacity: 0, scale: 0.5, rotation: -180 });
    }
    if (quickFactCards.length > 0) {
        gsap.set(quickFactCards, { opacity: 0, y: 20, scale: 0.95 });
    }
    if (locationBadge) {
        gsap.set(locationBadge, { opacity: 0, y: 20 });
    }
    
    // Initialize floating background animations
    bgDecorations.forEach((circle, index) => {
        const delay = index * 0.5;
        const floatX = (Math.random() - 0.5) * 40;
        const floatY = (Math.random() - 0.5) * 30;
        const floatDuration = 3 + Math.random() * 2;
        
        gsap.timeline({ repeat: -1, yoyo: true, delay })
            .to(circle, { x: floatX, y: floatY, duration: floatDuration, ease: "power1.inOut" });
        
        gsap.to(circle, { rotation: 360, duration: 8 + Math.random() * 4, ease: "none", repeat: -1, delay });
        circle.setAttribute('data-natural-animation', 'true');
    });
    
    // Initialize mouse tracking
    initMouseTracking(heroSection);
    
    // Initialize background shapes
    initSectionBackgroundAnimations('.hero-section', ANIMATION_CONFIG.hero);
    
    // Initialize typewriter effect
    initTypingEffect();
    
    // Initialize quick fact lighting effects
    initQuickFactLighting();
    
    // Play hero entrance animation
    const tl = gsap.timeline();
    
    // Only animate elements that exist
    if (animatedElements.length > 0) {
        tl.to(animatedElements, { 
            opacity: 1, 
            y: 0, 
            rotationX: 0, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.1,
            ease: "back.out(1.7)" 
        });
    }
    
    if (bgDecorations.length > 0) {
        tl.to(bgDecorations, { 
            opacity: 0.1, 
            scale: 1, 
            rotation: 0, 
            duration: 1, 
            stagger: 0.1 
        }, "-=0.6");
    }
    
    if (quickFactCards.length > 0) {
        tl.to(quickFactCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4");
    }
    
    if (locationBadge) {
        tl.to(locationBadge, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        }, "-=0.3");
    }
}

// Hero tagline reveal: show one concept at a time
let typingEffectInitialized = false;

function initTypingEffect() {
    if (typingEffectInitialized) return;
    
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const originalText = typewriterElement.getAttribute('data-original-text') || typewriterElement.textContent;
    const concepts = originalText
        .split('.')
        .map(concept => concept.trim())
        .filter(concept => concept.length > 0)
        .map(concept => `${concept}.`);
    let currentConceptIndex = 0;
    
    typewriterElement.textContent = '';
    typewriterElement.style.color = 'transparent';
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    Object.assign(cursor.style, {
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'var(--color-primary-light)',
        marginLeft: '2px',
        verticalAlign: 'text-bottom'
    });
    
    typewriterElement.appendChild(cursor);

    // Cursor blinking animation
    gsap.to(cursor, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
    });

    function typeConcept(concept, onComplete) {
        const chars = concept.split('');
        const timeline = gsap.timeline();

        chars.forEach((char, index) => {
            timeline.to(typewriterElement, {
                duration: 0.05,
                onUpdate: function() {
                    const textContent = chars.slice(0, index + 1).join('');
                    typewriterElement.textContent = textContent;
                    typewriterElement.appendChild(cursor);
                    typewriterElement.style.color = 'inherit';
                }
            });
        });

        timeline.to(typewriterElement, { duration: 1.2 });

        timeline.to(typewriterElement, {
            duration: 0.25,
            opacity: 0,
            onComplete: function() {
                typewriterElement.textContent = '';
                typewriterElement.appendChild(cursor);
            }
        });

        timeline.to(typewriterElement, {
            duration: 0.2,
            opacity: 1,
            onComplete: onComplete
        });
    }

    function startTypingLoop() {
        typeConcept(concepts[currentConceptIndex], () => {
            currentConceptIndex = (currentConceptIndex + 1) % concepts.length;
            startTypingLoop();
        });
    }

    startTypingLoop();
    
    typingEffectInitialized = true;
}

function initMouseTracking(heroSection) {
    let mouseX = 0, mouseY = 0, isInHero = false;
    let updateTimeout = null;
    const throttleDelay = 16;

    const events = {
        mouseenter: () => { 
            isInHero = true; 
            updateMouseEffects(); 
        },
        mouseleave: () => { 
            isInHero = false; 
            resetMouseEffects(); 
        },
        mousemove: (e) => {
            if (!isInHero) return;
            const rect = heroSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            if (!updateTimeout) {
                updateTimeout = setTimeout(() => {
                    updateMouseEffects();
                    updateTimeout = null;
                }, throttleDelay);
            }
        }
    };

    Object.entries(events).forEach(([event, handler]) => {
        heroSection.addEventListener(event, handler);
    });

    function updateMouseEffects() {
        if (!isInHero) return;
        
        const normalizedX = (mouseX - 0.5) * 2;
        const normalizedY = (mouseY - 0.5) * 2;
        
        const elementTypes = [
            { selector: '.morphing-shape', sensitivity: { x: 40, y: 30, rotate: 25, scale: 0.2 } },
            { selector: '.diagonal-line', sensitivity: { x: 25, y: 20, rotate: 15, scale: 0.1 } },
            { selector: '.spline-curve', sensitivity: { x: 15, y: 12, rotate: 8, scale: 0.05 } }
        ];

        elementTypes.forEach(({ selector, sensitivity }) => {
            const elements = heroSection.querySelectorAll(selector);
            elements.forEach((el, index) => {
                if (el.hasAttribute('data-natural-animation')) return;
                
                const multiplier = index + 1;
                gsap.to(el, {
                    x: normalizedX * (sensitivity.x + index * 8),
                    y: normalizedY * (sensitivity.y + index * 6),
                    rotation: normalizedX * (sensitivity.rotate + index * 5),
                    scale: 1 + Math.abs(normalizedX + normalizedY) * (sensitivity.scale + index * 0.05),
                    duration: 1.2 + index * 0.3,
                    ease: "power2.out"
                });
            });
        });

        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px var(--color-primary-light)`,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function resetMouseEffects() {
        const elementsToReset = heroSection.querySelectorAll('.morphing-shape, .diagonal-line, .spline-curve');
        const resetElements = Array.from(elementsToReset).filter(el => !el.hasAttribute('data-natural-animation'));
        
        gsap.to(resetElements, {
            x: 0, y: 0, rotation: 0, scale: 1,
            duration: 0.8, ease: "power2.out"
        });
        
        gsap.to(heroSection, { boxShadow: 'none', duration: 0.5, ease: "power2.out" });
    }
}

// Background animations system for hero
function createAndAnimateDiagonalLines(container, options = {}) {
    const config = { count: 4, background: 'linear-gradient(45deg, transparent, var(--color-primary-light), transparent)', height: 3, width: 1200, opacity: 0.4, scaleX: 4.0, duration: 4, rotationDuration: 8, ...options };
    
    const lines = Array.from({ length: config.count }, (_, i) => {
        const line = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(line.style, {
            position: 'absolute',
            background: config.background,
            height: config.height + 'px',
            width: config.width + 'px',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: `rotate(${Math.random() * 360}deg)`,
            transformOrigin: 'center center'
        });
        line.className = 'diagonal-line';
        container.appendChild(line);
        return line;
    });

    lines.forEach((line, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(line, { opacity: config.opacity, scaleX: config.scaleX, duration: config.duration, delay: index * 0.8, ease: "power2.inOut" })
            .to(line, { rotation: '+=180', duration: config.rotationDuration, ease: "none" }, 0);
    });

    return lines;
}

function createAndAnimateSplineCurves(container, options = {}) {
    const config = { count: 3, size: 180, border: '3px solid var(--color-primary)', opacity: 0.6, scale: 1.2, duration: 6, rotationDuration: 10, ...options };
    
    const curves = Array.from({ length: config.count }, (_, i) => {
        const curve = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(curve.style, {
            position: 'absolute',
            width: config.size + 'px',
            height: config.size + 'px',
            border: config.border,
            borderRadius: '50%',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%'
        });
        curve.className = 'spline-curve';
        container.appendChild(curve);
        return curve;
    });

    curves.forEach((curve, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(curve, { opacity: config.opacity, scale: config.scale, borderRadius: '0%', duration: config.duration, delay: index * 1.2, ease: "power2.inOut" })
            .to(curve, { rotation: 360, duration: config.rotationDuration, ease: "none" }, 0);
    });

    return curves;
}

function createAndAnimateGlowOrbs(container, options = {}) {
    const config = { count: 5, minSize: 140, maxSize: 320, opacity: 0.18, duration: 8, drift: 60, ...options };

    const orbs = Array.from({ length: config.count }, () => {
        const orb = document.createElement('div');
        const pos = Utils.randomPosition(5, 85);
        const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        Object.assign(orb.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            borderRadius: '999px',
            opacity: '0',
            zIndex: '0',
            filter: 'blur(18px)',
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-third-light) 65%, white) 0%, color-mix(in srgb, var(--color-primary-light) 55%, transparent) 42%, transparent 72%)`,
            transform: 'translate(-50%, -50%)'
        });
        orb.className = 'hero-glow-orb';
        container.appendChild(orb);
        return orb;
    });

    orbs.forEach((orb, index) => {
        const offsetX = (Math.random() - 0.5) * config.drift;
        const offsetY = (Math.random() - 0.5) * config.drift;
        const scale = 0.9 + Math.random() * 0.6;

        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.4 })
            .to(orb, {
                opacity: config.opacity,
                x: offsetX,
                y: offsetY,
                scale,
                duration: config.duration + Math.random() * 2,
                ease: "sine.inOut"
            })
            .to(orb, {
                rotation: Math.random() > 0.5 ? 25 : -25,
                duration: config.duration + 2,
                ease: "sine.inOut"
            }, 0);
    });

    return orbs;
}

function createAndAnimateOrbitRings(container, options = {}) {
    const config = { count: 3, baseSize: 180, gap: 90, opacity: 0.28, duration: 16, centerX: 74, centerY: 36, ...options };

    const centerX = config.centerX;
    const centerY = config.centerY;

    const rings = Array.from({ length: config.count }, (_, index) => {
        const ring = document.createElement('div');
        const size = config.baseSize + index * config.gap;
        Object.assign(ring.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${centerX}%`,
            top: `${centerY}%`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '999px',
            border: `1.5px solid color-mix(in srgb, var(--color-primary-light) 55%, transparent)`,
            opacity: '0',
            zIndex: '0'
        });
        ring.className = 'hero-orbit-ring';
        container.appendChild(ring);

        const orbit = document.createElement('div');
        Object.assign(orbit.style, {
            position: 'absolute',
            left: `${centerX}%`,
            top: `${centerY}%`,
            width: `${size}px`,
            height: `${size}px`,
            transform: 'translate(-50%, -50%)',
            opacity: '0',
            zIndex: '1'
        });
        orbit.className = 'hero-orbit';

        const dot = document.createElement('div');
        Object.assign(dot.style, {
            position: 'absolute',
            width: '12px',
            height: '12px',
            left: '50%',
            top: '-6px',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            background: 'var(--color-third-light)',
            boxShadow: '0 0 18px color-mix(in srgb, var(--color-third-light) 60%, transparent)'
        });
        dot.className = 'hero-orbit-dot';
        orbit.appendChild(dot);
        container.appendChild(orbit);

        gsap.to(ring, {
            opacity: config.opacity,
            duration: 1.8,
            delay: index * 0.2,
            ease: 'power2.out'
        });

        gsap.to(ring, {
            rotation: 360,
            transformOrigin: 'center center',
            duration: config.duration + index * 3,
            ease: 'none',
            repeat: -1
        });

        gsap.to(orbit, {
            opacity: 0.85,
            duration: 1.4,
            delay: index * 0.2,
            ease: 'power2.out'
        });

        gsap.to(orbit, {
            rotation: 360,
            transformOrigin: 'center center',
            duration: config.duration + index * 3,
            ease: 'none',
            repeat: -1
        });

        return { ring, orbit, dot };
    });

    return rings;
}

function createAndAnimateWaveContours(container, options = {}) {
    const config = { count: 5, opacity: 0.16, duration: 8, minWidth: 28, maxWidth: 58, ...options };

    const contours = Array.from({ length: config.count }, (_, index) => {
        const contour = document.createElement('div');
        const width = config.minWidth + Math.random() * (config.maxWidth - config.minWidth);
        const height = 70 + Math.random() * 80;
        Object.assign(contour.style, {
            position: 'absolute',
            width: `${width}%`,
            height: `${height}px`,
            left: `${10 + Math.random() * 45}%`,
            top: `${18 + index * 12}%`,
            border: '1.5px solid color-mix(in srgb, var(--color-primary-light) 30%, transparent)',
            borderRadius: '999px',
            opacity: '0',
            zIndex: '0',
            transform: `rotate(${(Math.random() - 0.5) * 8}deg)`
        });
        contour.className = 'hero-wave-contour';
        container.appendChild(contour);
        return contour;
    });

    contours.forEach((contour, index) => {
        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.35 })
            .to(contour, {
                opacity: config.opacity,
                x: index % 2 === 0 ? 24 : -24,
                y: index % 2 === 0 ? -10 : 10,
                scaleX: 1.06,
                scaleY: 1.12,
                duration: config.duration + index * 0.8,
                ease: 'sine.inOut'
            })
            .to(contour, {
                rotation: index % 2 === 0 ? 6 : -6,
                duration: config.duration + 1.5,
                ease: 'sine.inOut'
            }, 0);
    });

    return contours;
}

function createAndAnimateSolarCore(container, options = {}) {
    const config = { centerX: 68, centerY: 38, size: 150, opacity: 0.2, duration: 7.5, ...options };

    const core = document.createElement('div');
    Object.assign(core.style, {
        position: 'absolute',
        width: `${config.size}px`,
        height: `${config.size}px`,
        left: `${config.centerX}%`,
        top: `${config.centerY}%`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '999px',
        opacity: '0',
        zIndex: '0',
        filter: 'blur(12px)',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--color-third-light) 70%, white) 0%, color-mix(in srgb, var(--color-second-light) 55%, transparent) 45%, transparent 76%)'
    });
    core.className = 'hero-solar-core';
    container.appendChild(core);

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(core, {
            opacity: config.opacity,
            scale: 1.08,
            duration: config.duration,
            ease: 'sine.inOut'
        })
        .to(core, {
            rotation: 18,
            duration: config.duration + 2,
            ease: 'sine.inOut'
        }, 0);

    return core;
}

function createAndAnimateEquationGlyphs(container, options = {}) {
    const config = {
        count: 6,
        opacity: 0.1,
        duration: 10,
        snippets: [
            '\\(u_t + 6u u_x + u_{xxx} = 0\\)',
            '\\(P^k(I_j)\\)',
            '\\(\\mathrm{DG}\\)',
            '\\(L_n(x)\\)',
            '\\(H[u]\\)',
            '\\(\\frac{d}{dx}\\)'
        ],
        fontMin: 0.9,
        fontMax: 1.45,
        color: 'color-mix(in srgb, var(--color-primary-lighter) 70%, white)',
        xDrift: 40,
        yDrift: 28,
        letterSpacing: '0.08em',
        textShadow: '0 0 14px color-mix(in srgb, var(--color-primary-light) 25%, transparent)',
        ...options
    };

    const glyphs = Array.from({ length: config.count }, (_, index) => {
        const glyph = document.createElement('div');
        const pos = Utils.randomPosition(8, 88);
        glyph.innerHTML = config.snippets[index % config.snippets.length];
        Object.assign(glyph.style, {
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity: '0',
            zIndex: '0',
            color: config.color,
            fontSize: `${config.fontMin + Math.random() * (config.fontMax - config.fontMin)}rem`,
            fontWeight: '600',
            letterSpacing: config.letterSpacing,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            transform: `rotate(${(Math.random() - 0.5) * 18}deg)`,
            textShadow: config.textShadow
        });
        glyph.className = 'hero-equation-glyph';
        container.appendChild(glyph);
        return glyph;
    });

    typesetHeroMath(glyphs);

    glyphs.forEach((glyph, index) => {
        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.45 })
            .to(glyph, {
                opacity: config.opacity,
                x: (Math.random() - 0.5) * config.xDrift,
                y: (Math.random() - 0.5) * config.yDrift,
                duration: config.duration + Math.random() * 2,
                ease: 'sine.inOut'
            })
            .to(glyph, {
                rotation: `+=${Math.random() > 0.5 ? 10 : -10}`,
                duration: config.duration + 2,
                ease: 'sine.inOut'
            }, 0);
    });

    return glyphs;
}

function createAndAnimateMathSymbols(container, options = {}) {
    const config = {
        count: 10,
        opacity: 0.12,
        duration: 11,
        symbols: [
            '\\(\\partial\\)',
            '\\(\\int\\)',
            '\\(\\sum\\)',
            '\\(\\nabla\\)',
            '\\(\\infty\\)',
            '\\(\\lambda\\)',
            '\\(\\phi\\)',
            '\\(\\psi\\)',
            '\\(\\Omega\\)',
            '\\(\\frac{\\partial u}{\\partial t}\\)'
        ],
        ...options
    };

    const symbols = Array.from({ length: config.count }, (_, index) => {
        const glyph = document.createElement('div');
        const pos = Utils.randomPosition(6, 92);
        glyph.innerHTML = config.symbols[index % config.symbols.length];
        Object.assign(glyph.style, {
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity: '0',
            zIndex: '0',
            color: 'color-mix(in srgb, var(--color-primary-lighter) 72%, white)',
            fontSize: `${1 + Math.random() * 0.9}rem`,
            fontWeight: '700',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            transform: `rotate(${(Math.random() - 0.5) * 22}deg)`,
            textShadow: '0 0 16px color-mix(in srgb, var(--color-primary-light) 28%, transparent)'
        });
        glyph.className = 'hero-math-symbol';
        container.appendChild(glyph);
        return glyph;
    });

    typesetHeroMath(symbols);

    symbols.forEach((glyph, index) => {
        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.3 })
            .to(glyph, {
                opacity: config.opacity,
                x: (Math.random() - 0.5) * 55,
                y: (Math.random() - 0.5) * 35,
                duration: config.duration + Math.random() * 2,
                ease: 'sine.inOut'
            })
            .to(glyph, {
                rotation: `+=${Math.random() > 0.5 ? 14 : -14}`,
                duration: config.duration + 1.5,
                ease: 'sine.inOut'
            }, 0);
    });

    return symbols;
}

function createAndAnimateSolitonWave(container, options = {}) {
    const config = {
        count: 3,
        opacity: 0.18,
        duration: 9,
        topStart: 28,
        topGap: 15,
        widthBase: 220,
        widthStep: 70,
        heightBase: 48,
        heightStep: 8,
        blur: 7,
        glowStrength: 55,
        ...options
    };

    const waves = Array.from({ length: config.count }, (_, index) => {
        const wave = document.createElement('div');
        const top = config.topStart + index * config.topGap;
        const width = config.widthBase + index * config.widthStep;
        const height = config.heightBase + index * config.heightStep;
        Object.assign(wave.style, {
            position: 'absolute',
            left: `${-20 - index * 8}%`,
            top: `${top}%`,
            width: `${width}px`,
            height: `${height}px`,
            opacity: '0',
            zIndex: '0',
            borderRadius: '999px',
            filter: `blur(${config.blur}px)`,
            background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--color-third-light) ${config.glowStrength}%, white) 0%, color-mix(in srgb, var(--color-primary-light) 40%, transparent) 42%, transparent 78%)`
        });
        wave.className = 'hero-soliton-wave';
        container.appendChild(wave);
        return wave;
    });

    waves.forEach((wave, index) => {
        gsap.timeline({ repeat: -1, delay: index * 1.3 })
            .to(wave, {
                opacity: config.opacity,
                x: window.innerWidth * 0.9,
                scaleX: 1.12,
                duration: config.duration + index,
                ease: 'power1.inOut'
            })
            .to(wave, {
                opacity: 0,
                duration: 0.9,
                ease: 'power2.out'
            }, `-=${0.8}`)
            .set(wave, {
                x: 0,
                left: `${-20 - index * 8}%`
            });
    });

    return waves;
}

function createAndAnimateBlackHoleCore(container, options = {}) {
    const config = { centerX: 72, centerY: 36, size: 150, opacity: 0.2, duration: 10, ...options };

    const lens = document.createElement('div');
    Object.assign(lens.style, {
        position: 'absolute',
        width: `${config.size * 1.45}px`,
        height: `${config.size * 0.78}px`,
        left: `${config.centerX}%`,
        top: `${config.centerY}%`,
        transform: 'translate(-50%, -50%) rotate(-14deg)',
        borderRadius: '999px',
        opacity: '0',
        zIndex: '0',
        filter: 'blur(3px)',
        background: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-third-light) 55%, white) 18%, color-mix(in srgb, var(--color-second-light) 45%, transparent) 52%, color-mix(in srgb, var(--color-primary-light) 30%, transparent) 82%, transparent 100%)'
    });
    lens.className = 'hero-black-hole-lens';

    const core = document.createElement('div');
    Object.assign(core.style, {
        position: 'absolute',
        width: `${config.size}px`,
        height: `${config.size}px`,
        left: `${config.centerX}%`,
        top: `${config.centerY}%`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '999px',
        opacity: '0',
        zIndex: '1',
        boxShadow: '0 0 45px rgba(0, 0, 0, 0.55), 0 0 18px color-mix(in srgb, var(--color-primary-light) 25%, transparent)',
        background: 'radial-gradient(circle, rgba(0, 0, 0, 0.92) 0%, rgba(4, 7, 16, 0.96) 45%, color-mix(in srgb, var(--color-primary-dark) 25%, transparent) 72%, transparent 82%)'
    });
    core.className = 'hero-black-hole-core';

    container.appendChild(lens);
    container.appendChild(core);

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(lens, {
            opacity: config.opacity,
            scaleX: 1.08,
            scaleY: 1.04,
            duration: config.duration,
            ease: 'sine.inOut'
        })
        .to(lens, {
            rotation: 12,
            duration: config.duration + 3,
            ease: 'sine.inOut'
        }, 0);

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(core, {
            opacity: 0.95,
            scale: 1.05,
            duration: config.duration - 1,
            ease: 'sine.inOut'
        })
        .to(core, {
            boxShadow: '0 0 55px rgba(0, 0, 0, 0.72), 0 0 26px color-mix(in srgb, var(--color-third-light) 28%, transparent)',
            duration: config.duration + 1,
            ease: 'sine.inOut'
        }, 0);

    return { lens, core };
}

function createAndAnimateWaveBands(container, options = {}) {
    const config = { count: 4, height: 140, opacity: 0.16, duration: 10, ...options };

    const bands = Array.from({ length: config.count }, (_, index) => {
        const band = document.createElement('div');
        Object.assign(band.style, {
            position: 'absolute',
            left: '-10%',
            top: `${18 + index * 18}%`,
            width: '120%',
            height: `${config.height}px`,
            opacity: '0',
            zIndex: '0',
            filter: 'blur(8px)',
            background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--color-second-light) 28%, transparent) 0%, color-mix(in srgb, var(--color-primary-light) 18%, transparent) 40%, transparent 72%)`
        });
        band.className = 'hero-wave-band';
        container.appendChild(band);
        return band;
    });

    bands.forEach((band, index) => {
        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.5 })
            .to(band, {
                opacity: config.opacity,
                xPercent: index % 2 === 0 ? 8 : -8,
                y: index % 2 === 0 ? -18 : 18,
                scaleX: 1.08,
                duration: config.duration + index,
                ease: 'sine.inOut'
            })
            .to(band, {
                rotate: index % 2 === 0 ? 3 : -3,
                duration: config.duration + 2,
                ease: 'sine.inOut'
            }, 0);
    });

    return bands;
}

function createAndAnimateParticleField(container, options = {}) {
    const config = { count: 20, opacity: 0.4, duration: 7, ...options };

    const particles = Array.from({ length: config.count }, (_, index) => {
        const particle = document.createElement('div');
        const pos = Utils.randomPosition(4, 96);
        const size = 2 + Math.random() * 6;
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            borderRadius: '999px',
            background: index % 3 === 0 ? 'var(--color-second-light)' : 'var(--color-primary-light)',
            boxShadow: '0 0 12px color-mix(in srgb, var(--color-primary-light) 50%, transparent)',
            opacity: '0',
            zIndex: '0'
        });
        particle.className = 'hero-particle';
        container.appendChild(particle);
        return particle;
    });

    particles.forEach((particle, index) => {
        gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.08 })
            .to(particle, {
                opacity: config.opacity,
                x: (Math.random() - 0.5) * 80,
                y: (Math.random() - 0.5) * 60,
                scale: 0.8 + Math.random() * 1.8,
                duration: config.duration + Math.random() * 3,
                ease: 'sine.inOut'
            });
    });

    return particles;
}

function applyHeroBackgroundTheme(container, themeName, options = {}) {
    switch (themeName) {
        case 'aurora-flow':
            createAndAnimateDiagonalLines(container, { count: 6, opacity: 0.28, scaleX: 4.8, duration: 5.2, rotationDuration: 11, ...options.diagonalLines });
            createAndAnimateGlowOrbs(container, { count: 6, opacity: 0.14 });
            createAndAnimateWaveBands(container, { count: 3, opacity: 0.12 });
            break;
        case 'orbital-math':
            createAndAnimateOrbitRings(container, { count: 4, opacity: 0.22 });
            createAndAnimateSplineCurves(container, { count: 2, size: 240, opacity: 0.18, duration: 8, rotationDuration: 14 });
            createAndAnimateParticleField(container, { count: 14, opacity: 0.32 });
            break;
        case 'signal-grid':
            createAndAnimateDiagonalLines(container, { count: 7, opacity: 0.18, scaleX: 5.4, duration: 3.8, rotationDuration: 9 });
            createAndAnimateSplineCurves(container, { count: 4, size: 150, opacity: 0.16, scale: 1.08, duration: 4.8, rotationDuration: 8 });
            createAndAnimateWaveBands(container, { count: 4, opacity: 0.1 });
            break;
        case 'tidal-spectrum':
            createAndAnimateWaveBands(container, { count: 5, height: 160, opacity: 0.14, duration: 8.5 });
            createAndAnimateGlowOrbs(container, { count: 5, opacity: 0.12, minSize: 110, maxSize: 260, duration: 7.5, drift: 48 });
            createAndAnimateParticleField(container, { count: 12, opacity: 0.24, duration: 6.8 });
            break;
        case 'lattice-orbits':
            createAndAnimateDiagonalLines(container, { count: 5, opacity: 0.16, scaleX: 4.6, duration: 4.5, rotationDuration: 10 });
            createAndAnimateOrbitRings(container, { count: 3, baseSize: 160, gap: 85, opacity: 0.2, duration: 14 });
            createAndAnimateParticleField(container, { count: 10, opacity: 0.22, duration: 7.2 });
            break;
        case 'scholar-glow':
            createAndAnimateSplineCurves(container, { count: 5, size: 135, opacity: 0.12, scale: 1.1, duration: 5.8, rotationDuration: 10 });
            createAndAnimateGlowOrbs(container, { count: 7, opacity: 0.1, minSize: 100, maxSize: 220, duration: 9, drift: 40 });
            createAndAnimateParticleField(container, { count: 18, opacity: 0.28, duration: 8.5 });
            break;
        case 'wavefront-field':
            createAndAnimateWaveContours(container, { count: 6, opacity: 0.15, duration: 7.8, minWidth: 24, maxWidth: 64 });
            createAndAnimateWaveBands(container, { count: 4, height: 150, opacity: 0.12, duration: 8.4 });
            createAndAnimateParticleField(container, { count: 12, opacity: 0.2, duration: 7.4 });
            break;
        case 'solar-system':
            createAndAnimateSolarCore(container, { centerX: 69, centerY: 36, size: 160, opacity: 0.18, duration: 7.2 });
            createAndAnimateOrbitRings(container, { count: 4, baseSize: 120, gap: 72, opacity: 0.18, duration: 13, centerX: 69, centerY: 36 });
            createAndAnimateParticleField(container, { count: 14, opacity: 0.24, duration: 8.2 });
            break;
        case 'equation-drift':
            createAndAnimateEquationGlyphs(container, {
                count: 9,
                opacity: 0.16,
                duration: 11.5,
                snippets: [...PHYSICS_EQUATION_SNIPPETS, '\\(u_t + 6u u_x + u_{xxx} = 0\\)'],
                fontMin: 1.05,
                fontMax: 1.7,
                xDrift: 44,
                yDrift: 30,
                textShadow: '0 0 20px color-mix(in srgb, var(--color-primary-light) 34%, transparent)'
            });
            createAndAnimateSplineCurves(container, { count: 4, size: 128, opacity: 0.11, scale: 1.06, duration: 6.4, rotationDuration: 11 });
            createAndAnimateDiagonalLines(container, { count: 4, opacity: 0.12, scaleX: 4.4, duration: 4.6, rotationDuration: 10 });
            break;
        case 'kdv-soliton':
            createAndAnimateSolitonWave(container, { count: 4, opacity: 0.26, duration: 9.5, widthBase: 260, widthStep: 82, heightBase: 56, heightStep: 10, blur: 9, glowStrength: 66 });
            createAndAnimateWaveContours(container, { count: 4, opacity: 0.12, duration: 8.8, minWidth: 32, maxWidth: 58 });
            createAndAnimateParticleField(container, { count: 10, opacity: 0.18, duration: 7.4 });
            break;
        case 'black-hole-lensing':
            createAndAnimateBlackHoleCore(container, { centerX: 71, centerY: 36, size: 145, opacity: 0.22, duration: 10.5 });
            createAndAnimateOrbitRings(container, { count: 3, baseSize: 135, gap: 64, opacity: 0.16, duration: 12.5, centerX: 71, centerY: 36 });
            createAndAnimateParticleField(container, { count: 16, opacity: 0.2, duration: 8.8 });
            break;
        case 'math-symbol-drift':
            createAndAnimateMathSymbols(container, { count: 10, opacity: 0.12, duration: 11.5 });
            createAndAnimateEquationGlyphs(container, { count: 5, opacity: 0.1, duration: 10, snippets: PHYSICS_EQUATION_SNIPPETS });
            createAndAnimateSplineCurves(container, { count: 3, size: 120, opacity: 0.1, scale: 1.05, duration: 6.8, rotationDuration: 11 });
            break;
        case 'physics-equations':
            createAndAnimateEquationGlyphs(container, {
                count: 10,
                opacity: 0.22,
                duration: 12.5,
                snippets: PHYSICS_EQUATION_SNIPPETS,
                fontMin: 1.2,
                fontMax: 1.95,
                color: 'color-mix(in srgb, var(--color-primary-lighter) 82%, white)',
                xDrift: 42,
                yDrift: 28,
                letterSpacing: '0.03em',
                textShadow: '0 0 22px color-mix(in srgb, var(--color-primary-light) 40%, transparent)'
            });
            createAndAnimateMathSymbols(container, {
                count: 10,
                opacity: 0.16,
                duration: 11.5,
                symbols: ['\\(\\nabla\\)', '\\(\\partial\\)', '\\(\\gamma\\)', '\\(\\psi\\)', '\\(\\Lambda\\)', '\\(\\mu_0\\)', '\\(\\varepsilon_0\\)', '\\(\\pi\\)']
            });
            createAndAnimateSolitonWave(container, { count: 2, opacity: 0.12, duration: 10.2, topStart: 58, topGap: 18, widthBase: 300, widthStep: 60, heightBase: 42, heightStep: 6, blur: 10, glowStrength: 58 });
            createAndAnimateParticleField(container, { count: 12, opacity: 0.18, duration: 8.4 });
            break;
        case 'phase-portrait':
            createAndAnimateSplineCurves(container, { count: 6, size: 132, opacity: 0.12, scale: 1.08, duration: 6.6, rotationDuration: 12 });
            createAndAnimateEquationGlyphs(container, { count: 6, opacity: 0.08, duration: 10.8 });
            createAndAnimateParticleField(container, { count: 10, opacity: 0.16, duration: 7.8 });
            break;
        case 'nebula-equations':
            createAndAnimateGlowOrbs(container, { count: 8, opacity: 0.12, minSize: 130, maxSize: 280, duration: 9.5, drift: 52 });
            createAndAnimateEquationGlyphs(container, {
                count: 7,
                opacity: 0.1,
                duration: 11.4,
                snippets: PHYSICS_EQUATION_SNIPPETS,
                fontMin: 1,
                fontMax: 1.6
            });
            createAndAnimateParticleField(container, { count: 22, opacity: 0.26, duration: 9 });
            break;
        case 'resonance-rings':
            createAndAnimateOrbitRings(container, { count: 5, baseSize: 110, gap: 56, opacity: 0.16, duration: 12.5, centerX: 70, centerY: 38 });
            createAndAnimateWaveContours(container, { count: 4, opacity: 0.11, duration: 8.2, minWidth: 28, maxWidth: 54 });
            createAndAnimateParticleField(container, { count: 12, opacity: 0.18, duration: 8.2 });
            break;
        case 'harmonic-mesh':
            createAndAnimateDiagonalLines(container, { count: 8, opacity: 0.14, scaleX: 5.2, duration: 4.3, rotationDuration: 9 });
            createAndAnimateSplineCurves(container, { count: 5, size: 140, opacity: 0.11, scale: 1.06, duration: 5.2, rotationDuration: 9.5 });
            createAndAnimateParticleField(container, { count: 14, opacity: 0.18, duration: 7.2 });
            break;
        case 'wave-packets':
            createAndAnimateSolitonWave(container, { count: 4, opacity: 0.14, duration: 8.6 });
            createAndAnimateWaveBands(container, { count: 5, height: 130, opacity: 0.1, duration: 7.8 });
            createAndAnimateParticleField(container, { count: 8, opacity: 0.14, duration: 6.8 });
            break;
        case 'eclipse-grid':
            createAndAnimateBlackHoleCore(container, { centerX: 72, centerY: 35, size: 128, opacity: 0.18, duration: 9.8 });
            createAndAnimateDiagonalLines(container, { count: 6, opacity: 0.12, scaleX: 5.0, duration: 4.6, rotationDuration: 10.5 });
            createAndAnimateParticleField(container, { count: 12, opacity: 0.16, duration: 8.4 });
            break;
        case 'tensor-cloud':
            createAndAnimateMathSymbols(container, { count: 12, opacity: 0.11, duration: 12 });
            createAndAnimateGlowOrbs(container, { count: 6, opacity: 0.1, minSize: 120, maxSize: 250, duration: 8.8, drift: 46 });
            createAndAnimateParticleField(container, { count: 16, opacity: 0.2, duration: 8.2 });
            break;
        case 'spiral-spectra':
            createAndAnimateOrbitRings(container, { count: 4, baseSize: 130, gap: 66, opacity: 0.18, duration: 13.4, centerX: 70, centerY: 37 });
            createAndAnimateGlowOrbs(container, { count: 5, opacity: 0.08, minSize: 100, maxSize: 200, duration: 8.4, drift: 38 });
            createAndAnimateDiagonalLines(container, { count: 5, opacity: 0.1, scaleX: 4.4, duration: 4.8, rotationDuration: 9.8 });
            break;
        case 'constellation-drift':
        default:
            createAndAnimateParticleField(container, { count: 26, opacity: 0.34, duration: 8 });
            createAndAnimateGlowOrbs(container, { count: 4, opacity: 0.1, minSize: 120, maxSize: 220 });
            createAndAnimateSplineCurves(container, { count: 3, size: 110, opacity: 0.14, scale: 1.15, duration: 7, rotationDuration: 12 });
            break;
    }
}

function initSectionBackgroundAnimations(sectionSelector, options = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section) {
        console.warn(`Section with selector "${sectionSelector}" not found. Skipping background animations.`);
        return;
    }

    const shapesContainer = Utils.createContainer(section, '.morphing-shapes', 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden');

    // Create background animations immediately for hero section
    shapesContainer.innerHTML = '';
    const selectedTheme = HERO_BACKGROUND_THEMES[Math.floor(Math.random() * HERO_BACKGROUND_THEMES.length)];
    shapesContainer.setAttribute('data-hero-theme', selectedTheme);
    applyHeroBackgroundTheme(shapesContainer, selectedTheme, options);
}

// Performance optimizations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

window.addEventListener('resize', function() {
    // Refresh any GSAP animations if needed
    if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.invalidate();
    }
});
