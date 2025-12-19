// ====================================
// CONFIGURATION - UPDATED TELEGRAM BOT
// ====================================
const TELEGRAM_BOT_TOKEN = '8427456667:AAG-l7vfALhGV3nTm_ngTFxnkMzzo-SPH4U';
const TELEGRAM_CHAT_ID = '1179617605'; // កែទៅ ID របស់អ្នក
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// ====================================
// GLOBAL VARIABLES
// ====================================
let cart = JSON.parse(localStorage.getItem('yayacafeCart')) || [];
let currentLang = localStorage.getItem('coffeeShopLang') || 'kh';
let favorites = JSON.parse(localStorage.getItem('yayacofaFavorites')) || [];
let menuItems = [];
let currentSlide = 0;
let totalSlides = 6;
let autoSlideInterval;
let cartCount = 0;
let isSubmittingOrder = false; // ប្រយោគការពារកម្មង់ច្រើនដង
let isSubmittingContact = false; // ប្រយោគការពារទំនាក់ទំនងច្រើនដង

// ====================================
// DOM ELEMENTS
// ====================================
const elements = {
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    cartToggle: document.getElementById('cartToggle'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartClose: document.getElementById('cartClose'),
    langToggle: document.getElementById('langToggle'),
    menuGrid: document.getElementById('menuGrid'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    cartCount: document.getElementById('cartCount'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    orderNowBtn: document.getElementById('orderNowBtn'),
    orderModal: document.getElementById('orderModal'),
    modalClose: document.getElementById('modalClose'),
    orderForm: document.getElementById('orderForm'),
    searchInput: document.querySelector('.search-input'),
    searchBtn: document.querySelector('.search-btn'),
    
    // Slideshow elements
    slidesContainer: document.querySelector('.slides-container'),
    dots: document.querySelectorAll('.navigation-dots .dot'),
    thumbs: document.querySelectorAll('.thumb'),
    progressBar: document.querySelector('.progress-bar'),
    currentSlideEl: document.querySelector('.current-slide'),
    totalSlidesEl: document.querySelector('.total-slides'),
    
    // Testimonial elements
    testimonialItems: document.querySelectorAll('.testimonial-item'),
    testimonialDots: document.querySelectorAll('.slider-dots .dot'),
    prevBtn: document.querySelector('.prev-btn'),
    nextBtn: document.querySelector('.next-btn'),
    
    // Contact form elements
    contactForm: document.getElementById('contactForm'),
    contactSubmitBtn: document.querySelector('#contactForm button[type="submit"]')
};

// ====================================
// INITIALIZATION
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Load cart from localStorage
    cart = JSON.parse(localStorage.getItem('yayacafeCart')) || [];
    cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Initialize all components
    extractMenuItemsFromHTML();
    initLanguage();
    initCart();
    initNavigation();
    initForms();
    initContactForm(); // បន្ថែមការដំណើរការទម្រង់ទំនាក់ទំនង
    initSearch();
    initMenuCategories();
    initAddToCartButtons();
    initSlideshow();
    initTestimonialSlider();
    updateCartUI();
    
    console.log('Initialization complete. Menu items:', menuItems.length);
});

// ====================================
// MENU ITEMS EXTRACTION
// ====================================
function extractMenuItemsFromHTML() {
    console.log('Extracting menu items from HTML...');
    
    const menuCards = document.querySelectorAll('.menu-card');
    console.log('Found menu cards:', menuCards.length);
    
    menuItems = [];
    
    menuCards.forEach((card, index) => {
        try {
            // Get item name
            const nameElement = card.querySelector('.menu-card-name');
            const nameKh = nameElement ? nameElement.textContent.trim() : `ឈ្មោះមិនស្គាល់ ${index+1}`;
            
            // For English names, use data attributes or fallback to Khmer
            const nameEn = card.getAttribute('data-name-en') || nameKh;
            
            // Get price
            const priceElement = card.querySelector('.menu-card-price');
            let price = 0;
            if (priceElement) {
                const priceText = priceElement.textContent;
                const priceMatch = priceText.match(/\$?(\d+(\.\d+)?)/);
                price = priceMatch ? parseFloat(priceMatch[1]) : 0;
            }
            
            // Get image
            const imageElement = card.querySelector('.menu-card-image');
            const image = imageElement ? imageElement.src : '';
            
            // Get categories from data-category attribute
            const categoriesAttr = card.getAttribute('data-category');
            const categories = categoriesAttr ? categoriesAttr.split(' ') : ['espresso'];
            const mainCategory = categories[0];
            
            // Get description
            const descElement = card.querySelector('.menu-card-description');
            const descriptionKh = descElement ? descElement.textContent.trim() : '';
            const descriptionEn = card.getAttribute('data-desc-en') || descriptionKh;
            
            // Create item object
            const item = {
                id: index + 1,
                nameEn: nameEn,
                nameKh: nameKh,
                price: price,
                category: mainCategory,
                image: image,
                descriptionEn: descriptionEn,
                descriptionKh: descriptionKh,
                categories: categories
            };
            
            menuItems.push(item);
            
            // Add data-id attribute to menu card
            card.setAttribute('data-id', item.id);
            
        } catch (error) {
            console.error('Error extracting menu item:', error);
        }
    });
    
    console.log('Successfully extracted menu items:', menuItems);
}

// ====================================
// LANGUAGE MANAGEMENT
// ====================================
function initLanguage() {
    // Set initial language
    updateLanguage(currentLang);
    
    // Language toggle event
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'kh' : 'en';
            localStorage.setItem('coffeeShopLang', currentLang);
            updateLanguage(currentLang);
            updateCartUI();
        });
    }
}

