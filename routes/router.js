const express = require('express');
const multer = require('multer');
const userController = require('../controller/mainController'); 
const adminController = require('../controller/adminController'); 
const shopController = require('../controller/shopController'); 
const cartController = require('../controller/cartController'); 
const router = express.Router();
const upload = require('../config/multerConfig');

// User routes
router.get('/aboutus', userController.getAboutUsPage);
router.get('/contact', userController.loadContactPage);
router.get('/login', userController.getLoginPage); 
router.post('/login', userController.postLogin);    
router.get('/signup', userController.getSignupPage); 
router.post('/signup', userController.postSignup);   
router.get('/welcome', userController.getWelcomePage);
router.get('/logout', userController.logout);       
router.get('/admin/dashboard', userController.getAdminDashboard);
router.get('/shop', shopController.getShopPage); 
router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.handleProfilePicUpload, userController.uploadProfilePic);
router.get('/product/:id', shopController.getProductDetails); 

// Edit Product routes
router.get('/admin/edit-product/:id', adminController.getEditProductPage);  
router.post('/admin/edit-product/:id', upload.single('product_image'), adminController.postEditProduct);


// Cart routes
router.get('/cart', cartController.getCartPage); 
router.post('/cart/add', cartController.addToCart); 
router.delete('/remove-from-cart', cartController.removeFromCart); 
router.put('/update-cart', cartController.updateCart);


// Checkout routes
router.get('/checkout', cartController.getCheckoutPage);  
router.post('/checkout/confirm', cartController.confirmPayment); 
router.get('/thankyou', cartController.getThankYouPage);

// Admin product routes
router.get('/admin/products', adminController.getProducts);           
router.get('/admin/add-product', adminController.getAddProductPage);  
router.post('/admin/delete-product/:id', adminController.deleteProduct);
router.post('/admin/add-product', upload.single('product_image'), adminController.postAddProduct);  
router.get('/admin/confirm-order/:order_id', adminController.confirmOrder);
router.post('/order/cancel/:order_id', shopController.cancelOrder);
router.get('/admin/cancelled-orders', adminController.getCancelledOrders); 
router.post('/admin/delete-cancelled-order/:order_id', adminController.deleteCancelledOrder);
router.post('/admin/clear-cancelled-orders', adminController.clearAllCancelledOrders);

// Admin Orders routes
router.get('/admin/orders', adminController.getOrders); 

// Admin Order History routes
router.get('/admin/order-history', adminController.getOrderHistory); 
router.get('/admin/delete-history/:order_id', adminController.deleteHistory);

//message routes
router.post('/send-message', userController.postContactMessage);
router.post('/contact/delete/:id', userController.deleteMessage);

// Admin route to load all messages sent by users
router.get('/admin/messages', adminController.loadMessages);
// Admin reply to a user's message
router.post('/admin/reply-message', adminController.replyMessage);

module.exports = router;
