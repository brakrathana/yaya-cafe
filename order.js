// កែសម្រួលមុខងារ calculateCartTotal
function calculateCartTotal() {
    let total = 0;
    console.log('Calculating cart total...');
    console.log('Cart items:', cart);
    
    for (let item of cart) {
        // ត្រួតពិនិត្យថាតើ item មានទិន្នន័យត្រឹមត្រូវ
        if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
            const itemTotal = item.price * item.quantity;
            console.log(`${item.name}: $${item.price} × ${item.quantity} = $${itemTotal}`);
            total += itemTotal;
        } else if (item && item.total) {
            // ប្រើ total ដែលមានស្រាប់
            console.log(`${item.name}: total = $${item.total}`);
            total += item.total;
        } else {
            console.warn('Invalid item in cart:', item);
        }
    }
    
    console.log('Cart total:', total);
    return total;
}

// កែសម្រួលមុខងារ addToCart
function addToCart(name, price, quantity = 1) {
    console.log('Adding to cart:', name, price, quantity);
    
    // ត្រួតពិនិត្យតម្លៃ
    if (!name || typeof price !== 'number' || price <= 0 || quantity <= 0) {
        console.error('Invalid item data:', { name, price, quantity });
        showNotification('Error adding item to cart!');
        return;
    }
    
    // រកមើលទំនិញដែលមានរួច
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // បន្ថែមបរិមាណទៅលើទំនិញដែលមានរួច
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].total = cart[existingItemIndex].price * cart[existingItemIndex].quantity;
        console.log('Updated existing item:', cart[existingItemIndex]);
    } else {
        // បន្ថែមទំនិញថ្មី
        const newItem = {
            id: Date.now(),
            name: name,
            price: price,
            quantity: quantity,
            total: price * quantity
        };
        cart.push(newItem);
        console.log('Added new item:', newItem);
    }
    
    // ធ្វើបច្ចុប្បន្នភាពការបង្ហាញ
    updateCartCount();
    
    // រក្សាទុកក្នុង localStorage
    saveCartToStorage();
    
    // បង្ហាញការជូនដំណឹង
    showNotification(`បានបន្ថែម ${quantity} × ${name} ទៅកន្ត្រក!`);
}