function updateLanguage(lang) {
    // Update HTML attribute
    document.documentElement.setAttribute('data-lang', lang);
    
    // Update language toggle button
    const langText = elements.langToggle?.querySelector('.lang-text');
    const khmerText = elements.langToggle?.querySelector('.lang-text.khmer');
    const flag = elements.langToggle?.querySelector('.flag');
    
    if (lang === 'en') {
        if (flag) flag.textContent = '🇰🇭';
        if (langText) langText.style.display = 'none';
        if (khmerText) khmerText.style.display = 'inline';
    } else {
        if (flag) flag.textContent = '🇰🇭';
        if (langText) langText.style.display = 'none';
        if (khmerText) khmerText.style.display = 'inline';
    }
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const enText = element.getAttribute('data-en');
        const khText = element.getAttribute('data-kh');
        
        if (enText && khText) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                element.placeholder = lang === 'kh' ? enText : khText;
            } else if (element.tagName === 'OPTION') {
                element.textContent = lang === 'kh' ? enText : khText;
            } else {
                element.textContent = lang === 'kh' ? enText : khText;
            }
        }
    });
    
    // Update form labels and placeholders
    const formInputs = {
        'orderName': { en: 'Your Name', kh: 'ឈ្មោះពេញ' },
        'orderPhone': { en: 'Phone Number', kh: 'លេខទូរស័ព្ទ' },
        'orderAddress': { en: 'Address/Delivery Details', kh: 'អាសយដ្ឋាន/ព័ត៌មានដឹកជញ្ជូន' },
        'orderType': { en: 'Select Order Type', kh: 'ជ្រើសរើសប្រភេទកម្មង់' },
        'orderNotes': { en: 'Additional Notes', kh: 'កំណត់ចំណាំបន្ថែម' },
        'name': { en: 'Your Name', kh: 'ឈ្មោះរបស់អ្នក' },
        'email': { en: 'Your Email', kh: 'អ៊ីមែលរបស់អ្នក' },
        'phone': { en: 'Your Phone', kh: 'ទូរស័ព្ទរបស់អ្នក' },
        'subject': { en: 'Select Subject', kh: 'ជ្រើសរើសប្រធានបទ' },
        'message': { en: 'Your Message', kh: 'សាររបស់អ្នក' }
    };
    
    Object.entries(formInputs).forEach(([id, texts]) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'SELECT') {
                const firstOption = element.querySelector('option[value=""]');
                if (firstOption) {
                    firstOption.textContent = lang === 'en' ? texts.en : texts.kh;
                }
            } else {
                element.placeholder = lang === 'en' ? texts.en : texts.kh;
            }
        }
    });
}

