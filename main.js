// ====================================
// TELEGRAM BOT CONFIGURATION (FIXED)
// ====================================
const TELEGRAM_CONFIG = {
    botToken: '8427456667:AAG-l7vfALhGV3nTm_ngTFxnkMzzo-SPH4U',
    chatId: '1179617605',
    
    // Use CORS proxy for development
    useProxy: true,
    corsProxyUrl: 'https://cors-anywhere.herokuapp.com/',
    
    // Telegram API URLs
    apiUrl: 'https://api.telegram.org/bot8427456667:AAG-l7vfALhGV3nTm_ngTFxnkMzzo-SPH4U'
};

// ====================================
// SIMPLE TELEGRAM BOT TESTER
// ====================================
function addTelegramDebugger() {
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'telegramDebugger';
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 2px solid #333;
        border-radius: 10px;
        padding: 15px;
        width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        font-family: Arial, sans-serif;
    `;
    
    debugPanel.innerHTML = `
        <h3 style="margin-top:0;color:#333;">🔧 Telegram Bot Tester</h3>
        <button onclick="testTelegramConnection()" style="background:#4CAF50;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;width:100%;margin-bottom:10px;">
            Test Bot Connection
        </button>
        <button onclick="sendTestMessage()" style="background:#2196F3;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;width:100%;margin-bottom:10px;">
            Send Test Message
        </button>
        <button onclick="getChatIdFromBot()" style="background:#9C27B0;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;width:100%;margin-bottom:10px;">
            Get Chat ID
        </button>
        <div id="debugResult" style="margin-top:10px;padding:10px;background:#f5f5f5;border-radius:5px;min-height:50px;font-size:12px;">
            Click a button to test
        </div>
    `;
    
    document.body.appendChild(debugPanel);
}

// ====================================
// IMPROVED TELEGRAM FUNCTIONS
// ====================================
async function sendToTelegram(message, type = 'order') {
    console.log(`📤 Sending ${type} to Telegram...`);
    
    try {
        // Try method 1: Direct API call
        const success1 = await sendMessageDirect(message);
        if (success1) return true;
        
        // Try method 2: CORS proxy
        const success2 = await sendMessageWithProxy(message);
        if (success2) return true;
        
        // Try method 3: Simple GET request
        const success3 = await sendMessageSimple(message);
        if (success3) return true;
        
        // All methods failed
        console.error('❌ All Telegram sending methods failed');
        saveToLocalStorage(message, type);
        return false;
        
    } catch (error) {
        console.error('❌ Telegram error:', error);
        saveToLocalStorage(message, type);
        return false;
    }
}

// Method 1: Direct API call (might have CORS issues)
async function sendMessageDirect(message) {
    try {
        const response = await fetch(TELEGRAM_CONFIG.apiUrl + '/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML' // Use HTML instead of Markdown for Khmer text
            })
        });
        
        const result = await response.json();
        if (result.ok) {
            console.log('✅ Direct method success');
            return true;
        }
        console.error('Direct method failed:', result.description);
        return false;
    } catch (error) {
        console.log('Direct method failed (CORS likely)');
        return false;
    }
}

// Method 2: CORS Proxy (for development)
async function sendMessageWithProxy(message) {
    try {
        const proxyUrl = TELEGRAM_CONFIG.corsProxyUrl;
        const apiUrl = TELEGRAM_CONFIG.apiUrl + '/sendMessage';
        
        const response = await fetch(proxyUrl + apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message
            })
        });
        
        const result = await response.json();
        if (result.ok) {
            console.log('✅ Proxy method success');
            return true;
        }
        return false;
    } catch (error) {
        console.log('Proxy method failed');
        return false;
    }
}

// Method 3: Simple GET request (no CORS issues)
async function sendMessageSimple(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodeURIComponent(message)}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Simple GET method success');
            return true;
        }
        return false;
    } catch (error) {
        console.log('Simple GET method failed');
        return false;
    }
}

// Save messages locally when Telegram fails
function saveToLocalStorage(message, type) {
    const key = `pending_${type}s`;
    const pending = JSON.parse(localStorage.getItem(key)) || [];
    
    pending.push({
        message: message,
        timestamp: new Date().toISOString(),
        attempts: 0
    });
    
    localStorage.setItem(key, JSON.stringify(pending));
    console.log(`📁 ${type} saved locally (${pending.length} pending)`);
    
    // Show user message
    alert(`⚠️ កម្មង់ត្រូវបានរក្សាទុក។ យើងនឹងផ្ញើទៅ Telegram ពេលមានអ៊ីនធឺណិត។`);
    
    // Try to resend in background
    setTimeout(() => retryPendingMessages(type), 5000);
}

// ====================================
// TEST FUNCTIONS (Run these in console)
// ====================================
async function testTelegramConnection() {
    const resultDiv = document.getElementById('debugResult');
    resultDiv.innerHTML = 'Testing bot connection...';
    
    try {
        // Test if bot token is valid
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getMe`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            resultDiv.innerHTML = `
                ✅ <strong>Bot is valid!</strong><br>
                Name: ${result.result.first_name}<br>
                Username: @${result.result.username}
            `;
            return true;
        } else {
            resultDiv.innerHTML = `❌ Bot error: ${result.description}`;
            return false;
        }
    } catch (error) {
        resultDiv.innerHTML = `❌ Network error: ${error.message}`;
        return false;
    }
}

