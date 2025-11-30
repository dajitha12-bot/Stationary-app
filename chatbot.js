// Chatbot functionality for PinkStationery App

document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

function initializeChatbot() {
    const toggleButton = document.querySelector('.toggle-chatbot');
    const chatbotBody = document.querySelector('.chatbot-body');
    const sendButton = document.querySelector('.send-message');
    const chatInput = document.querySelector('.chatbot-input input');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    // Toggle chatbot visibility
    if (toggleButton && chatbotBody) {
        toggleButton.addEventListener('click', function() {
            chatbotBody.style.display = chatbotBody.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Send message on button click
    if (sendButton && chatInput) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Quick question buttons
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            chatInput.value = question;
            sendMessage();
        });
    });
}

// Send message function
function sendMessage() {
    const chatInput = document.querySelector('.chatbot-input input');
    const message = chatInput.value.trim();
    
    if (message) {
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Simulate bot response after a short delay
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addMessageToChat(botResponse, 'bot');
        }, 1000);
    }
}

// Add message to chat
function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.chatbot-messages');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.innerHTML = `<p>${message}</p>`;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate bot response
function generateBotResponse(userMessage) {
    const responses = {
        'business hours': 'Our business hours are Monday to Friday, 9 AM to 6 PM, and Saturday 10 AM to 4 PM. We are closed on Sundays.',
        'free shipping': 'Yes, we offer free shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹40 applies.',
        'payment methods': 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery.',
        'order tracking': 'You can track your order by going to the "My Orders" section and clicking on "Track Order". You will receive tracking updates via email and SMS.',
        'return policy': 'We have a 7-day return policy for unused products in original packaging. Please contact our customer service for returns.',
        'student discounts': 'Yes, we offer a 10% student discount on all orders. Use code STUDENT10 at checkout.',
        'delivery time': 'Standard delivery takes 3-5 business days. Express delivery (₹99 extra) takes 1-2 business days.',
        'international shipping': 'Currently, we only ship within India. We plan to expand internationally soon.',
        'order cancellation': 'You can cancel your order within 1 hour of placing it. After that, please contact customer service.',
        'bulk discounts': 'We offer special discounts for bulk orders. Please contact our sales team for customized quotes.',
        'create account': 'You can create an account by clicking on "Account" in the navigation and selecting "Sign Up".',
        'reset password': 'Go to the login page and click "Forgot Password". You will receive instructions via email.',
        'product catalog': 'We have a wide range of stationery products including pens, notebooks, art supplies, office supplies, and more.',
        'art supplies': 'We offer a variety of art supplies including color pencils, sketchbooks, watercolors, and more.',
        'office supplies': 'Our office supplies include notebooks, pens, folders, staplers, and other essentials.',
        'eco-friendly products': 'We have a dedicated "Eco-Friendly" category with sustainable stationery options.',
        'gift options': 'We offer gift wrapping and personalized messages for all products. Look for the gift icon at checkout.',
        'custom orders': 'We accept custom orders for bulk purchases. Please contact our customer service for details.',
        'customer service': 'You can reach our customer service at support@pinkstationery.com or call us at 1800-123-4567.',
        'store location': 'Our flagship store is located at 123 Stationery Street, Mumbai. We have stores in 5 major cities.',
        'mobile app': 'Our mobile app is available on both iOS and Android. Search for "PinkStationery" in your app store.',
        'apply coupons': 'You can apply coupons at the checkout page. Enter your coupon code in the designated field.',
        'warranty policy': 'Most of our products come with a 6-month warranty. Please check individual product pages for details.',
        'loyalty programs': 'We have a loyalty program where you earn points on every purchase that can be redeemed for discounts.',
        'order status': 'You can check your order status in the "My Orders" section of your account.'
    };
    
    // Find the best matching response
    const lowerMessage = userMessage.toLowerCase();
    let response = "I'm sorry, I didn't understand that. Could you please rephrase your question?";
    
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }
    
    return response;
}