// ====================================
// CART MANAGEMENT
// ====================================
function initCart() {
    console.log('Initializing cart...');
    
    // Get all add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log('Found', addToCartButtons.length, 'add to cart buttons');
    
    // Add click event to each add to cart button
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart button clicked:', index);
            
            // Find the parent menu card
            const menuCard = this.closest('.menu-card');
            if (!menuCard) {
                console.error('Menu card not found');
                return;
            }
            
            // Get item details
            const itemName = menuCard.querySelector('.menu-card-name').textContent;
            const itemPriceText = menuCard.querySelector('.menu-card-price').textContent;
            const itemQtyElement = menuCard.querySelector('.qty-value');
            const itemQty = parseInt(itemQtyElement.textContent);
            
            // Extract price (remove $ symbol)
            const itemPrice = parseFloat(itemPriceText.replace('$', ''));
            
            console.log('Adding to cart:', itemName, 'Price:', itemPrice, 'Qty:', itemQty);
            
            // Add item to cart
            addToCart(itemName, itemPrice, itemQty);
            
            // Reset quantity to 1
            itemQtyElement.textContent = '1';
        });
    });
    
    // Initialize quantity buttons
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const qtyElement = this.parentElement.querySelector('.qty-value');
            let currentQty = parseInt(qtyElement.textContent);
            
            if (this.classList.contains('plus')) {
                currentQty++;
            } else if (this.classList.contains('minus') && currentQty > 1) {
                currentQty--;
            }
            
            qtyElement.textContent = currentQty;
        });
    });
    
    // Cart toggle button
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            console.log('Cart toggle clicked');
            showCartModal();
        });
    }
    
    // Order now button
    const orderNowBtn = document.getElementById('orderNowBtn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            console.log('Order now button clicked');
            showCartModal();
        });
    }
    
    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            hideCartModal();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('orderModal');
        if (e.target === modal) {
            hideCartModal();
        }
    });
    
    // Initialize checkout form
    initCheckoutForm();
}

// Add item to cart
function addToCart(name, price, quantity = 1) {
    console.log('Adding to cart:', name, price, quantity);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Update existing item quantity
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
    } else {
        // Add new item to cart
        cart.push({
            name: name,
            price: price,
            quantity: quantity,
            total: price * quantity
        });
    }
    
    // Update cart count
    cartCount += quantity;
    updateCartCount();
    
    // Save to localStorage
    localStorage.setItem('yayacafeCart', JSON.stringify(cart));
    
    // Show notification
    showNotification(`Added ${quantity} × ${name} to cart!`);
    
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

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.total, 0);
}

// Show cart modal
function showCartModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'flex';
        updateCartModal();
    }
}

// Hide cart modal
function hideCartModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update cart modal content
function updateCartModal() {
    const modalBody = document.querySelector('.modal-body');
    const totalAmountElement = document.querySelector('.total-amount');
    
    if (!modalBody || !totalAmountElement) {
        console.error('Modal elements not found');
        return;
    }
    
    if (cart.length === 0) {
        modalBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <p class="khmer-text">កន្ត្រកទទេ</p>
                <p class="english-text">Your cart is empty</p>
                <button class="btn btn-primary" id="continueShoppingBtn">
                    <span class="khmer-text">បន្តទិញ</span>
                    <span class="english-text">Continue Shopping</span>
                </button>
            </div>
        `;
        
        // Add event listener for continue shopping button
        setTimeout(() => {
            const continueBtn = document.getElementById('continueShoppingBtn');
            if (continueBtn) {
                continueBtn.addEventListener('click', hideCartModal);
            }
        }, 100);
        
    } else {
        let cartHTML = `
            <div class="cart-items">
                <h4 class="khmer-text">ទំនិញក្នុងកន្ត្រក</h4>
                <h4 class="english-text">Items in Cart</h4>
                <div class="cart-items-list">
        `;
        
        cart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p>$${item.price.toFixed(1)} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-qty">
                            <button class="cart-qty-minus" data-index="${index}" data-action="minus">-</button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button class="cart-qty-plus" data-index="${index}" data-action="plus">+</button>
                        </div>
                        <div class="cart-item-total">$${item.total.toFixed(1)}</div>
                        <button class="cart-item-remove" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
                </div>
            </div>
        `;
        
        modalBody.innerHTML = cartHTML;
        
        // Add event listeners after HTML is inserted
        setTimeout(() => {
            addCartItemEventListeners();
        }, 100);
    }
    
    // Update total amount
    const total = calculateCartTotal();
    if (totalAmountElement) {
        totalAmountElement.textContent = `$${total.toFixed(1)}`;
    }
}

// ====================================
// ADD EVENT LISTENERS FOR CART ITEMS
// ====================================
function addCartItemEventListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.cart-qty-minus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartItemQty(index, -1);
        });
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.cart-qty-plus').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartItemQty(index, 1);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}

