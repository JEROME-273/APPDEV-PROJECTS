const express = require('express');
const userController = require('../controller/mainController'); 
const router = express.Router();

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
router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.handleProfilePicUpload, userController.uploadProfilePic);

module.exports = router;
