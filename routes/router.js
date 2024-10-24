const express = require('express');
const userController = require('../controller/userController'); 
const router = express.Router();

router.get('/login', userController.getLoginPage); 
router.post('/login', userController.postLogin);    
router.get('/signup', userController.getSignupPage); 
router.post('/signup', userController.postSignup);   
router.get('/welcome', userController.getWelcomePage);
router.get('/logout', userController.logout);       

module.exports = router;