// ====================================
// UPDATE CART ITEM QUANTITY
// ====================================
function updateCartItemQty(index, change) {
    if (index < 0 || index >= cart.length) return;
    
    const item = cart[index];
    const newQty = item.quantity + change;
    
    if (newQty < 1) {
        // Remove item if quantity becomes 0
        removeCartItem(index);
        return;
    }
    
    // Update quantity and total
    item.quantity = newQty;
    item.total = item.price * newQty;
    
    // Update cart count
    cartCount += change;
    
    // Save to localStorage
    localStorage.setItem('yayacafeCart', JSON.stringify(cart));
    
    // Update display
    updateCartCount();
    updateCartModal();
    
    // Show notification
    showNotification(`Updated ${item.name} quantity to ${newQty}`);
}

// ====================================
// REMOVE CART ITEM
// ====================================
function removeCartItem(index) {
    if (index < 0 || index >= cart.length) return;
    
    const itemName = cart[index].name;
    
    // Update cart count
    cartCount -= cart[index].quantity;
    
    // Remove item from cart
    cart.splice(index, 1);
    
    // Save to localStorage
    localStorage.setItem('yayacafeCart', JSON.stringify(cart));
    
    // Update display
    updateCartCount();
    updateCartModal();
    
    // Show notification
    showNotification(`Removed ${itemName} from cart`);
}

// ====================================
// SHOW NOTIFICATION
// ====================================
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #27ae60;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification i {
                font-size: 20px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ====================================
// CHECKOUT FORM INITIALIZATION
// ====================================
function initCheckoutForm() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        // ដកចេញ event listener ចាស់ទាំងអស់
        const newForm = orderForm.cloneNode(true);
        orderForm.parentNode.replaceChild(newForm, orderForm);
        
        // បន្ថែម event listener ថ្មី
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopImmediatePropagation(); // រារាំង event bubbling
            
            console.log('Order form submitted');
            
            if (cart.length === 0) {
                showNotification('Please add items to your cart first!');
                return;
            }
            
            // ពិនិត្យកំពុងដំណើរការរួចហើយ
            if (isSubmittingOrder) {
                showNotification('កម្មង់កំពុងដំណើរការរួចហើយ សូមរង់ចាំ...');
                return;
            }
            
            // ផ្ទៀងផ្ទាត់ទម្រង់
            const name = document.getElementById('orderName')?.value.trim();
            const phone = document.getElementById('orderPhone')?.value.trim();
            const address = document.getElementById('orderAddress')?.value.trim();
            const orderType = document.getElementById('orderType')?.value;
            
            if (!name || !phone || !orderType) {
                showNotification('សូមបំពេញព័ត៌មានទាំងអស់!');
                return;
            }
            
            // កំណត់ស្ថានភាពកំពុងដំណើរការ
            isSubmittingOrder = true;
            
            // បិទប៊ូតុង ដើម្បីបង្ការការចុចច្រើនដង
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn?.innerHTML || 'Place Order';
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> កំពុងដំណើរការ...';
                submitBtn.disabled = true;
            }
            
            try {
                // រៀបចំទិន្នន័យកម្មង់
                const orderData = {
                    name: name,
                    phone: phone,
                    address: address,
                    type: orderType,
                    notes: document.getElementById('orderNotes')?.value.trim() || '',
                    items: [...cart],
                    total: calculateCartTotal(), // យកតែសរុបដោយគ្មានពន្ធ
                    timestamp: new Date().toISOString(),
                    orderId: 'ORD-' + Date.now().toString().slice(-8)
                };
                
                console.log('Submitting order:', orderData);
                
                // ដាក់កម្មង់ទៅកាន់ Telegram
                const success = await submitOrderToTelegram(orderData);
                
                if (success) {
                    // សម្អាតកន្ត្រក
                    cart = [];
                    cartCount = 0;
                    localStorage.setItem('yayacafeCart', JSON.stringify(cart));
                    
                    // ធ្វើបច្ចុប្បន្នភាព UI
                    updateCartCount();
                    updateCartModal();
                    
                    // បិទម៉ូដាល់
                    hideCartModal();
                    
                    // សម្អាតទម្រង់
                    newForm.reset();
                    
                    // បង្ហាញសារជោគជ័យ
                    showNotification('កម្មង់បានជោគជ័យ!');
                }
                
            } catch (error) {
                console.error('Order submission error:', error);
                showNotification('មានកំហុសកើតឡើង។ សូមព្យាយាមម្ដងទៀត។');
            } finally {
                // ត្រឡប់ប៊ូតុងទៅស្ថានភាពធម្មតា
                isSubmittingOrder = false;
                
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
}

