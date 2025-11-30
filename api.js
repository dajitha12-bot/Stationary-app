// API functions for PinkStationery App

// Base API URL (would be replaced with actual API endpoint in production)
const API_BASE_URL = 'https://api.pinkstationery.com';

// Simulated API functions for frontend demo
const API = {
    // Get all products
    getProducts: async function() {
        // In a real app, this would be a fetch call to the API
        // For demo, we'll return mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        name: 'School Backpack',
                        price: 499,
                        description: 'Water-resistant backpack with multiple compartments',
                        category: 'bags',
                        image: 'bag.jpg'
                    },
                    {
                        id: '2',
                        name: 'Color Pencil Set',
                        price: 349,
                        description: '36 vibrant color pencils for artists',
                        category: 'art-supplies',
                        image: 'colors.jpg'
                    },
                    {
                        id: '3',
                        name: 'Premium Notebook',
                        price: 199,
                        description: 'High-quality notebook with 200 pages',
                        category: 'notebooks',
                        image: 'notebook.jpg'
                    },
                    {
                        id: '4',
                        name: 'Gel Pen Set',
                        price: 149,
                        description: 'Set of 12 smooth-writing gel pens',
                        category: 'pens',
                        image: 'pen.jpg'
                    }
                ]);
            }, 500);
        });
    },
    
    // Place order
    placeOrder: async function(orderData) {
        // In a real app, this would be a POST request to the API
        return new Promise((resolve) => {
            setTimeout(() => {
                const orderId = 'ORD' + Date.now();
                resolve({
                    success: true,
                    orderId: orderId,
                    message: 'Order placed successfully'
                });
            }, 1000);
        });
    },
    
    // Track order
    trackOrder: async function(orderId) {
        // In a real app, this would be a GET request to the API
        return new Promise((resolve) => {
            setTimeout(() => {
                const statuses = ['pending', 'confirmed', 'shipped', 'out-for-delivery', 'delivered'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                resolve({
                    orderId: orderId,
                    status: randomStatus,
                    estimatedDelivery: '2023-12-15',
                    trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
                });
            }, 800);
        });
    },
    
    // User login
    login: async function(credentials) {
        // In a real app, this would be a POST request to the API
        return new Promise((resolve) => {
            setTimeout(() => {
                if (credentials.email && credentials.password) {
                    resolve({
                        success: true,
                        user: {
                            id: 'user123',
                            name: 'Demo User',
                            email: credentials.email
                        },
                        token: 'demo-token-' + Math.random().toString(36).substr(2)
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }
            }, 1000);
        });
    }
};

// GPS tracking simulation
const GPSTracker = {
    // Simulate order tracking with GPS
    trackOrder: function(orderId, callback) {
        // In a real app, this would connect to a real GPS service
        const interval = setInterval(() => {
            const status = this.getRandomStatus();
            const location = this.getRandomLocation();
            
            callback({
                orderId: orderId,
                status: status,
                location: location,
                timestamp: new Date().toISOString()
            });
            
            if (status === 'delivered') {
                clearInterval(interval);
            }
        }, 3000);
    },
    
    getRandomStatus: function() {
        const statuses = [
            'order_placed',
            'processing',
            'shipped',
            'out_for_delivery',
            'delivered'
        ];
        
        const randomIndex = Math.floor(Math.random() * statuses.length);
        return statuses[randomIndex];
    },
    
    getRandomLocation: function() {
        const locations = [
            'Mumbai Warehouse',
            'In Transit - Mumbai to Delhi',
            'Delhi Distribution Center',
            'Out for delivery in your area',
            'Delivered to your address'
        ];
        
        const randomIndex = Math.floor(Math.random() * locations.length);
        return locations[randomIndex];
    }
};