// Artwork Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-artwork-image');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const imageContainer = document.querySelector('.main-image-container');
    
    let currentZoom = 1;
    const zoomStep = 0.2;
    const maxZoom = 3;
    const minZoom = 0.5;
    
    // Pan variables
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let lastTranslateX = 0;
    let lastTranslateY = 0;

    // --- Fix: Ensure buttons work on mobile and desktop ---
    function updateImageTransform() {
        if (currentZoom > 1) {
            const imageNaturalWidth = mainImage.naturalWidth || mainImage.width;
            const imageNaturalHeight = mainImage.naturalHeight || mainImage.height;
            const containerRect = imageContainer.getBoundingClientRect();
            const displayedWidth = imageNaturalWidth * currentZoom;
            const displayedHeight = imageNaturalHeight * currentZoom;
            const maxTranslateX = Math.max(0, (displayedWidth - containerRect.width) / 2 / currentZoom);
            const maxTranslateY = Math.max(0, (displayedHeight - containerRect.height) / 2 / currentZoom);
            translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
            translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
        } else {
            translateX = 0;
            translateY = 0;
        }
        mainImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;

        zoomInBtn.disabled = currentZoom >= maxZoom;
        zoomOutBtn.disabled = currentZoom <= minZoom;
        zoomInBtn.style.opacity = currentZoom >= maxZoom ? '0.5' : '1';
        zoomOutBtn.style.opacity = currentZoom <= minZoom ? '0.5' : '1';
        imageContainer.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        lastTranslateX = translateX;
        lastTranslateY = translateY;
    }

    // --- Fix: Use pointer events for cross-device support ---
    function addZoomListeners() {
        // Use both click and touchend for mobile
        function zoomInHandler(e) {
            e.preventDefault();
            if (currentZoom < maxZoom) {
                currentZoom = Math.min(maxZoom, currentZoom + zoomStep);
                updateImageTransform();
            }
        }
        function zoomOutHandler(e) {
            e.preventDefault();
            if (currentZoom > minZoom) {
                currentZoom = Math.max(minZoom, currentZoom - zoomStep);
                updateImageTransform();
            }
        }
        function zoomResetHandler(e) {
            e.preventDefault();
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            lastTranslateX = 0;
            lastTranslateY = 0;
            updateImageTransform();
        }

        zoomInBtn.addEventListener('click', zoomInHandler);
        zoomOutBtn.addEventListener('click', zoomOutHandler);
        zoomResetBtn.addEventListener('click', zoomResetHandler);

        zoomInBtn.addEventListener('touchend', zoomInHandler);
        zoomOutBtn.addEventListener('touchend', zoomOutHandler);
        zoomResetBtn.addEventListener('touchend', zoomResetHandler);
    }

    // --- Double tap to reset on mobile ---
    let lastTap = 0;
    imageContainer.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (e.touches.length === 0 && now - lastTap < 300) {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            lastTranslateX = 0;
            lastTranslateY = 0;
            updateImageTransform();
        }
        lastTap = now;
    });

    // --- Pan and pinch zoom ---
    let initialDistance = 0;
    let initialZoom = 1;
    let touches = [];

    imageContainer.addEventListener('touchstart', (e) => {
        touches = Array.from(e.touches);
        if (touches.length === 2) {
            initialDistance = getDistance(touches[0], touches[1]);
            initialZoom = currentZoom;
            e.preventDefault();
        } else if (touches.length === 1 && currentZoom > 1) {
            isPanning = true;
            startX = touches[0].clientX - translateX;
            startY = touches[0].clientY - translateY;
            e.preventDefault();
        }
    });

    imageContainer.addEventListener('touchmove', (e) => {
        touches = Array.from(e.touches);
        if (touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(touches[0], touches[1]);
            const scale = currentDistance / initialDistance;
            currentZoom = Math.max(minZoom, Math.min(maxZoom, initialZoom * scale));
            updateImageTransform();
        } else if (touches.length === 1 && isPanning && currentZoom > 1) {
            e.preventDefault();
            translateX = touches[0].clientX - startX;
            translateY = touches[0].clientY - startY;
            updateImageTransform();
        }
    });

    imageContainer.addEventListener('touchend', (e) => {
        if (isPanning) {
            isPanning = false;
            lastTranslateX = translateX;
            lastTranslateY = translateY;
        }
        if (e.touches.length === 0) {
            touches = [];
        }
    });

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // --- Desktop mouse pan ---
    imageContainer.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            imageContainer.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning && currentZoom > 1) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            lastTranslateX = translateX;
            lastTranslateY = translateY;
            imageContainer.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        }
    });

    // Prevent context menu and drag
    imageContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    mainImage.addEventListener('dragstart', (e) => e.preventDefault());

    // --- Initialize ---
    if (mainImage && zoomInBtn && zoomOutBtn && zoomResetBtn) {
        addZoomListeners();
        updateImageTransform();
    }

    // Fragment image interactions
    const fragmentItems = document.querySelectorAll('.fragment-item');
    fragmentItems.forEach(fragment => {
        fragment.addEventListener('click', () => {
            createFragmentLightbox(fragment.querySelector('img'));
        });
    });

    // Fragment lightbox functionality
    function createFragmentLightbox(img) {
        const lightbox = document.createElement('div');
        lightbox.className = 'fragment-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: -40px;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Fade in
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Close functionality
        function closeLightbox() {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            }, 300);
        }
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ========================================
    // VIDEO FUNCTIONALITY
    // ========================================
    
    const videoContainer = document.querySelector('.video-container');
    const video = document.querySelector('.video-container video');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    
    if (video && videoContainer) {
        // Video play/pause functionality with play icon management
        video.addEventListener('play', () => {
            videoContainer.classList.add('playing');
        });
        
        video.addEventListener('pause', () => {
            videoContainer.classList.remove('playing');
        });
        
        video.addEventListener('ended', () => {
            videoContainer.classList.remove('playing');
        });
        
        // Video loading events
        video.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded successfully');
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video failed to load:', e);
        });
        
        // Fullscreen functionality
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                toggleFullscreen();
            });
        }
        
        // Double-click on video for fullscreen
        video.addEventListener('dblclick', () => {
            toggleFullscreen();
        });
        
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                if (videoContainer.requestFullscreen) {
                    videoContainer.requestFullscreen();
                } else if (videoContainer.webkitRequestFullscreen) {
                    videoContainer.webkitRequestFullscreen();
                } else if (videoContainer.msRequestFullscreen) {
                    videoContainer.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (document.fullscreenElement === videoContainer || 
                document.webkitFullscreenElement === videoContainer ||
                document.msFullscreenElement === videoContainer) {
                videoContainer.classList.add('fullscreen-active');
                if (fullscreenBtn) {
                    fullscreenBtn.textContent = 'Exit Fullscreen';
                }
            } else {
                videoContainer.classList.remove('fullscreen-active');
                if (fullscreenBtn) {
                    fullscreenBtn.textContent = 'Full Screen';
                }
            }
        }
        
        videoContainer.addEventListener('click', (e) => {
            if (e.target === video || e.target === videoContainer) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }

    // Keyboard navigation for artwork pages
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const prevLink = document.querySelector('.nav-artwork[href*="artwork-20"]');
            const nextLink = document.querySelector('.nav-artwork[href*="artwork-2"]');
            
            if (e.key === 'ArrowLeft' && prevLink) {
                window.location.href = prevLink.href;
            } else if (e.key === 'ArrowRight' && nextLink) {
                window.location.href = nextLink.href;
            }
        }
    });

    // Smooth scroll to sections within artwork page
    const artworkSections = document.querySelectorAll('.fragments-section, .video-section');
    artworkSections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(section);
    });
});