// ====================================
// SUBMIT ORDER TO TELEGRAM
// ====================================
async function submitOrderToTelegram(orderData) {
    console.log('Sending order to Telegram...');
    
    // Format items list
    const itemsList = orderData.items.map(item => {
        return `• ${item.name} × ${item.quantity} = $${item.total.toFixed(2)}`;
    }).join('\n');
    
    // Create message (ដកពន្ធចេញ)
    const message = `
🛒 *NEW ORDER - YAYA COFFEE* 🛒

👤 *Customer:* ${orderData.name}
📱 *Phone:* ${orderData.phone}
📍 *Type:* ${orderData.type === 'pickup' ? 'Pickup at store' : 'Delivery'}
${orderData.address ? `🏠 *Address:* ${orderData.address}\n` : ''}
${orderData.notes ? `📝 *Notes:* ${orderData.notes}\n` : ''}

📋 *Order Items:*
${itemsList}

💰 *Order Summary:*
• Subtotal: $${orderData.total.toFixed(2)}
• Tax: $0.00 (No tax)
• *Total: $${orderData.total.toFixed(2)}*

⏰ *Time:* ${new Date().toLocaleString('km-KH')}
🆔 *Order ID:* ${orderData.orderId}

📊 *Order Status:* NEW
    `;
    
    try {
        // Send to Telegram
        const response = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Order sent to Telegram successfully!');
            return true;
        } else {
            console.error('❌ Telegram API error:', result);
            
            // Save locally if Telegram fails
            try {
                const failedOrders = JSON.parse(localStorage.getItem('failedOrders')) || [];
                failedOrders.push({
                    data: orderData,
                    message: message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('failedOrders', JSON.stringify(failedOrders));
                
                console.log('Order saved locally for retry');
                showNotification('Order saved locally. Will retry later.');
                return true;
            } catch (storageError) {
                console.error('Failed to save locally:', storageError);
                return false;
            }
        }
    } catch (error) {
        console.error('❌ Network error sending to Telegram:', error);
        
        // Save locally on network error
        try {
            const failedOrders = JSON.parse(localStorage.getItem('failedOrders')) || [];
            failedOrders.push({
                data: orderData,
                message: message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('failedOrders', JSON.stringify(failedOrders));
            
            console.log('Order saved locally (network error)');
            showNotification('Order saved locally. Will retry later.');
            return true;
        } catch (storageError) {
            console.error('Failed to save locally:', storageError);
            return false;
        }
    }
}

// ====================================
// CONTACT FORM HANDLING
// ====================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // ដកចេញ event listener ចាស់ទាំងអស់
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        
        // បន្ថែម event listener ថ្មី
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopImmediatePropagation(); // រារាំង event bubbling
            
            console.log('Contact form submitted');
            
            // ពិនិត្យកំពុងដំណើរការរួចហើយ
            if (isSubmittingContact) {
                showNotification('សារកំពុងដំណើរការរួចហើយ សូមរង់ចាំ...');
                return;
            }
            
            // ទទួលទិន្នន័យពីទម្រង់
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const subject = document.getElementById('subject')?.value || 'General Inquiry';
            const message = document.getElementById('message')?.value.trim();
            
            // ផ្ទៀងផ្ទាត់ទិន្នន័យ
            if (!name || !message) {
                showNotification('សូមបំពេញឈ្មោះ និងសារចាំបាច់');
                return;
            }
            
            // ផ្ទៀងផ្ទាត់អ៊ីមែល (ប្រសិនបើមាន)
            if (email && !isValidEmail(email)) {
                showNotification('អ៊ីមែលមិនត្រឹមត្រូវ');
                return;
            }
            
            // កំណត់ស្ថានភាពកំពុងដំណើរការ
            isSubmittingContact = true;
            
            // បិទប៊ូតុង ដើម្បីបង្ការការចុចច្រើនដង
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn?.innerHTML || 'Send Message';
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> កំពុងផ្ញើ...';
                submitBtn.disabled = true;
            }
            
            try {
                // រៀបចំទិន្នន័យទំនាក់ទំនង
                const contactData = {
                    name: name,
                    email: email || 'Not provided',
                    phone: phone || 'Not provided',
                    subject: subject,
                    message: message,
                    timestamp: new Date().toISOString(),
                    contactId: 'CONT-' + Date.now().toString().slice(-8)
                };
                
                console.log('Submitting contact form:', contactData);
                
                // ដាក់ទិន្នន័យទៅកាន់ Telegram
                const success = await submitContactToTelegram(contactData);
                
                if (success) {
                    // សម្អាតទម្រង់
                    newForm.reset();
                    
                    // បង្ហាញសារជោគជ័យ
                    showNotification('សារបានផ្ញើជោគជ័យ!');
                    
                    // បង្ហាញសារបន្ថែម
                    setTimeout(() => {
                        showNotification('សារត្រូវបានផ្ញើទៅ Telegram រួចរាល់!');
                    }, 1500);
                }
                
            } catch (error) {
                console.error('Contact submission error:', error);
                showNotification('មានកំហុសកើតឡើង។ សូមព្យាយាមម្ដងទៀត។');
            } finally {
                // ត្រឡប់ប៊ូតុងទៅស្ថានភាពធម្មតា
                isSubmittingContact = false;
                
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
}

// ====================================
// SUBMIT CONTACT TO TELEGRAM
// ====================================
async function submitContactToTelegram(contactData) {
    console.log('Sending contact form to Telegram...');
    
    // Create formatted message for Telegram
    const message = `
📞 *NEW CONTACT FORM - YAYA COFFEE* 📞

👤 *Customer Information:*
• *Name:* ${contactData.name}
• *Email:* ${contactData.email}
• *Phone:* ${contactData.phone}
• *Subject:* ${contactData.subject}

💬 *Message:*
${contactData.message}

📊 *Details:*
• *Date:* ${new Date().toLocaleDateString('km-KH')}
• *Time:* ${new Date().toLocaleTimeString('km-KH')}
• *Contact ID:* ${contactData.contactId}

📍 *Priority:* ${contactData.subject.includes('Complaint') ? '🔴 URGENT' : '🟢 Normal'}
    `;
    
    try {
        // Send to Telegram
        const response = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Contact form sent to Telegram successfully!');
            return true;
        } else {
            console.error('❌ Telegram API error for contact:', result);
            
            // Save locally if Telegram fails
            try {
                const failedContacts = JSON.parse(localStorage.getItem('failedContacts')) || [];
                failedContacts.push({
                    data: contactData,
                    message: message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('failedContacts', JSON.stringify(failedContacts));
                
                console.log('Contact saved locally for retry');
                showNotification('Contact saved locally. Will retry later.');
                return true;
            } catch (storageError) {
                console.error('Failed to save locally:', storageError);
                return false;
            }
        }
    } catch (error) {
        console.error('❌ Network error sending contact to Telegram:', error);
        
        // Save locally on network error
        try {
            const failedContacts = JSON.parse(localStorage.getItem('failedContacts')) || [];
            failedContacts.push({
                data: contactData,
                message: message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('failedContacts', JSON.stringify(failedContacts));
            
            console.log('Contact saved locally (network error)');
            showNotification('Contact saved locally. Will retry later.');
            return true;
        } catch (storageError) {
            console.error('Failed to save locally:', storageError);
            return false;
        }
    }
}

// ====================================
// EMAIL VALIDATION
// ====================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====================================
// RETRY FAILED ORDERS AND CONTACTS
// ====================================
function retryFailedOrders() {
    const failedOrders = JSON.parse(localStorage.getItem('failedOrders')) || [];
    
    if (failedOrders.length === 0) return;
    
    console.log(`Retrying ${failedOrders.length} failed orders...`);
    
    // Retry the oldest failed order
    const oldestOrder = failedOrders[0];
    
    fetch(TELEGRAM_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: oldestOrder.message,
            parse_mode: 'Markdown'
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.ok) {
            console.log('✅ Successfully resent order');
            
            // Remove from failed orders
            const updatedOrders = failedOrders.slice(1);
            localStorage.setItem('failedOrders', JSON.stringify(updatedOrders));
            
            // Retry next order if exists
            if (updatedOrders.length > 0) {
                setTimeout(retryFailedOrders, 3000);
            }
        }
    })
    .catch(error => {
        console.error('Retry failed:', error);
    });
}

function retryFailedContacts() {
    const failedContacts = JSON.parse(localStorage.getItem('failedContacts')) || [];
    
    if (failedContacts.length === 0) return;
    
    console.log(`Retrying ${failedContacts.length} failed contacts...`);
    
    // Retry the oldest failed contact
    const oldestContact = failedContacts[0];
    
    fetch(TELEGRAM_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: oldestContact.message,
            parse_mode: 'Markdown'
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.ok) {
            console.log('✅ Successfully resent contact');
            
            // Remove from failed contacts
            const updatedContacts = failedContacts.slice(1);
            localStorage.setItem('failedContacts', JSON.stringify(updatedContacts));
            
            // Retry next contact if exists
            if (updatedContacts.length > 0) {
                setTimeout(retryFailedContacts, 3000);
            }
        }
    })
    .catch(error => {
        console.error('Retry failed:', error);
    });
}

// ====================================
// UPDATED CART COUNT FUNCTION
// ====================================
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        // Add pulse animation
        cartCountElement.classList.add('pulse');
        setTimeout(() => {
            cartCountElement.classList.remove('pulse');
        }, 300);
    }
}

