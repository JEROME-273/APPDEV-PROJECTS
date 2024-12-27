const shopModel = require('../model/shopModel'); 
const userModel = require('../model/mainModel'); 
const upload = require('../config/multerConfig'); 
const pool = require('../config/db');

// get shop page
exports.getShopPage = async (req, res) => {
    try {
        const user = req.session.user || null;
        if (!user) {
            return res.redirect('/login');
        }
        const userShop = await shopModel.getShopByUserId(user.id);
        const products = await shopModel.getAllProductsWithShopName();
        const otherUsersProducts = products.filter(product => product.shopId !== userShop?.id);
        const orders = await shopModel.getOrdersByUserId(user.id);
        const pendingOrders = orders.filter(order => order.status !== 'canceled');
        const canceledOrders = orders.filter(order => order.status === 'canceled'); 
        const cartCount = req.session.cart ? req.session.cart.reduce((total, item) => total + item.quantity, 0) : 0;

        res.render('shop', {
            user,
            products: otherUsersProducts,
            noShopMessage: otherUsersProducts.length === 0 ? "No products available from other shops yet." : "",
            orders: pendingOrders, 
            canceledOrders: canceledOrders, 
            cartCount 
        });

    } catch (error) {
        console.error('Error fetching shop data:', error);
        res.status(500).send('Internal Server Error');
    }
};



// Get My shop page
exports.getMyShopPage = async (req, res) => {
    try {
        const user = req.session.user || null;
        if (!user) {
            return res.redirect('/login');
        }

        const cartCount = req.session.cart ? req.session.cart.length : 0;  
        const shop = await shopModel.getShopByUserId(user.id);

        if (!shop) {
            return res.render('myShop', { 
                user,
                shop: null,
                products: [],
                noShopMessage: "You don't have a shop. Do you want to create one?",
                cartCount 
            });
        }

        const products = await shopModel.getProductsByShopId(shop.id);

        res.render('myShop', { 
            user,
            shop: shop,
            products: products || [],
            noShopMessage: "",
            cartCount 
        });

    } catch (error) {
        console.error('Error fetching shop data:', error);
        res.status(500).send('Internal Server Error');
    }
};



