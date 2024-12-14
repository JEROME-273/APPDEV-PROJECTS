const productModel = require("../model/productModel");
const orderModel = require("../model/orderModel");

// get shop page
exports.getShopPage = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await productModel.getAllProducts();
    console.log("Fetched products:", products);

    const user = req.session.user || null;

    let orders = [];
    let canceledOrders = [];

    // If user is logged in, fetch their orders
    if (user && user.id) {
      orders = await orderModel.getUserOrders(user.id);
      console.log("Fetched orders:", orders);
      canceledOrders = orders.filter((order) => order.status === "cancelled");
    }

    const cancelledOrderMessage = req.session.cancelledOrderMessage || null;
    req.session.cancelledOrderMessage = null;
    const activeOrders = orders.filter((order) => order.status !== "cancelled");

    // Construct product objects with full image URLs
    const productsWithImageUrl = products.map((product) => {
      return {
        ...product,
        product_image: `${req.protocol}://${req.get("host")}/uploads/${
          product.image_name
        }`, // Ensure this points to the correct field
      };
    });

    // Send response with products and user data
    res.json({
      success: true,
      products: productsWithImageUrl, // Send the products with image_url field
      user,
      orders: activeOrders,
      canceledOrders,
      cancelledOrderMessage,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get product details
exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (isNaN(product.price)) {
      product.price = "N/A";
    }
    const user = req.session.user || null;
    res.json({
      success: true,
      product,
      user,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product details.",
      error: error.message,
    });
  }
};

// cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const user = req.session.user || null;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to cancel an order.",
      });
    }

    const orderId = req.params.order_id;

    console.log("Order ID from URL:", orderId);
    const order = await orderModel.getOrderById(orderId);

    console.log("Fetched order:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to cancel this order.",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending orders can be canceled. Current status: " +
          order.status,
      });
    }

    const canceledOrder = await orderModel.cancelOrder(orderId);

    console.log("Canceled Order:", canceledOrder);
    const items = await orderModel.getOrderItems(orderId);
    req.session.cancelledOrderMessage =
      "Your order has been successfully canceled.";

    res.json({
      success: true,
      message: "Order successfully canceled",
      orderId: canceledOrder.order_id,
      totalAmount: canceledOrder.total_amount,
      items,
    });
  } catch (error) {
    console.error("Error canceling the order:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while trying to cancel the order.",
      error: error.message,
    });
  }
};