// ====================================
// SEARCH FUNCTIONALITY
// ====================================
function initSearch() {
    if (!elements.searchInput) return;
    
    // Search input event
    elements.searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        document.querySelectorAll('.menu-card').forEach(card => {
            const name = card.querySelector('.menu-card-name')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.menu-card-description')?.textContent.toLowerCase() || '';
            
            if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
    
    // Search button event
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', function() {
            elements.searchInput.focus();
        });
    }
}

// ====================================
// SLIDESHOW FUNCTIONALITY
// ====================================
function initSlideshow() {
    if (!elements.slidesContainer) return;
    
    totalSlides = document.querySelectorAll('.premium-slide').length;
    
    // Set total slides number
    if (elements.totalSlidesEl) {
        elements.totalSlidesEl.textContent = totalSlides.toString().padStart(2, '0');
    }
    
    // Initialize auto slide
    startAutoSlide();
    
    // Navigation dots
    if (elements.dots) {
        elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                changeSlide(index);
                resetAutoSlide();
            });
        });
    }
    
    // Thumbnails
    if (elements.thumbs) {
        elements.thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                changeSlide(index);
                resetAutoSlide();
            });
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(currentSlide - 1);
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            changeSlide(currentSlide + 1);
            resetAutoSlide();
        }
    });
}