// កែសម្រួលមុខងារ updateCartModal
function updateCartModal() {
    const modalBody = document.querySelector('.modal-body');
    const totalAmountElement = document.querySelector('.total-amount');
    
    if (!modalBody || !totalAmountElement) {
        console.error('Modal elements not found');
        return;
    }
    
    console.log('Updating cart modal. Cart items:', cart.length);
    
    if (cart.length === 0) {
        modalBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <p class="khmer-text">កន្ត្រកទទេ</p>
                <p class="english-text">Your cart is empty</p>
                <button class="btn btn-primary" onclick="hideCartModal()">
                    <span class="khmer-text">បន្តទិញ</span>
                    <span class="english-text">Continue Shopping</span>
                </button>
            </div>
        `;
    } else {
        let cartHTML = `
            <div class="cart-items">
                <h4 class="khmer-text">ទំនិញក្នុងកន្ត្រក</h4>
                <h4 class="english-text">Items in Cart</h4>
                <div class="cart-items-list">
        `;
        
        cart.forEach((item, index) => {
            // គណនាតម្លៃសរុបសម្រាប់ធាតុនីមួយៗ
            const itemTotal = calculateItemTotal(item);
            
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-info">
                        <h5>${item.name || 'ទំនិញគ្មានឈ្មោះ'}</h5>
                        <p>$${(item.price || 0).toFixed(2)} × ${item.quantity || 1}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-qty">
                            <button class="cart-qty-minus" onclick="updateCartItemQty(${index}, -1)">-</button>
                            <span class="cart-qty-value">${item.quantity || 1}</span>
                            <button class="cart-qty-plus" onclick="updateCartItemQty(${index}, 1)">+</button>
                        </div>
                        <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                        <button class="cart-item-remove" onclick="removeCartItem(${index})">
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
    }
    
    // ធ្វើបច្ចុប្បន្នភាពតម្លៃសរុប
    const total = calculateCartTotal();
    console.log('Setting total amount to:', total);
    totalAmountElement.textContent = `$${total.toFixed(2)}`;
}

// បន្ថែមមុខងារ calculateItemTotal
function calculateItemTotal(item) {
    if (!item) return 0;
    
    if (item.total && typeof item.total === 'number') {
        return item.total;
    } else if (item.price && item.quantity) {
        return item.price * item.quantity;
    } else if (item.price) {
        return item.price * 1;
    }
    return 0;
}

// កែសម្រួលមុខងារ updateCartItemQty
function updateCartItemQty(index, change) {
    if (index < 0 || index >= cart.length) {
        console.error('Invalid cart item index:', index);
        return;
    }
    
    const item = cart[index];
    console.log('Updating item quantity:', item, 'change:', change);
    
    const currentQty = item.quantity || 1;
    const newQty = currentQty + change;
    
    if (newQty < 1) {
        // លុបទំនិញបើបរិមាណក្លាយជា 0
        removeCartItem(index);
        return;
    }
    
    // ធ្វើបច្ចុប្បន្នភាពបរិមាណ និងតម្លៃសរុប
    item.quantity = newQty;
    item.total = (item.price || 0) * newQty;
    
    console.log('Updated item:', item);
    
    // ធ្វើបច្ចុប្បន្នភាពការបង្ហាញ
    updateCartCount();
    updateCartModal();
    
    // រក្សាទុកក្នុង localStorage
    saveCartToStorage();
}

// កែសម្រួលមុខងារ updateCartCount
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        // គណនាបរិមាណទំនិញសរុបក្នុងកន្ត្រក
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += (item.quantity || 1);
        });
        
        cartCountElement.textContent = totalItems;
        console.log('Cart count updated to:', totalItems);
        
        // បន្ថែម animation
        cartCountElement.classList.add('pulse');
        setTimeout(() => {
            cartCountElement.classList.remove('pulse');
        }, 300);
    }
}

// កែសម្រួល initCart សម្រាប់ទទួលតម្លៃត្រឹមត្រូវ
function initCart() {
    console.log('Initializing cart... Cart items:', cart.length);
    
    // ទទួលប៊ូតុងបន្ថែមទំនិញទាំងអស់
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log('Found', addToCartButtons.length, 'add to cart buttons');
    
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart button clicked:', index);
            
            // រក menu card
            const menuCard = this.closest('.menu-card');
            if (!menuCard) {
                console.error('Menu card not found');
                return;
            }
            
            // ទទួលព័ត៌មានទំនិញ
            const itemNameElement = menuCard.querySelector('.menu-card-name');
            const itemPriceElement = menuCard.querySelector('.menu-card-price');
            const itemQtyElement = menuCard.querySelector('.qty-value');
            
            if (!itemNameElement || !itemPriceElement || !itemQtyElement) {
                console.error('Required elements not found');
                return;
            }
            
            const itemName = itemNameElement.textContent.trim();
            const itemPriceText = itemPriceElement.textContent.trim();
            const itemQtyText = itemQtyElement.textContent.trim();
            
            // សម្អាតតម្លៃ (យកតែលេខ)
            const itemPrice = parseFloat(itemPriceText.replace(/[^0-9.]/g, ''));
            const itemQty = parseInt(itemQtyText) || 1;
            
            console.log('Item details:', {
                name: itemName,
                priceText: itemPriceText,
                price: itemPrice,
                quantity: itemQty
            });
            
            // បន្ថែមទំនិញទៅកន្ត្រក
            addToCart(itemName, itemPrice, itemQty);
            
            // កំណត់បរិមាណឡើងវិញជា 1
            itemQtyElement.textContent = '1';
        });
    });
    
    // ទទួលប៊ូតុងបរិមាណ
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const qtyElement = this.parentElement.querySelector('.qty-value');
            if (!qtyElement) return;
            
            let currentQty = parseInt(qtyElement.textContent) || 1;
            
            if (this.classList.contains('plus')) {
                currentQty++;
            } else if (this.classList.contains('minus') && currentQty > 1) {
                currentQty--;
            }
            
            qtyElement.textContent = currentQty;
            console.log('Quantity changed to:', currentQty);
        });
    });
    
    // ប៊ូតុងបង្ហាញកន្ត្រក
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            console.log('Cart toggle clicked');
            showCartModal();
        });
    }
    
    // ប៊ូតុង Order Now
    const orderNowBtn = document.getElementById('orderNowBtn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            console.log('Order now button clicked');
            showCartModal();
        });
    }
    
    // ប៊ូតុងបិទ modal
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            hideCartModal();
        });
    }
    
    // បិទ modal ពេលចុចខាងក្រៅ
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('orderModal');
        if (e.target === modal) {
            hideCartModal();
        }
    });
    
    // ដំឡើងទម្រង់បញ្ជាទិញ
    initCheckoutForm();
}

// បន្ថែម console.log សម្រាប់ការតាមដានបញ្ហា
console.log = (function() {
    const origLog = console.log;
    return function(...args) {
        // បង្ហាញ console.log ធម្មតា
        origLog.apply(console, args);
        
        // បង្ហាញក្នុងទំព័រ (សម្រាប់ការតាមដាន)
        const debugDiv = document.getElementById('debug') || (function() {
            const div = document.createElement('div');
            div.id = 'debug';
            div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#000;color:#0f0;padding:10px;font-size:12px;z-index:9999;max-height:200px;overflow:auto;display:none;';
            document.body.appendChild(div);
            return div;
        })();
        
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ');
        
        debugDiv.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
        debugDiv.scrollTop = debugDiv.scrollHeight;
    };
})();

// បន្ថែមប៊ូតុង toggle debug
document.addEventListener('DOMContentLoaded', function() {
    const debugToggle = document.createElement('button');
    debugToggle.textContent = 'Debug';
    debugToggle.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:10000;background:#333;color:#fff;padding:5px;border:none;border-radius:3px;';
    debugToggle.onclick = function() {
        const debugDiv = document.getElementById('debug');
        if (debugDiv) {
            debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
        }
    };
    document.body.appendChild(debugToggle);
});