// Get the "Create Shop" page
exports.getCreateShopPage = (req, res) => {
    const user = req.session.user || null;
    if (!user) {
        return res.redirect('/login');
    }
    res.render('createShop', { user });
};

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const user = req.session.user || null;
        if (!user) {
            return res.redirect('/login');
        }

        upload.single('shopProfile')(req, res, async (err) => {
            if (err) {
                console.error("Error uploading file:", err);
                return res.status(400).send("Error uploading the image.");
            }
            const { shopName } = req.body;
            const shopProfile = req.file ? req.file.filename : null; 

            if (!shopName || !shopProfile) {
                return res.status(400).send("Shop name and profile image are required.");
            }
            await shopModel.createShop(user.id, shopName, shopProfile);

            res.redirect('/my-shop');
        });
    } catch (error) {
        console.error('Error creating shop:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Add product page
exports.getAddProductPage = (req, res) => {
    const user = req.session.user; 
    res.render('addProduct', { user }); 
};


// Save new product to database
exports.addProduct = async (req, res) => {
    try {
        const { p_name, p_price, p_quantity, p_description } = req.body;
        const p_image = req.file ? req.file.filename : null;

        const user = req.session.user;
        const shop = await shopModel.getShopByUserId(user.id);

        if (shop) {
            await shopModel.addProduct(shop.id, p_name, p_price, p_quantity, p_image, p_description);
            res.redirect('/my-shop');
        } else {
            res.redirect('/create-shop'); 
        }
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        await shopModel.deleteProduct(productId);
        res.redirect('/my-shop');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Get Edit Product Page
exports.getEditProductPage = async (req, res) => {
    try {
        const user = req.session.user || null;
        if (!user) {
            return res.redirect('/login'); 
        }

        const productId = req.params.productId;
        const product = await shopModel.getProductById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('editProduct', { user, product });
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { p_name, p_price, p_quantity, p_description } = req.body;
        const productId = req.params.productId;
        let p_image = req.file ? req.file.filename : null;

        if (!p_image) {
            const product = await shopModel.getProductById(productId);
            p_image = product.p_image; 
        }

        await shopModel.updateProduct(productId, p_name, p_price, p_quantity, p_image, p_description);

        res.redirect('/my-shop');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
};

//Cancell Order
exports.cancelOrder = async (req, res) => {
    try {
        const user = req.session.user || null;
        if (!user) {
            return res.status(401).json({ message: 'You must be logged in to cancel an order.' });
        }

        const orderId = req.params.order_id;
        const orders = await shopModel.getOrdersByUserId(user.id);
        const order = orders.find(order => order.order_id === parseInt(orderId));

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (order.user_id !== user.id) {
            return res.status(403).json({ message: 'You do not have permission to cancel this order.' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: `Only pending orders can be canceled. Current status: ${order.status}` });
        }

        // Proceed to cancel the order
        const canceledOrder = await shopModel.cancelOrder(orderId);

        if (!canceledOrder) {
            return res.status(500).json({ message: 'An error occurred while trying to cancel the order.' });
        }

        const items = order.items;

        for (const item of items) {
            if (!item.product_name || !item.product_image) {
                console.error("Missing product_name or product_image in item:", item);
                return res.status(400).json({ message: 'Invalid product data in order items.' });
            }
            const productId = await shopModel.getProductIdByName(item.product_name);

            if (!productId) {
                console.error("Unable to find product_id for item:", item.product_name);
                return res.status(400).json({ message: 'Unable to find product_id for one or more items.' });
            }

            const product = await shopModel.getProductById(productId);
            if (!product) {
                console.error("Unable to find product details for productId:", productId);
                return res.status(400).json({ message: 'Unable to fetch product details for one or more items.' });
            }

            item.product_id = productId;
            item.price = product.p_price;
            item.shopId = product.shopId;
        }

        for (const item of items) {
            const { product_id, price, product_name, product_image, quantity, shopId } = item;

            if (!product_id || !price || !product_name || !product_image || !quantity || !shopId) {
                console.error("Missing required fields for cart insertion:", item);
                return res.status(400).json({ message: 'Missing required fields for cart insertion.' });
            }

            await shopModel.restoreProductQuantity(product_id, quantity);
            await shopModel.addCartItem(user.id, {
                id: product_id,
                product_name,
                price,
                product_image,
                quantity,
                shopId
            });
        }

        req.session.cancelledOrderMessage = 'Your order has been successfully canceled.';

        return res.json({
            message: 'Order successfully canceled',
            orderId: canceledOrder.order_id,
            totalAmount: canceledOrder.total_amount,
            items: items
        });

    } catch (error) {
        console.error('Error canceling the order:', error);
        return res.status(500).json({ message: 'An error occurred while trying to cancel the order.' });
    }
};


// Get Orders of users from myshop
exports.getOrders = async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    try {
        const shopQuery = `
            SELECT id AS shop_id
            FROM shop
            WHERE userId = ?;
        `;
        const [shopRows] = await pool.execute(shopQuery, [userId]);

        if (shopRows.length === 0) {
            return res.status(404).send('Shop not found');
        }

        const shopId = shopRows[0].shop_id;

        const query = `
            SELECT 
                orders.order_id, 
                orders.user_id, 
                orders.address, 
                orders.contact_number, 
                orders.payment_method, 
                orders.total_amount, 
                orders.status, 
                orders.created_at, 
                orders.updated_at,
                order_items.product_name, 
                order_items.product_image, 
                order_items.quantity,
                users.fullname  -- Join with users table to get fullname
            FROM orders
            INNER JOIN order_items ON orders.order_id = order_items.order_id
            INNER JOIN users ON orders.user_id = users.id  -- Join users table
            WHERE order_items.shopId = ?      -- Only orders for products from the logged-in user's shop
                AND orders.status = 'pending'  -- Only fetch 'pending' orders
            ORDER BY orders.created_at DESC;
        `;

        const [rows] = await pool.execute(query, [shopId]);

        const orders = [];
        rows.forEach(row => {
            let order = orders.find(o => o.order_id === row.order_id);
            if (!order) {
                order = { ...row, items: [] };
                orders.push(order);
            }
            order.items.push({
                product_name: row.product_name,
                product_image: row.product_image,
                quantity: row.quantity
            });
        });

        const [userRows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        const user = userRows[0]; 
        const cart = req.session.cart || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

        res.render('orders', { orders, user, cartCount });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Accept an order 
exports.acceptOrder = async (req, res) => {
    const orderId = req.params.order_id;

    try {
        const orderQuery = `SELECT * FROM orders WHERE order_id = ?`;
        const [orderRows] = await pool.execute(orderQuery, [orderId]);

        if (orderRows.length === 0) {
            return res.status(404).send('Order not found');
        }

        const order = orderRows[0];

        const updateQuery = `UPDATE orders SET status = 'confirmed' WHERE order_id = ?`;
        await pool.execute(updateQuery, [orderId]);

        const insertHistoryQuery = `
            INSERT INTO order_history (order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(insertHistoryQuery, [
            order.order_id,
            order.user_id,
            order.address,
            order.contact_number,
            order.payment_method,
            order.total_amount,
            'confirmed', 
            order.created_at,
            order.updated_at
        ]);

        res.redirect('/orders');
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).send('Internal Server Error');
    }
};



// Get Order History of users from myshop
exports.getOrderHistory = async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    try {
        const shopQuery = `
            SELECT id AS shop_id
            FROM shop
            WHERE userId = ?;
        `;
        const [shopRows] = await pool.execute(shopQuery, [userId]);

        if (shopRows.length === 0) {
            return res.status(404).send('Shop not found');
        }

        const shopId = shopRows[0].shop_id;

        // Fetch order history for the shop by joining order_history with order_items
        const query = `
            SELECT 
                order_history.history_id, 
                order_history.order_id, 
                order_history.user_id, 
                order_history.address, 
                order_history.contact_number, 
                order_history.payment_method, 
                order_history.total_amount, 
                order_history.status, 
                order_history.created_at, 
                order_history.updated_at, 
                users.fullname  
            FROM order_history
            INNER JOIN users ON order_history.user_id = users.id
            INNER JOIN order_items ON order_history.order_id = order_items.order_id
            WHERE order_items.shopId = ?
            ORDER BY order_history.created_at DESC;
        `;
        const [rows] = await pool.execute(query, [shopId]);
        const orderHistory = [];

        for (const row of rows) {
            let order = orderHistory.find(o => o.order_id === row.order_id);
            if (!order) {
                order = { ...row, items: [] };
                orderHistory.push(order);
            }

            const itemsQuery = `
                SELECT product_name, product_image, quantity
                FROM order_items
                WHERE order_id = ?
            `;
            const [itemsRows] = await pool.execute(itemsQuery, [row.order_id]);
            order.items = itemsRows; 
        }
        const [userRows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        const user = userRows[0];
        const cart = req.session.cart || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

        res.render('order_history', { orderHistory, user, cartCount });

    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Get Canceled Orders of users from myshop
exports.getCanceledOrders = async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    try {
        const shopQuery = `
            SELECT id AS shop_id
            FROM shop
            WHERE userId = ?;
        `;
        const [shopRows] = await pool.execute(shopQuery, [userId]);

        if (shopRows.length === 0) {
            return res.status(404).send('Shop not found');
        }

        const shopId = shopRows[0].shop_id;

        // Fetch canceled orders for the shop by joining orders with order_items
        const query = `
            SELECT 
                orders.order_id, 
                orders.user_id, 
                orders.address, 
                orders.contact_number, 
                orders.payment_method, 
                orders.total_amount, 
                orders.status, 
                orders.created_at, 
                orders.updated_at,
                order_items.product_name, 
                order_items.product_image, 
                order_items.quantity,
                users.fullname  -- Join with users table to get fullname
            FROM orders
            INNER JOIN order_items ON orders.order_id = order_items.order_id
            INNER JOIN users ON orders.user_id = users.id
            WHERE order_items.shopId = ?      -- Only orders for products from the logged-in user's shop
                AND orders.status = 'canceled'  -- Only fetch 'canceled' orders
            ORDER BY orders.created_at DESC;
        `;
        const [rows] = await pool.execute(query, [shopId]);

        const canceledOrders = [];
        rows.forEach(row => {
            let order = canceledOrders.find(o => o.order_id === row.order_id);
            if (!order) {
                order = { ...row, items: [] };
                canceledOrders.push(order);
            }
            order.items.push({
                product_name: row.product_name,
                product_image: row.product_image,
                quantity: row.quantity
            });
        });

        // Fetch the user's details
        const [userRows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
        const user = userRows[0];

        // Get cart information from the session
        const cart = req.session.cart || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

        // Render the canceled orders page
        res.render('canceled_orders', { canceledOrders, user, cartCount });

    } catch (error) {
        console.error('Error fetching canceled orders:', error);
        res.status(500).send('Internal Server Error');
    }
};















