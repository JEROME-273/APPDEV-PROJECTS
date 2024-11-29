const db = require('../config/db'); 
const pool = require('../config/db');

//get product page
exports.getProducts = async (req, res) => {
    try {
      const [products] = await db.query('SELECT * FROM products');
      products.forEach(product => {
        product.price = parseFloat(product.price);
      });
      res.render('admin/product', { products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products');
    }
  };
  

//get addProduct page
exports.getAddProductPage = (req, res) => {
    const errors = req.query.errors ? req.query.errors.split(',') : [];
    const success = req.query.success || null;
    res.render('admin/addProduct', { errors, success });
  };
  
  //add product to db
  exports.postAddProduct = async (req, res) => {
    const { product_name, price, quantity, description } = req.body;
    const product_image = req.file ? req.file.path.replace(/\\/g, '/') : null;  

    const errors = [];
    if (!product_name) errors.push('Product name is required.');
    if (!price) errors.push('Price is required.');
    if (!quantity) errors.push('Quantity is required.');
    if (!description) errors.push('Description is required.');

    if (errors.length > 0) {
        return res.redirect(`/admin/add-product?errors=${encodeURIComponent(errors.join(','))}`);
    }

    try {
        await db.query(
            'INSERT INTO products (product_name, price, quantity, product_image, description) VALUES (?, ?, ?, ?, ?)',
            [product_name, price, quantity, product_image, description]
        );
        res.redirect('/admin/products?success=Product added successfully.');
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Error adding product');
    }
};

// Get Edit Product Page
exports.getEditProductPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);

    if (product.length === 0) {
      return res.status(404).send('Product not found');
    }

    const errors = req.query.errors ? req.query.errors.split(',') : [];
    const success = req.query.success || null;

    res.render('admin/editProduct', { product: product[0], errors, success });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    res.status(500).send('Error fetching product for editing');
  }
};


// Post Edit Product
exports.postEditProduct = async (req, res) => {
  const productId = req.params.id;
  const { product_name, price, quantity, description } = req.body;
  let product_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const [product] = await db.query('SELECT product_image FROM products WHERE id = ?', [productId]);

    if (product.length === 0) {
      return res.status(404).send('Product not found');
    }

    if (!product_image) {
      product_image = product[0].product_image;
    }

    const errors = [];
    if (!product_name) errors.push('Product name is required.');
    if (!price) errors.push('Price is required.');
    if (!quantity) errors.push('Quantity is required.');

    if (errors.length > 0) {
      return res.redirect(`/admin/edit-product/${productId}?errors=${encodeURIComponent(errors.join(','))}`);
    }
    await db.query(
      'UPDATE products SET product_name = ?, price = ?, quantity = ?, product_image = ?, description = ? WHERE id = ?',
      [product_name, price, quantity, product_image, description, productId]
    );

    res.redirect('/admin/products?success=Product updated successfully.');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // Delete product from the database
    await db.query('DELETE FROM products WHERE id = ?', [productId]);

    // Redirect to the products page with a success message
    res.redirect('/admin/products?success=Product%20deleted%20successfully.');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
};


// Get the Orders page
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.order_id, o.user_id, o.address, o.contact_number, o.payment_method, o.total_amount, o.status, o.created_at,
             oi.product_name, oi.product_image, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status != "confirmed"
      ORDER BY o.created_at DESC
    `);
    
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

    ordersWithItems.forEach(order => {
      order.total_amount = parseFloat(order.total_amount).toFixed(2);
    });

    const success = req.query.success || null;

    res.render('admin/orders', { orders: ordersWithItems, success });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
};


//confirm orders
exports.confirmOrder = async (req, res) => {
  const orderId = req.params.order_id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [order] = await connection.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);

    if (order.length === 0) {
      return res.status(404).send('Order not found');
    }
    await connection.query(`
      INSERT INTO order_history (order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      order[0].order_id,
      order[0].user_id,
      order[0].address,
      order[0].contact_number,
      order[0].payment_method,
      order[0].total_amount,
      'confirmed',
      order[0].created_at
    ]);

    await connection.query('UPDATE orders SET status = ? WHERE order_id = ?', ['confirmed', orderId]);
    await connection.commit();
    res.redirect('/admin/orders?success=Order%20confirmed%20and%20moved%20to%20history.');
  } catch (error) {
    await connection.rollback();
    console.error('Error confirming order:', error);
    res.status(500).send('Error confirming order');
  } finally {
    connection.release();
  }
};



