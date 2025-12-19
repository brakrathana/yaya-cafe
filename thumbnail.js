class PremiumSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.premium-slide');
        this.dots = document.querySelectorAll('.dot');
        this.thumbs = document.querySelectorAll('.thumb');
        this.progressBar = document.querySelector('.progress-bar');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.progressInterval = null;
        this.slideDuration = 2000; // ថយពី 4000ms ទៅ 2000ms (2 វិនាទី)
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Initialize first slide
        this.updateSlideCounter();
        
        // Start auto slideshow
        this.startAutoSlide();
        
        // Add event listeners for dots
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
        
        // Add event listeners for thumbnails
        this.thumbs.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.closest('.thumb').dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
        
        // Pause on hover
        const slideshow = document.querySelector('.premium-slideshow');
        slideshow.addEventListener('mouseenter', () => this.pauseAutoSlide());
        slideshow.addEventListener('mouseleave', () => this.resumeAutoSlide());
        
        // Touch swipe support
        this.addTouchSupport();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Reset progress bar
        this.resetProgressBar();
        
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        this.thumbs[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
            this.thumbs[this.currentSlide].classList.add('active');
            this.updateSlideCounter();
            
            // Reset animation flag after CSS transition completes
            setTimeout(() => {
                this.isAnimating = false;
            }, 800); // Match CSS transition duration (0.8s)
        }, 50);
        
        // Restart auto slide timer
        this.resetAutoSlide();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoSlide() {
        // Clear existing interval
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        
        // Start new interval
        this.autoSlideInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        }, this.slideDuration);
        
        // Start progress bar
        this.startProgressBar();
    }
    
    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
            this.pauseProgressBar();
        }
    }
    
    resumeAutoSlide() {
        if (!this.autoSlideInterval) {
            this.resetAutoSlide();
        }
    }
    
    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
    
    startProgressBar() {
        // Reset progress bar
        this.progressBar.style.transition = 'none';
        this.progressBar.style.width = '0%';
        
        // Force reflow to ensure reset
        void this.progressBar.offsetWidth;
        
        // Start progress animation
        this.progressBar.style.transition = `width ${this.slideDuration}ms linear`;
        this.progressBar.style.width = '100%';
        
        // Clear existing timeout
        if (this.progressInterval) {
            clearTimeout(this.progressInterval);
        }
        
        // Set timeout for next slide (slightly before animation ends)
        this.progressInterval = setTimeout(() => {
            this.progressBar.style.width = '0%';
        }, this.slideDuration - 100);
    }
    
    pauseProgressBar() {
        const computedWidth = getComputedStyle(this.progressBar).width;
        this.progressBar.style.transition = 'none';
        this.progressBar.style.width = computedWidth;
        
        if (this.progressInterval) {
            clearTimeout(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    resetProgressBar() {
        this.progressBar.style.transition = 'none';
        this.progressBar.style.width = '0%';
        
        if (this.progressInterval) {
            clearTimeout(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    updateSlideCounter() {
        const currentSlideEl = document.querySelector('.current-slide');
        const totalSlidesEl = document.querySelector('.total-slides');
        
        if (currentSlideEl) {
            currentSlideEl.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }
        
        if (totalSlidesEl) {
            totalSlidesEl.textContent = String(this.totalSlides).padStart(2, '0');
        }
    }
    
    addTouchSupport() {
        const slideshow = document.querySelector('.premium-slideshow');
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartTime = 0;
        
        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartTime = Date.now();
        }, { passive: true });
        
        slideshow.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            touchEndX = e.changedTouches[0].screenX;
            const touchDuration = Date.now() - touchStartTime;
            
            // Only handle swipes that are quick enough
            if (touchDuration < 500) {
                this.handleSwipe(touchStartX, touchEndX);
            }
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// Initialize the premium slideshow when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for everything to load
    setTimeout(() => {
        new PremiumSlideshow();
    }, 500);
});