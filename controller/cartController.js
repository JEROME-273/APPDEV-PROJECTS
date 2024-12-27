const shopModel = require('../model/shopModel');
const MainModel = require('../model/mainModel');
const db = require('../config/db');

// Get cart page
exports.getCartPage = async (req, res) => {
    const user = req.session.user || null; 
    const cart = req.session.cart || []; 
    const cartWithShopName = [];
    
    for (let item of cart) {
        const shop = await shopModel.getShopById(item.shopId);
        
        if (shop) {
            item.shopName = shop.shopName; 
        } else {
            item.shopName = "Unknown Shop"; 
        }
        const productData = await shopModel.getProductById(item.id); 
        if (productData) {
            item.availableStock = productData.p_quantity; 
        }

        cartWithShopName.push(item);
    }
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    res.render('cart', { cart: cartWithShopName, totalAmount, user });
};


//add to cart
exports.addToCart = async (req, res) => {
    const userId = req.session.user?.id;
    const productId = req.body.productId;

    if (!userId) {
        return res.status(403).json({ message: 'User not authenticated' });
    }

    try {
        const newProduct = await shopModel.getProductById(productId);

        if (!newProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        req.session.cart = req.session.cart || [];
        const existingProduct = req.session.cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
            await shopModel.updateCartItem(userId, productId, existingProduct.quantity);
        } else {
            // Add new product to cart
            const product = {
                id: newProduct.id,
                product_name: newProduct.p_name,
                price: newProduct.p_price,
                product_image: newProduct.p_image || 'default_image.jpg', 
                quantity: 1,
                shopId: newProduct.shopId
            };

            req.session.cart.push(product);

            await shopModel.addCartItem(userId, product);
        }

        const cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);

        res.json({ cartCount });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};


// Remove from cart
exports.removeFromCart = async (req, res) => {
    const productId = req.body.productId;

    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log("Cart before removal:", req.session.cart);
    const productIndex = req.session.cart.findIndex(item => item.id.toString() === productId.toString());

    if (productIndex === -1) {
        console.log("Product not found in cart:", productId);
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    req.session.cart.splice(productIndex, 1);
    console.log("Cart after removal:", req.session.cart);

    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        await shopModel.removeCartItem(userId, productId);
        const totalAmount = req.session.cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

        res.json({
            message: 'Product removed from cart',
            cart: req.session.cart,
            totalAmount: totalAmount.toFixed(2)  
        });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
};

//update cart
exports.updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    console.log('Received request to update cart:', productId, quantity);

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    console.log("Current cart in session:", req.session.cart);

    const cart = req.session.cart || [];
    const productIndex = cart.findIndex(item => item.id.toString() === productId.toString());

    if (productIndex === -1) {
        console.log("Product not found in cart:", productId); 
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Fetch the available stock from the products table
    try {
        const productData = await shopModel.getProductById(productId); 
        const availableStock = productData.p_quantity;

        if (quantity > availableStock) {
            return res.status(400).json({ message: `The quantity exceeds the available stock. Available stock: ${availableStock}` });
        }

        // Update the quantity in the cart
        cart[productIndex].quantity = quantity;

        console.log("Updated cart:", cart);

        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        await shopModel.updateCartItem(userId, productId, quantity);

        const totalAmount = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
        res.json({
            success: true,
            cart,
            totalAmount: totalAmount.toFixed(2)
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
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

        // Insert the order into the orders table
        const [order] = await connection.query(
            `INSERT INTO orders (user_id, address, contact_number, payment_method, total_amount, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [userId, address, cpnumber, paymentMethod, totalAmount, 'pending']
        );

        const orderId = order.insertId;

        const orderItems = [];
        for (const item of cart) {
            const [product] = await connection.query(
                `SELECT shopId FROM products WHERE id = ?`, 
                [item.id]
            );

            if (product.length === 0) {
                throw new Error(`Product with id ${item.id} not found.`);
            }

            // Push the order item data with the shopId
            orderItems.push([
                orderId, 
                item.id, 
                item.product_name, 
                item.product_image, 
                item.quantity, 
                product[0].shopId 
            ]);
        }

        // Insert all order items
        await connection.query(
            `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, shopId)
             VALUES ?`,
            [orderItems]
        );

        // Update product quantities in the products table
        for (const item of cart) {
            await connection.query(
                `UPDATE products SET p_quantity = p_quantity - ? WHERE id = ?`, 
                [item.quantity, item.id]
            );
        }

        await connection.commit();
        req.session.cart = []; // Clear the cart after order is completed
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
