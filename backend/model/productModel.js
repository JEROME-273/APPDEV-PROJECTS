const db = require('../config/db');

const productModel = {
    getAllProducts: async () => {
        const query = 'SELECT id, product_name, price, quantity, product_image FROM products';
        const [rows] = await db.execute(query); 

        rows.forEach(row => {
            row.price = parseFloat(row.price); 
        });

        return rows;
    },

    getProductById: async (id) => {
        const query = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        if (rows.length > 0) {
            const product = rows[0];
            product.price = parseFloat(product.price);  
            return product;
        }
        return null; 
    },
    

    addCartItem: async (userId, product) => {
        const { id, product_name, price, product_image, quantity } = product;
        const query = `INSERT INTO cart (user_id, product_id, product_name, price, product_image, quantity)
                       VALUES (?, ?, ?, ?, ?, ?)
                       ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
        
        try {
            await db.execute(query, [userId, id, product_name, price, product_image, quantity, quantity]);
        } catch (error) {
            console.error('Database error while adding to cart:', error.message);
            throw error; 
        }
    },

    updateCartItem: async (userId, productId, quantity) => {
        const query = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
        await db.execute(query, [quantity, userId, productId]);
    },

    
    updateProductQuantity: async (productId, quantity) => {
        const query = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
        try {
            await db.execute(query, [quantity, productId]);
        } catch (error) {
            console.error('Error updating product quantity:', error.message);
            throw error;
        }
    }
};

module.exports = productModel;
