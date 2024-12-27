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
router.post('/send-message', userController.createMessage);
router.get('/login', userController.getLoginPage); 
router.post('/login', userController.postLogin);    
router.get('/signup', userController.getSignupPage); 
router.post('/signup', userController.postSignup);   
router.get('/welcome', userController.getWelcomePage);
router.get('/logout', userController.logout);       


//shop routes
router.get('/shop', shopController.getShopPage); 
router.get('/my-shop', shopController.getMyShopPage);
router.get('/orders', shopController.getOrders);
router.get('/order-history', shopController.getOrderHistory);
router.get('/canceled-orders', shopController.getCanceledOrders);
router.post('/accept-order/:order_id', shopController.acceptOrder);
router.get('/create-shop', shopController.getCreateShopPage);
router.post('/create-shop', shopController.createShop);
router.get('/add-product', shopController.getAddProductPage);
router.post('/add-product', upload.single('p_image'), shopController.addProduct);
router.get('/edit-product/:productId', shopController.getEditProductPage);
router.post('/edit-product/:productId', upload.single('p_image'), shopController.updateProduct);
router.get('/delete-product/:productId', shopController.deleteProduct);


//Profile routes
router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.handleProfilePicUpload, userController.uploadProfilePic);


// Cart routes
router.get('/cart', cartController.getCartPage);
router.post('/cart/add', cartController.addToCart); 
router.delete('/remove-from-cart', cartController.removeFromCart); 
router.put('/update-cart', cartController.updateCart); 
router.post('/order/cancel/:order_id', shopController.cancelOrder);


// Checkout routes
router.get('/checkout', cartController.getCheckoutPage);  
router.post('/checkout/confirm', cartController.confirmPayment); 
router.get('/thankyou', cartController.getThankYouPage);


//admin message routes
router.get('/admin/dashboard', adminController.getAdminDashboard);
router.get('/admin/messages', adminController.getMessages);
router.get('/admin/accounts', adminController.getAccounts);


module.exports = router;
