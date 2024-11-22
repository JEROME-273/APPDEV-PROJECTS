const productModel = require('../model/productModel');
const orderModel = require('../model/orderModel');

// get shop page
exports.getShopPage = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        console.log('Fetched products:', products);

        const user = req.session.user || null;

        let orders = [];
        let canceledOrders = []; 

        if (user && user.id) {
            orders = await orderModel.getUserOrders(user.id);
            console.log('Fetched orders:', orders);
            canceledOrders = orders.filter(order => order.status === 'cancelled');
        }

        const cancelledOrderMessage = req.session.cancelledOrderMessage || null;
        req.session.cancelledOrderMessage = null; 
        const activeOrders = orders.filter(order => order.status !== 'cancelled');

        res.render('shop', { 
            products, 
            user, 
            orders: activeOrders, 
            canceledOrders, 
            cancelledOrderMessage 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.getProductById(productId);

        if (!product) {
            return res.status(404).render('404', { message: 'Product not found' });
        }
        if (isNaN(product.price)) {
            product.price = 'N/A';  
        }
        const user = req.session.user || null;
        res.render('description/details', { product, user });
    } catch (error) {
        console.error('Error fetching product details:', error);
        return res.status(500).render('500', { message: 'An error occurred while fetching the product details.' });
    }
};

//cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const user = req.session.user || null;
        if (!user) {
            return res.status(401).json({ message: 'You must be logged in to cancel an order.' });
        }

        const orderId = req.params.order_id;

        console.log('Order ID from URL:', orderId); 
        const order = await orderModel.getOrderById(orderId);

        console.log('Fetched order:', order);  

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (order.user_id !== user.id) {
            return res.status(403).json({ message: 'You do not have permission to cancel this order.' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending orders can be canceled. Current status: ' + order.status });
        }
        const canceledOrder = await orderModel.cancelOrder(orderId);

        console.log('Canceled Order:', canceledOrder);
        const items = await orderModel.getOrderItems(orderId); 
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


