
// Update JavaScript to handle navigation
function initNavigation() {
    // Mobile menu toggle
    if (elements.menuToggle && elements.mobileMenu) {
        elements.menuToggle.addEventListener('click', () => {
            elements.mobileMenu.classList.toggle('open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.mobileMenu && !elements.mobileMenu.contains(e.target) && 
            elements.menuToggle && !elements.menuToggle.contains(e.target) &&
            elements.mobileMenu.classList.contains('open')) {
            elements.mobileMenu.classList.remove('open');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#order') {
                // If Order link is clicked, open order modal
                if (cart.length === 0) {
                    showMessage('សូមបន្ថែមមុខម្ហូបទៅកម្មង់មុន', 'warning');
                    return;
                }
                if (elements.orderModal) {
                    elements.orderModal.classList.add('show');
                }
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (elements.mobileMenu) {
                    elements.mobileMenu.classList.remove('open');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = ['#home', '#menu', '#about', '#contact'];
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    });
}
// ====================================
// NAVIGATION MANAGEMENT
// ====================================
function initNavigation() {
    console.log('Initializing navigation...');
    
    // Mobile menu toggle
    if (elements.menuToggle && elements.mobileMenu) {
        console.log('Found menu toggle and mobile menu');
        elements.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            console.log('Menu toggle clicked');
            elements.mobileMenu.classList.toggle('open');
            // Toggle hamburger icon
            const icon = elements.menuToggle.querySelector('i');
            if (elements.mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    } else {
        console.error('Menu elements not found:', {
            menuToggle: !!elements.menuToggle,
            mobileMenu: !!elements.mobileMenu
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (elements.mobileMenu) {
                elements.mobileMenu.classList.remove('open');
                // Reset hamburger icon
                const icon = elements.menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.mobileMenu && 
            elements.menuToggle && 
            !elements.mobileMenu.contains(e.target) && 
            !elements.menuToggle.contains(e.target) &&
            elements.mobileMenu.classList.contains('open')) {
            elements.mobileMenu.classList.remove('open');
            // Reset hamburger icon
            const icon = elements.menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            
            // If Order link is clicked, open order modal
            if (targetId === '#order' || link.classList.contains('order-link')) {
                if (cart.length === 0) {
                    showMessage('សូមបន្ថែមមុខម្ហូបទៅកម្មង់មុន', 'warning');
                    return;
                }
                if (elements.orderModal) {
                    elements.orderModal.classList.add('show');
                    // Close mobile menu if open
                    if (elements.mobileMenu) {
                        elements.mobileMenu.classList.remove('open');
                        const icon = elements.menuToggle?.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (elements.mobileMenu) {
                    elements.mobileMenu.classList.remove('open');
                    const icon = elements.menuToggle?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = ['#home', '#menu', '#about', '#contact'];
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
                        if (link.getAttribute('href') === sectionId) {
                            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
                                l.classList.remove('active');
                            });
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    });
}