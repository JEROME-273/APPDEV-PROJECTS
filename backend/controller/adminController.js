const db = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    products.forEach((product) => {
      product.price = parseFloat(product.price);
    });
    res.json({ products });
    console.log(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

exports.getAddProductPage = (req, res) => {
  const errors = req.query.errors ? req.query.errors.split(",") : [];
  const success = req.query.success || null;
  res.json({ errors, success });
};

exports.postAddProduct = async (req, res) => {
  const { product_name, price, quantity, description } = req.body;
  const product_image = req.file ? req.file.path.replace(/\\/g, "/") : null;

  const errors = [];
  if (!product_name) errors.push("Product name is required.");
  if (!price) errors.push("Price is required.");
  if (!quantity) errors.push("Quantity is required.");
  if (!description) errors.push("Description is required.");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    await db.query(
      "INSERT INTO products (product_name, price, quantity, product_image, description) VALUES (?, ?, ?, ?, ?)",
      [product_name, price, quantity, product_image, description]
    );
    res.json({ success: "Product added successfully." });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

exports.getEditProductPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const errors = req.query.errors ? req.query.errors.split(",") : [];
    const success = req.query.success || null;

    res.json({ product: product[0], errors, success });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).json({ error: "Error fetching product for editing" });
  }
};

exports.postEditProduct = async (req, res) => {
  const productId = req.params.id;
  const { product_name, price, quantity, description } = req.body;
  let product_image = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    const [product] = await db.query(
      "SELECT product_image FROM products WHERE id = ?",
      [productId]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product_image) {
      product_image = product[0].product_image;
    }

    const errors = [];
    if (!product_name) errors.push("Product name is required.");
    if (!price) errors.push("Price is required.");
    if (!quantity) errors.push("Quantity is required.");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await db.query(
      "UPDATE products SET product_name = ?, price = ?, quantity = ?, product_image = ?, description = ? WHERE id = ?",
      [product_name, price, quantity, product_image, description, productId]
    );

    res.json({ success: "Product updated successfully." });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    await db.query("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ success: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

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
      const {
        order_id,
        user_id,
        address,
        contact_number,
        payment_method,
        total_amount,
        status,
        created_at,
        product_name,
        product_image,
        quantity,
      } = order;
      let existingOrder = acc.find((o) => o.order_id === order_id);

      if (!existingOrder) {
        existingOrder = {
          order_id,
          user_id,
          address,
          contact_number,
          payment_method,
          total_amount,
          status,
          created_at,
          items: [],
        };
        acc.push(existingOrder);
      }

      if (product_name) {
        existingOrder.items.push({
          product_name,
          product_image,
          quantity,
        });
      }

      return acc;
    }, []);

    ordersWithItems.forEach((order) => {
      order.total_amount = parseFloat(order.total_amount).toFixed(2);
    });

    const success = req.query.success || null;

    res.json({ orders: ordersWithItems, success });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

exports.confirmOrder = async (req, res) => {
  const orderId = req.params.order_id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [order] = await connection.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [orderId]
    );

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    await connection.query(
      `
      INSERT INTO order_history (order_id, user_id, address, contact_number, payment_method, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        order[0].order_id,
        order[0].user_id,
        order[0].address,
        order[0].contact_number,
        order[0].payment_method,
        order[0].total_amount,
        "confirmed",
        order[0].created_at,
      ]
    );

    await connection.query("UPDATE orders SET status = ? WHERE order_id = ?", [
      "confirmed",
      orderId,
    ]);
    await connection.commit();
    res.json({ success: "Order confirmed and moved to history." });
  } catch (error) {
    await connection.rollback();
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Error confirming order" });
  } finally {
    connection.release();
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM order_history ORDER BY created_at DESC"
    );
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Error fetching order history" });
  }
};

exports.deleteHistory = async (req, res) => {
  const orderId = req.params.order_id;
  try {
    await db.query("DELETE FROM order_history WHERE order_id = ?", [orderId]);
    res.json({ success: "Order history deleted successfully." });
  } catch (error) {
    console.error("Error deleting order from history:", error);
    res.status(500).json({ error: "Error deleting order history" });
  }
};

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
      const {
        order_id,
        user_id,
        address,
        contact_number,
        payment_method,
        total_amount,
        status,
        created_at,
        product_name,
        product_image,
        quantity,
      } = order;
      let existingOrder = acc.find((o) => o.order_id === order_id);

      if (!existingOrder) {
        existingOrder = {
          order_id,
          user_id,
          address,
          contact_number,
          payment_method,
          total_amount,
          status,
          created_at,
          items: [],
        };
        acc.push(existingOrder);
      }

      if (product_name) {
        existingOrder.items.push({
          product_name,
          product_image,
          quantity,
        });
      }

      return acc;
    }, []);

    cancelledOrders.forEach((order) => {
      order.total_amount = parseFloat(order.total_amount).toFixed(2);
    });

    const success = req.query.success || null;

    res.json({ cancelledOrders, success });
  } catch (error) {
    console.error("Error fetching cancelled orders:", error);
    res.status(500).json({ error: "Error fetching cancelled orders" });
  }
};

exports.deleteCancelledOrder = async (req, res) => {
  const orderId = req.params.order_id;
  console.log(`Deleting cancelled order with ID: ${orderId}`);

  try {
    await db.query(
      'DELETE FROM orders WHERE order_id = ? AND status = "cancelled"',
      [orderId]
    );
    res.json({ success: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting cancelled order:", error);
    res.status(500).json({ error: "Error deleting cancelled order" });
  }
};

exports.clearAllCancelledOrders = async (req, res) => {
  try {
    await db.query('DELETE FROM orders WHERE status = "cancelled"');
    res.json({ success: "All cancelled orders have been deleted." });
  } catch (error) {
    console.error("Error clearing cancelled orders:", error);
    res.status(500).json({ error: "Error clearing cancelled orders" });
  }
};

console.log("Admin controller updated to return JSON responses");
