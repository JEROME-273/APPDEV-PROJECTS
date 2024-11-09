const db = require('../config/db'); 

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
    const { product_name, price, quantity } = req.body;
    const product_image = req.file ? req.file.path.replace(/\\/g, '/') : null;  

    const errors = [];
    if (!product_name) errors.push('Product name is required.');
    if (!price) errors.push('Price is required.');
    if (!quantity) errors.push('Quantity is required.');

    if (errors.length > 0) {
        return res.redirect(`/admin/add-product?errors=${encodeURIComponent(errors.join(','))}`);
    }

    try {
        await db.query(
            'INSERT INTO products (product_name, price, quantity, product_image) VALUES (?, ?, ?, ?)',
            [product_name, price, quantity, product_image]
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
  const { product_name, price, quantity } = req.body;
  let product_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const [product] = await db.query('SELECT product_image FROM products WHERE id = ?', [productId]);

    if (product.length === 0) {
      return res.status(404).send('Product not found');
    }

    // If no new image was uploaded, keep the current image
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
      'UPDATE products SET product_name = ?, price = ?, quantity = ?, product_image = ? WHERE id = ?',
      [product_name, price, quantity, product_image, productId]
    );

    res.redirect('/admin/products?success=Product updated successfully.');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
};


// Get the Orders page
exports.getOrders = async (req, res) => {
  try {
    // Fetch orders along with the order items (products) using a JOIN
    const [orders] = await db.query(`
      SELECT o.order_id, o.user_id, o.address, o.contact_number, o.payment_method, o.total_amount, o.status, o.created_at,
             oi.product_name, oi.product_image, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status != "confirmed"
      ORDER BY o.created_at DESC
    `);
    
    // If no products are associated with an order (in case of LEFT JOIN), we can handle this gracefully
    const ordersWithItems = orders.reduce((acc, order) => {
      const { order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at, product_name, product_image, quantity } = order;

      // Check if the order already exists in the accumulator
      let existingOrder = acc.find(o => o.order_id === order_id);

      if (!existingOrder) {
        existingOrder = {
          order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at, items: []
        };
        acc.push(existingOrder);
      }

      // Add the product to the order's items list
      if (product_name) {
        existingOrder.items.push({
          product_name, product_image, quantity
        });
      }

      return acc;
    }, []);

    // Format the total amount for each order (ensure proper decimal format)
    ordersWithItems.forEach(order => {
      order.total_amount = parseFloat(order.total_amount).toFixed(2);
    });

    // Extract 'success' from the query string (if it exists)
    const success = req.query.success || null;

    // Pass 'ordersWithItems' and 'success' to the view
    res.render('admin/orders', { orders: ordersWithItems, success });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
};



exports.confirmOrder = async (req, res) => {
  const orderId = req.params.order_id;

  const connection = await db.getConnection(); // Get a connection from the pool
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Query the order to get its details
    const [order] = await connection.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);

    if (order.length === 0) {
      return res.status(404).send('Order not found');
    }

    // Insert the order into the order_history table
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
      'confirmed', // Set the status to "confirmed"
      order[0].created_at
    ]);

    // Update the order status to 'confirmed' in the orders table (don't delete)
    await connection.query('UPDATE orders SET status = ? WHERE order_id = ?', ['confirmed', orderId]);

    // Commit the transaction
    await connection.commit();

    // Redirect back to the orders page with a success message
    res.redirect('/admin/orders?success=Order%20confirmed%20and%20moved%20to%20history.');
  } catch (error) {
    // Rollback in case of error
    await connection.rollback();
    console.error('Error confirming order:', error);
    res.status(500).send('Error confirming order');
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};




exports.getOrderHistory = async (req, res) => {
  try {
    // Fetch confirmed orders from the order_history table
    const [orders] = await db.query('SELECT * FROM order_history ORDER BY created_at DESC');

    // Render the order history page and pass the orders
    res.render('admin/order_history', { orders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).send('Error fetching order history');
  }
};

// Delete Order History
exports.deleteHistory = async (req, res) => {
  const orderId = req.params.order_id; // Get the order_id from the URL

  try {
    // Query to delete the order from the order_history table
    await db.query('DELETE FROM order_history WHERE order_id = ?', [orderId]);

    // Optionally, you can also delete the order from the orders table if needed
    // await db.query('DELETE FROM orders WHERE order_id = ?', [orderId]);

    // Redirect to the order history page after deletion
    res.redirect('/admin/order-history');
  } catch (error) {
    console.error('Error deleting order from history:', error);
    res.status(500).send('Error deleting order history');
  }
};



  
  