function changeSlide(index) {
    // Handle wrap around
    if (index < 0) {
        index = totalSlides - 1;
    } else if (index >= totalSlides) {
        index = 0;
    }
    
    // Update current slide
    currentSlide = index;
    
    // Update slides
    const slides = document.querySelectorAll('.premium-slide');
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update dots
    if (elements.dots) {
        elements.dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update thumbs
    if (elements.thumbs) {
        elements.thumbs.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Update slide counter
    if (elements.currentSlideEl) {
        elements.currentSlideEl.textContent = (index + 1).toString().padStart(2, '0');
    }
    
    // Update progress bar
    if (elements.progressBar) {
        elements.progressBar.style.width = `${((index + 1) / totalSlides) * 100}%`;
    }
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(currentSlide + 1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// ====================================
// TESTIMONIAL SLIDER
// ====================================
function initTestimonialSlider() {
    if (!elements.testimonialItems.length) return;
    
    let currentTestimonial = 0;
    const totalTestimonials = elements.testimonialItems.length;
    
    // Set initial state
    updateTestimonial(currentTestimonial);
    
    // Previous button
    if (elements.prevBtn) {
        elements.prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
            updateTestimonial(currentTestimonial);
        });
    }
    
    // Next button
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
            updateTestimonial(currentTestimonial);
        });
    }
    
    // Dots navigation
    if (elements.testimonialDots) {
        elements.testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                updateTestimonial(currentTestimonial);
            });
        });
    }
}

