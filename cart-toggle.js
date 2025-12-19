// script.js

// Shopping Cart Functionality
let cart = [];
let cartCount = 0;

// Initialize the shopping cart
function initCart() {
    const cartToggle = document.getElementById('cartToggle');
    const orderNowBtn = document.getElementById('orderNowBtn');
    const orderModal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');

    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            console.log('Cart button clicked');
            // Show cart or modal - you can customize this
            showCartModal();
        });
    }

    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', () => {
            console.log('Order Now button clicked');
            showOrderModal();
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            orderModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    // Initialize add to cart buttons
    initAddToCartButtons();
}

// Show cart modal function
function showCartModal() {
    const cartModal = document.getElementById('orderModal');
    if (cartModal) {
        cartModal.style.display = 'block';
        updateCartModalContent();
    } else {
        console.error('Cart modal not found');
        // Create a simple alert if modal doesn't exist
        alert(`Cart items: ${cartCount}\nTotal: $${calculateTotal().toFixed(2)}`);
    }
}

// Show order modal
function showOrderModal() {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.style.display = 'block';
    }
}

// Initialize add to cart buttons
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            if (!card) return;
            
            addItemToCart(card);
        });
    });

    // Also handle quantity buttons
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const qtySpan = e.target.parentElement.querySelector('.qty-value');
            let currentQty = parseInt(qtySpan.textContent);
            
            if (e.target.classList.contains('plus')) {
                currentQty++;
            } else if (e.target.classList.contains('minus') && currentQty > 1) {
                currentQty--;
            }
            
            qtySpan.textContent = currentQty;
        });
    });
}

// Add item to cart
function addItemToCart(card) {
    const itemName = card.querySelector('.menu-card-name').textContent;
    const itemPrice = parseFloat(card.querySelector('.menu-card-price').textContent.replace('$', ''));
    const itemQty = parseInt(card.querySelector('.qty-value').textContent);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === itemName);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += itemQty;
        cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: itemQty,
            total: itemPrice * itemQty
        });
    }
    
    // Update cart count
    cartCount += itemQty;
    updateCartCount();
    
    // Show confirmation
    showAddToCartConfirmation(itemName, itemQty);
    
    // Reset quantity
    card.querySelector('.qty-value').textContent = '1';
    
    console.log('Cart updated:', cart);
}

// Update cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        // Add animation
        cartCountElement.classList.add('pulse');
        setTimeout(() => {
            cartCountElement.classList.remove('pulse');
        }, 300);
    }
}

// Calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + item.total, 0);
}

// Update cart modal content
function updateCartModalContent() {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;
    
    if (cart.length === 0) {
        modalBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="closeModalAndGoToMenu()">Browse Menu</button>
            </div>
        `;
    } else {
        let cartHTML = `
            <div class="cart-items">
                <h4>Your Order</h4>
                <div class="cart-items-list">
        `;
        
        cart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-total">
                        $${item.total.toFixed(2)}
                        <button class="remove-item-btn" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span class="total-amount">$${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = cartHTML;
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-item-btn').dataset.index);
                removeItemFromCart(index);
            });
        });
    }
}

// Remove item from cart
function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cartCount -= cart[index].quantity;
        cart.splice(index, 1);
        updateCartCount();
        updateCartModalContent();
    }
}

// Show add to cart confirmation
function showAddToCartConfirmation(itemName, quantity) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Added ${quantity} × ${itemName} to cart!</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modal and go to menu
function closeModalAndGoToMenu() {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.style.display = 'none';
    }
    // Scroll to menu section
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
            });
        });
    }
}

// Language toggle functionality
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const currentLang = html.getAttribute('lang') || 'en';
            const newLang = currentLang === 'en' ? 'km' : 'en';
            
            html.setAttribute('lang', newLang);
            updateLanguageDisplay(newLang);
        });
    }
}

// Update language display
function updateLanguageDisplay(lang) {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const flag = langToggle.querySelector('.flag');
        const langText = langToggle.querySelectorAll('.lang-text');
        
        if (lang === 'km') {
            flag.textContent = '🇰🇭';
            langText[0].style.display = 'none';
            langText[1].style.display = 'inline';
        } else {
            flag.textContent = '🇺🇸';
            langText[0].style.display = 'inline';
            langText[1].style.display = 'none';
        }
    }
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-en], [data-kh]');
    elements.forEach(element => {
        if (lang === 'en' && element.dataset.en) {
            element.textContent = element.dataset.en;
        } else if (lang === 'km' && element.dataset.kh) {
            element.textContent = element.dataset.kh;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing cart...');
    
    // Initialize all functions
    initCart();
    initMobileMenu();
    initLanguageToggle();
    
    // Form submission handlers
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    }
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your order! We will prepare it soon.');
            orderForm.reset();
            document.getElementById('orderModal').style.display = 'none';
        });
    }
    
    console.log('Initialization complete');
});