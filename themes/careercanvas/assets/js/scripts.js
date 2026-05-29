// Mobile menu toggle
document.getElementById('menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Section fade-in system
function initializeSectionFadeIn() {
    const sections = document.querySelectorAll('section[data-animate]');
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function initializeHeroProfileRotation() {
    const profileImage = document.getElementById('hero-profile-image');
    if (!profileImage) return;

    const imagesAttr = profileImage.getAttribute('data-images');
    if (!imagesAttr) return;

    let images = [];
    try {
        images = JSON.parse(imagesAttr);
    } catch (error) {
        return;
    }

    if (!Array.isArray(images) || images.length === 0) return;

    const storageKey = 'heroProfileImage';
    let previousImage = '';
    try {
        previousImage = window.sessionStorage.getItem(storageKey) || '';
    } catch (error) {
        previousImage = '';
    }

    let candidates = images;
    if (images.length > 1 && previousImage) {
        const filtered = images.filter((image) => image !== previousImage);
        if (filtered.length > 0) {
            candidates = filtered;
        }
    }

    const selectedImage = candidates[Math.floor(Math.random() * candidates.length)];
    if (!selectedImage) return;

    profileImage.setAttribute('src', selectedImage);
    try {
        window.sessionStorage.setItem(storageKey, selectedImage);
    } catch (error) {
        // Ignore storage failures and keep the random image selected for this load.
    }
}

// Initialize section fade-in when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSectionFadeIn();
    initializeHeroProfileRotation();
});
