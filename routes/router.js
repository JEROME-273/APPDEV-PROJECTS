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

// Cart routes
router.get('/cart', cartController.getCartPage); 
router.post('/cart/add', cartController.addToCart); 
router.delete('/remove-from-cart', cartController.removeFromCart); 

// Checkout routes
router.get('/checkout', cartController.getCheckoutPage);  
router.post('/checkout/confirm', cartController.confirmPayment); 
router.get('/thankyou', cartController.getThankYouPage);

// Admin product routes
router.get('/admin/products', adminController.getProducts);           
router.get('/admin/add-product', adminController.getAddProductPage);  
router.post('/admin/add-product', upload.single('product_image'), adminController.postAddProduct);  

module.exports = router;