//get transaction history
exports.getOrderHistory = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM order_history ORDER BY created_at DESC');
    res.render('admin/order_history', { orders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).send('Error fetching order history');
  }
};

// Delete Order History
exports.deleteHistory = async (req, res) => {
  const orderId = req.params.order_id;
  try {
    await db.query('DELETE FROM order_history WHERE order_id = ?', [orderId]);
    res.redirect('/admin/order-history');
  } catch (error) {
    console.error('Error deleting order from history:', error);
    res.status(500).send('Error deleting order history');
  }
};


// Get the Cancelled Orders page
exports.getCancelledOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.order_id, o.user_id, o.address, o.contact_number, o.payment_method, o.total_amount, o.status, o.created_at,
             oi.product_name, oi.product_image, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = "cancelled"
      ORDER BY o.created_at DESC
    `);

    const cancelledOrders = orders.reduce((acc, order) => {
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

    cancelledOrders.forEach(order => {
      order.total_amount = parseFloat(order.total_amount).toFixed(2);
    });

    const success = req.query.success || null;

    res.render('admin/cancelled_orders', { cancelledOrders, success });
  } catch (error) {
    console.error('Error fetching cancelled orders:', error);
    res.status(500).send('Error fetching cancelled orders');
  }
};


exports.deleteCancelledOrder = async (req, res) => {
  const orderId = req.params.order_id; 
  console.log(`Deleting cancelled order with ID: ${orderId}`);

  try {
    await db.query('DELETE FROM orders WHERE order_id = ? AND status = "cancelled"', [orderId]);
    res.redirect('/admin/cancelled-orders?success=Order%20deleted%20successfully.');
  } catch (error) {
    console.error('Error deleting cancelled order:', error);
    res.status(500).send('Error deleting cancelled order');
  }
};

  
exports.clearAllCancelledOrders = async (req, res) => {
  try {
    await db.query('DELETE FROM orders WHERE status = "cancelled"');
    res.redirect('/admin/cancelled-orders?success=All cancelled orders have been deleted.');
  } catch (error) {
    console.error('Error clearing cancelled orders:', error);
    res.status(500).send('Error clearing cancelled orders');
  }
};

exports.loadMessages = async (req, res) => {
  const userId = req.session.user.id;  // Admin user ID

  console.log('Admin User ID:', userId);  // Log the admin user ID

  try {
      // Log the query before execution
      const query = `
      SELECT c.id AS contact_id, c.message, c.phone_number, c.created_at, u.fullname, u.email
      FROM contacts c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC;
      
      `;
      
      console.log('SQL Query:', query);  // Log the SQL query

      const [messages] = await pool.query(query, [userId]);
      
      console.log('Fetched Messages:', messages);  // Log the fetched messages

      if (messages && messages.length > 0) {
          res.render('admin/messages', { messages });
      } else {
          res.render('admin/messages', { messages: [] });  // Empty array if no messages
      }
  } catch (error) {
      console.error('Error fetching messages:', error);
      req.session.errorMsg = 'An error occurred while fetching messages.';
      res.redirect('/admin/dashboard');
  }
};


// Admin reply to a message
exports.replyMessage = async (req, res) => {
  const { messageId, adminReply } = req.body;  // messageId: ID of the contact message, adminReply: the reply text
  const adminId = req.session.user.id;  // Admin ID

  if (!adminReply || !messageId) {
      req.session.errorMsg = 'Please provide a reply to the message.';
      return res.redirect(`/admin/messages/${messageId}`);
  }

  try {
      // Insert the admin's reply into the admin_message table
      const query = `
          INSERT INTO admin_message (user_id, contact_id, admin_reply)
          VALUES (?, ?, ?)
      `;
      await pool.query(query, [adminId, messageId, adminReply]);

      req.session.successMsg = 'Your reply has been sent.';
      res.redirect('/admin/messages');  // Redirect back to the message list
  } catch (error) {
      console.error('Error replying to message:', error);
      req.session.errorMsg = 'An error occurred while replying to the message.';
      res.redirect(`/admin/messages/${messageId}`);
  }
};


  
