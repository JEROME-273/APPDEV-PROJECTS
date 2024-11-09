const db = require('../config/db'); 

// Get orders by user ID
exports.getUserOrders = async (userId) => {
  try {
    const [orders] = await db.query(`
      SELECT o.order_id, o.user_id, o.address, o.contact_number, o.payment_method, o.total_amount, o.status, o.created_at,
             oi.product_name, oi.product_image, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    const ordersWithItems = orders.reduce((acc, order) => {
      const { order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at, product_name, product_image, quantity } = order;

      let existingOrder = acc.find(o => o.order_id === order_id);
      
      if (!existingOrder) {
        existingOrder = {
          order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at, items: []
        };
        acc.push(existingOrder);
      }

      if (product_name) {
        existingOrder.items.push({
          product_name, product_image, quantity
        });
      }

      return acc;
    }, []);
    
    return ordersWithItems;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};


// Cancel an order and update product quantities
exports.cancelOrder = async (orderId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [orderItems] = await connection.query(`
            SELECT oi.product_id, oi.quantity
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.order_id = ? AND o.status = 'pending'
        `, [orderId]);

        if (orderItems.length === 0) {
            throw new Error('Order not found or it cannot be cancelled.');
        }
        for (let item of orderItems) {
            const { product_id, quantity } = item;
            await connection.query(`
                UPDATE products 
                SET quantity = quantity + ?
                WHERE id = ?
            `, [quantity, product_id]); 
        }
        const [result] = await connection.query(`
            UPDATE orders
            SET status = 'cancelled'
            WHERE order_id = ? AND status = 'pending'
        `, [orderId]);

        if (result.affectedRows === 0) {
            throw new Error('Order status could not be updated to cancelled.');
        }
        await connection.commit();
        const [updatedOrder] = await connection.query(`
            SELECT * FROM orders WHERE order_id = ?
        `, [orderId]);

        return updatedOrder[0];
    } catch (error) {
        await connection.rollback();
        console.error('Error cancelling the order:', error);
        throw error;
    } finally {
        connection.release();
    }
};


exports.getOrderById = async (orderId) => {
    try {
        const [order] = await db.query(`
            SELECT * FROM orders WHERE order_id = ?
        `, [orderId]);

        return order[0];
    } catch (error) {
        console.error('Error fetching the order by ID:', error);
        throw error;
    }
};

exports.getOrderItems = async (orderId) => {
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return items; 
};