async function sendTestMessage() {
    const resultDiv = document.getElementById('debugResult');
    resultDiv.innerHTML = 'Sending test message...';
    
    const testMessage = `🟢 Test message from Yaya Coffee\nTime: ${new Date().toLocaleString('km-KH')}`;
    
    const success = await sendToTelegram(testMessage, 'test');
    
    if (success) {
        resultDiv.innerHTML = '✅ Test message sent successfully!';
    } else {
        resultDiv.innerHTML = '❌ Failed to send test message';
    }
}

async function getChatIdFromBot() {
    const resultDiv = document.getElementById('debugResult');
    resultDiv.innerHTML = 'Getting Chat ID...<br><small>Please message your bot first</small>';
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getUpdates`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok && result.result.length > 0) {
            const chatId = result.result[0].message.chat.id;
            resultDiv.innerHTML = `
                ✅ <strong>Found Chat ID!</strong><br>
                Chat ID: <code>${chatId}</code><br>
                <button onclick="copyChatId('${chatId}')" style="background:#607D8B;color:white;border:none;padding:5px 10px;border-radius:3px;margin-top:5px;cursor:pointer;">
                    Copy to Clipboard
                </button>
            `;
        } else {
            resultDiv.innerHTML = `
                ⚠️ No messages found<br>
                Please send "/start" to your bot first
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `❌ Error: ${error.message}`;
    }
}

function copyChatId(chatId) {
    navigator.clipboard.writeText(chatId).then(() => {
        alert(`Chat ID ${chatId} copied to clipboard!`);
    });
}

// ====================================
// UPDATE YOUR FORM SUBMISSION FUNCTIONS
// ====================================
async function submitContactForm(formData) {
    // Format message
    const message = `
📞 <b>CONTACT FORM - YAYA COFFEE</b>

👤 <b>Name:</b> ${formData.name}
📧 <b>Email:</b> ${formData.email || 'N/A'}
📱 <b>Phone:</b> ${formData.phone || 'N/A'}
📋 <b>Subject:</b> ${formData.subject}
💬 <b>Message:</b>
${formData.message}

⏰ <b>Time:</b> ${new Date().toLocaleString('km-KH')}
    `;
    
    // Send to Telegram
    const sent = await sendToTelegram(message, 'contact');
    
    if (sent) {
        alert('✅ សារត្រូវបានផ្ញើដោយជោគជ័យទៅកាន់ Telegram!');
        document.getElementById('contactForm').reset();
    } else {
        alert('⚠️ សារត្រូវបានរក្សាទុក។ នឹងផ្ញើទៅ Telegram ពេលមានអ៊ីនធឺណិត។');
    }
}

async function submitOrder(orderData) {
    // Format items list
    const itemsList = orderData.items.map(item => {
        return `• ${item.name} × ${item.quantity} = $${item.total.toFixed(2)}`;
    }).join('\n');
    
    // Create message
    const message = `
🛒 <b>NEW ORDER - YAYA COFFEE</b>

👤 <b>Customer:</b> ${orderData.name}
📱 <b>Phone:</b> ${orderData.phone}
📍 <b>Type:</b> ${orderData.type === 'pickup' ? 'Pickup' : 'Delivery'}
${orderData.address ? `🏠 <b>Address:</b> ${orderData.address}\n` : ''}

📋 <b>Order Items:</b>
${itemsList}

💰 <b>Order Summary:</b>
• Subtotal: $${orderData.subtotal.toFixed(2)}
• Tax: $${orderData.tax.toFixed(2)}
• <b>Total: $${orderData.total.toFixed(2)}</b>

⏰ <b>Time:</b> ${new Date().toLocaleString('km-KH')}
🆔 <b>Order ID:</b> ORD-${Date.now().toString().slice(-8)}
    `;
    
    // Send to Telegram
    const sent = await sendToTelegram(message, 'order');
    
    if (sent) {
        alert('✅ កម្មង់ត្រូវបានផ្ញើដោយជោគជ័យទៅកាន់ Telegram!');
        // Clear cart
        cart = [];
        localStorage.setItem('yayacafeCart', JSON.stringify(cart));
        updateCartUI();
    } else {
        alert('⚠️ កម្មង់ត្រូវបានរក្សាទុក។ នឹងផ្ញើទៅ Telegram ពេលមានអ៊ីនធឺណិត។');
    }
}

// ====================================
// INITIALIZATION
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading Telegram bot tester...');
    
    // Add debug panel
    setTimeout(() => {
        addTelegramDebugger();
    }, 2000);
    
    // Test Telegram connection on load
    setTimeout(() => {
        testTelegramConnection();
    }, 3000);
});