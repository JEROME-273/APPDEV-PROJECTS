const db = require('../config/db');
const shopModel = {
   
    //Add to cart method
    addCartItem: async (userId, product) => {
        const { id, product_name, price, product_image, quantity, shopId } = product;
        if (!id || !product_name || !price || !product_image || !quantity || !shopId) {
            console.error("Missing fields in product:", {
                id, product_name, price, product_image, quantity, shopId
            });
            throw new Error('Missing required product information');
        }
        const query = `INSERT INTO cart (user_id, product_id, product_name, price, product_image, quantity, shopId)
                       VALUES (?, ?, ?, ?, ?, ?, ?)
                       ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
    
        try {
            console.log("Executing query:", query);
            console.log("Parameters:", [userId, id, product_name, price, product_image, quantity, shopId, quantity]);
    
            const [result] = await db.execute(query, [userId, id, product_name, price, product_image, quantity, shopId, quantity]);
            console.log("Query result:", result); 
            
            if (result.affectedRows > 0) {
                console.log("Cart updated or product added successfully");
            } else {
                console.warn("No rows were affected, possibly a duplicate entry issue");
            }
        } catch (error) {
            console.error('Database error while adding to cart:', error.message);
            throw error; 
        }
    },
    
    //update the Cart Items
    updateCartItem: async (userId, productId, quantity) => {
        const query = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;
    
        console.log("Updating cart item in DB:", userId, productId, quantity); 
    
        try {
            await db.execute(query, [quantity, userId, productId]);
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },
    
    

    //Update the quantity of product on cart
    updateProductQuantity: async (productId, quantity) => {
        const query = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
        try {
            await db.execute(query, [quantity, productId]);
        } catch (error) {
            console.error('Error updating product quantity:', error.message);
            throw error;
        }
    },

    //Remove product from cart
    removeCartItem: async (userId, productId) => {
        const query = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
        
        try {
            await db.execute(query, [userId, productId]);
            console.log(`Removed product ${productId} from user ${userId}'s cart.`);
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw new Error('Database error while removing item from cart');
        }
    },
    
    
    
    // Get shop by userId
    getShopByUserId: async (userId) => {
        const query = 'SELECT * FROM shop WHERE userId = ?';
        const [rows] = await db.execute(query, [userId]);
        return rows.length > 0 ? rows[0] : null; 
    },

    // Get shop by id
    getShopById: async (shopId) => {
        const query = 'SELECT * FROM shop WHERE id = ?';
        const [rows] = await db.execute(query, [shopId]);
        return rows.length > 0 ? rows[0] : null; 
    },


    // Create a new shop
    createShop: async (userId, shopName, shopProfile) => {
        const query = 'INSERT INTO shop (shopName, shopProfile, userId) VALUES (?, ?, ?)';
        await db.execute(query, [shopName, shopProfile, userId]);
    },

    getProductsByShopId: async (shopId) => {
        const query = 'SELECT * FROM products WHERE shopId = ?';
        const [rows] = await db.execute(query, [shopId]);
        return rows;
    },

    addProduct: async (shopId, p_name, p_price, p_quantity, p_image, p_description) => {
        const query = 'INSERT INTO products (shopId, p_name, p_price, p_quantity, p_image, p_description) VALUES (?, ?, ?, ?, ?, ?)';
        await db.execute(query, [shopId, p_name, p_price, p_quantity, p_image, p_description]);
    },

    // Update an existing product
    updateProduct: async (productId, p_name, p_price, p_quantity, p_image, p_description) => {
        const query = `
            UPDATE products 
            SET p_name = ?, p_price = ?, p_quantity = ?, p_description = ?, p_image = ? 
            WHERE id = ?`;

        const updatedImage = p_image || null;

        await db.execute(query, [p_name, p_price, p_quantity, p_description, updatedImage, productId]);
    },

    getProductById: async (productId) => {
        const query = 'SELECT * FROM products WHERE id = ?';
        try {
            const [rows] = await db.execute(query, [productId]);
            return rows[0]; 
        } catch (error) {
            console.error('Error getting product:', error);
            throw error;
        }
    },
    
    
    // Delete a product by its ID
    deleteProduct: async (productId) => {
        const query = 'DELETE FROM products WHERE id = ?';
        await db.execute(query, [productId]);
    },


    // Get all products with their associated shop name and profile
    getAllProductsWithShopName: async () => {
        const query = `
            SELECT products.*, shop.shopName, shop.shopProfile
            FROM products
            JOIN shop ON products.shopId = shop.id
        `;
        const [rows] = await db.execute(query);
        return rows;
    },

    // Fetch orders and their related items by userId
    getOrdersByUserId: async (userId) => {
    const query = `
        SELECT 
            orders.*, 
            order_items.product_id, 
            order_items.quantity, 
            products.p_name AS product_name, 
            products.p_image AS product_image
        FROM orders
        LEFT JOIN order_items ON orders.order_id = order_items.order_id
        LEFT JOIN products ON order_items.product_id = products.id
        WHERE orders.user_id = ?
    `;
    
    const [rows] = await db.execute(query, [userId]);
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
            quantity: row.quantity,
        });
    });

    orders.forEach(order => {
        if (!order.items) {
            order.items = []; 
        }
    });

    return orders;
},


// Fetch canceled orders by userId
getCanceledOrdersByUserId: async (userId) => {
    const query = 'SELECT * FROM orders WHERE user_id = ? AND status = "canceled"';
    try {
        const [rows] = await db.execute(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching canceled orders:', error.message);
        throw error;
    }
},

// Cancel an order by its ID
cancelOrder: async (orderId) => {
    const query = 'UPDATE orders SET status = "canceled" WHERE order_id = ? AND status = "pending"';

    try {
        const result = await db.execute(query, [orderId]);
        if (result.affectedRows === 0) {
            return null; 
        }

        return { order_id: orderId, status: "canceled" };
    } catch (error) {
        console.error('Error canceling the order:', error.message);
        throw error; 
    }
},

// Restore the product quantity when an order is canceled
restoreProductQuantity: async (productId, quantity) => {
    const query = 'UPDATE products SET p_quantity = p_quantity + ? WHERE id = ?';
    try {
        await db.execute(query, [quantity, productId]);
    } catch (error) {
        console.error('Error restoring product quantity:', error.message);
        throw error; 
    }
},

// New method to get product_id by product_name
getProductIdByName: async (productName) => {
    const query = 'SELECT id FROM products WHERE p_name = ?';
    try {
        const [rows] = await db.execute(query, [productName]);
        return rows.length > 0 ? rows[0].id : null; // Return the product_id or null if not found
    } catch (error) {
        console.error('Error fetching product ID:', error.message);
        throw error;
    }
}



};

module.exports = shopModel;