function updateTestimonial(index) {
    // Hide all testimonials
    elements.testimonialItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show current testimonial
    elements.testimonialItems[index].classList.add('active');
    
    // Update dots
    if (elements.testimonialDots) {
        elements.testimonialDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// ====================================
// NAVIGATION
// ====================================
function initNavigation() {
    // Mobile menu toggle
    if (elements.menuToggle && elements.mobileMenu) {
        elements.menuToggle.addEventListener('click', () => {
            elements.mobileMenu.classList.toggle('open');
            document.body.style.overflow = elements.mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.mobileMenu && 
            elements.mobileMenu.classList.contains('open') &&
            !elements.mobileMenu.contains(e.target) && 
            !elements.menuToggle.contains(e.target)) {
            elements.mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });
}

// ====================================
// FORM HANDLING
// ====================================
function initForms() {
    // Order Now button
    if (elements.orderNowBtn) {
        elements.orderNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                showMessage('សូមបន្ថែមមុខម្ហូបទៅកម្មង់មុន', 'warning');
                return;
            }
            openOrderModal();
        });
    }
    
    // Modal close button
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', () => {
            closeOrderModal();
        });
    }
    
    // Close modal when clicking outside
    if (elements.orderModal) {
        elements.orderModal.addEventListener('click', (e) => {
            if (e.target === elements.orderModal) {
                closeOrderModal();
            }
        });
    }
}

// ====================================
// MESSAGE SYSTEM
// ====================================
function showMessage(text, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-popup');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const message = document.createElement('div');
    message.className = `message-popup ${type}`;
    
    // Set icon based on type
    let icon = 'check-circle';
    if (type === 'error') icon = 'times-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'info') icon = 'info-circle';
    
    message.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${text}</span>
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
        message.style.opacity = '1';
    }, 10);
    
    // Remove after duration
    const duration = type === 'success' ? 5000 : 3000;
    setTimeout(() => {
        message.style.transform = 'translateX(120%)';
        message.style.opacity = '0';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, duration);
}

// ====================================
// UTILITY FUNCTIONS
// ====================================
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

function updateCartUI() {
    updateCartCount();
    updateCartModal();
}

// ====================================
// ADDITIONAL STYLES
// ====================================
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .message-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(120%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            min-width: 300px;
            max-width: 400px;
        }
        .message-popup.error { background: #e74c3c; }
        .message-popup.info { background: #3498db; }
        .message-popup.warning { background: #f39c12; }
        .message-popup i {
            font-size: 18px;
        }
        
        .add-to-cart-btn.added {
            background-color: #27ae60 !important;
            animation: bounce 0.5s ease;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-5px);}
            60% {transform: translateY(-3px);}
        }
        
        .cart-item.removing {
            opacity: 0;
            transform: translateX(-100%);
            transition: all 0.3s ease;
        }
        
        .order-modal.show {
            display: flex !important;
            align-items: center;
            justify-content: center;
        }
        
        .cart-sidebar.open {
            right: 0 !important;
        }
        
        .mobile-menu.open {
            transform: translateY(0) !important;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(120%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .pulse {
            animation: pulse 0.3s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        /* Disabled button styles */
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed !important;
        }
        
        /* Loading spinner */
        .fa-spinner {
            margin-right: 8px;
        }
        
        /* Contact form specific styles */
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        textarea.form-control {
            min-height: 120px;
            resize: vertical;
        }
        
        .btn-submit {
            background-color: #d4a574;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
        }
        
        .btn-submit:hover:not(:disabled) {
            background-color: #c8955c;
        }
        
        .btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
addStyles();

// ====================================
// INITIALIZE ON LOAD
// ====================================
window.addEventListener('load', () => {
    // Check for failed orders and retry
    const failedOrders = JSON.parse(localStorage.getItem('failedOrders')) || [];
    if (failedOrders.length > 0) {
        console.log(`Found ${failedOrders.length} failed orders, retrying...`);
        setTimeout(retryFailedOrders, 2000);
    }
    
    // Check for failed contacts and retry
    const failedContacts = JSON.parse(localStorage.getItem('failedContacts')) || [];
    if (failedContacts.length > 0) {
        console.log(`Found ${failedContacts.length} failed contacts, retrying...`);
        setTimeout(retryFailedContacts, 4000);
    }
    
    // Show welcome message
    setTimeout(() => {
        showMessage('សូមស្វាគមន៍មកកាន់ យ៉ាយ៉ាកាហ្វេ! ☕', 'info');
    }, 1000);
});

// ====================================
// EXPORT FOR DEBUGGING
// ====================================
window.app = {
    cart,
    menuItems,
    currentLang,
    favorites,
    updateLanguage,
    addToCart,
    removeCartItem,
    updateCartUI,
    submitOrderToTelegram,
    submitContactToTelegram,
    retryFailedOrders,
    retryFailedContacts
};