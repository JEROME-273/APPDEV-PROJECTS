const productModel = require('../model/productModel');
const MainModel = require('../model/mainModel');
const db = require('../config/db');

// Get cart page
exports.getCartPage = (req, res) => {
    const user = req.session.user || null; 
    const cart = req.session.cart || []; 
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    res.render('cart', { cart, totalAmount, user }); 
};

// Add to cart 
exports.addToCart = async (req, res) => {
    const userId = req.session.user?.id;
    const productId = req.body.productId;

    if (!userId) {
        return res.status(403).json({ message: 'User not authenticated' });
    }

    try {
        const newProduct = await productModel.getProductById(productId);

        if (!newProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        req.session.cart = req.session.cart || [];
        const existingProduct = req.session.cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
            await productModel.updateCartItem(userId, productId, existingProduct.quantity);
        } else {
            req.session.cart.push({
                id: productId,
                product_name: newProduct.product_name,
                price: newProduct.price,
                product_image: newProduct.product_image,
                quantity: 1
            });
            await productModel.addCartItem(userId, {
                id: productId,
                product_name: newProduct.product_name,
                price: newProduct.price,
                product_image: newProduct.product_image,
                quantity: 1
            });
        }

        res.json({ message: 'Product added to cart', cart: req.session.cart });
    } catch (error) {
        console.error("Error adding to cart:", error); 
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

// Remove from cart
exports.removeFromCart = (req, res) => {
    const productId = req.body.productId;

    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }
    const initialLength = req.session.cart.length;
    req.session.cart = req.session.cart.filter(item => item.id !== productId);
    if (req.session.cart.length < initialLength) {
        const totalAmount = req.session.cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        return res.json({
            message: 'Product removed from cart',
            cart: req.session.cart,
            totalAmount: totalAmount.toFixed(2)  
        });
    } else {
        return res.status(404).json({ message: 'Product not found in cart' });
    }
};


// Update quantity in the cart
exports.updateCart = (req, res) => {
    const { productId, quantity } = req.body;
    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }
    const cart = req.session.cart || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
    }
    cart[productIndex].quantity = quantity;

    const totalAmount = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    res.json({
        success: true,    
        cart,
        totalAmount: totalAmount.toFixed(2) 
    });
};

// Get checkout page
exports.getCheckoutPage = async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    const cart = req.session.cart || [];
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    try {
        const user = await MainModel.getUserById(userId);
        res.render('checkout', { fullname: user.fullname, cart, totalAmount });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Confirm payment and finalize the order
exports.confirmPayment = async (req, res) => {
    const userId = req.session.user?.id;
    const { address, cpnumber, paymentMethod } = req.body;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.status(400).send('Your cart is empty');
    }

    const connection = await db.getConnection();  
    try {
        await connection.beginTransaction();
        const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const [order] = await connection.query(
            `INSERT INTO orders (user_id, address, contact_number, payment_method, total_amount, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [userId, address, cpnumber, paymentMethod, totalAmount, 'pending']
        );

        const orderId = order.insertId;  
        const orderItems = cart.map(item => [
            orderId, item.id, item.product_name, item.product_image, item.quantity
        ]);

        await connection.query(
            `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity)
             VALUES ?`,
            [orderItems]
        );

        for (const item of cart) {
            await connection.query(
                `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
                [item.quantity, item.id]
            );
        }

        await connection.commit();
        req.session.cart = []; 
        res.redirect('/thankyou');
    } catch (error) {
        await connection.rollback();
        console.error('Error confirming payment:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
};


// Thank you page after successful order
exports.getThankYouPage = (req, res) => {
    const user = req.session.user || null;
    res.render('thankyou', { user }); 
};
