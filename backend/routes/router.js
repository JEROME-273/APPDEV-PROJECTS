const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../Controller/mainController'); 
const adminController = require('../Controller/adminController'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); 
    }
  });
  const upload = multer({ storage: storage });

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

// Admin product routes
router.get('/admin/products', adminController.getProducts);           
router.get('/admin/add-product', adminController.getAddProductPage);  
router.post('/admin/add-product', upload.single('product_image'), adminController.postAddProduct); 

module.exports = router;