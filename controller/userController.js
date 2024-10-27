const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Specify your upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Append file extension
    }
});

const upload = multer({ storage });

exports.getAboutUsPage = (req, res) => {
    res.render('aboutus'); // Render the aboutus.ejs file
};

// Get login page
exports.getLoginPage = (req, res) => {
    const errorMsg = req.session.errorMsg;
    req.session.errorMsg = null; 
    res.render('login', { errorMsg });
};

// Get signup page
exports.getSignupPage = (req, res) => {
    res.render('signup');
};

// Handle signup
exports.postSignup = async (req, res) => {
    const { fullname, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(fullname, email, hashedPassword, role);
        res.redirect('/login');
    } catch (error) {
        console.error('Error during signup:', error);
        req.session.errorMsg = 'Error during signup. Please try again.';
        res.redirect('/signup');
    }
};

// Handle login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            if (user.role === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/welcome');
            }
        } else {
            req.session.errorMsg = 'Invalid credentials. Please try again.';
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.session.errorMsg = 'An error occurred during login. Please try again later.';
        res.redirect('/login');
    }
};

// Get welcome page
exports.getWelcomePage = (req, res) => {
    if (req.session.user) {
        res.render('welcome', { user: req.session.user });
    } else {
        req.session.errorMsg = 'Please log in first.';
        res.redirect('/login');
    }
};

// Get admin dashboard
exports.getAdminDashboard = (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.render('admin/dashboard');
    } else {
        req.session.errorMsg = 'Access denied. Please log in as an admin.';
        res.redirect('/login');
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// Get user profile
exports.getUserProfile = (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        const successMsg = req.session.successMsg; // Get success message if any
        const errorMsg = req.session.errorMsg; // Get error message if any
        req.session.successMsg = null; // Clear message after use
        req.session.errorMsg = null; // Clear message after use
        res.render('userProfile', { user, successMsg, errorMsg }); 
    } else {
        req.session.errorMsg = 'Please log in first.';
        res.redirect('/login');
    }
};

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
    console.log('Uploaded file:', req.file); // Log the uploaded file for debugging
    const userId = req.session.user.id; // Assuming you have user ID in the session
    const profilePic = req.file ? req.file.filename : null;

    if (profilePic) {
        try {
            await userModel.updateProfilePic(userId, profilePic);
            req.session.user.profile_pic = profilePic; // Update session
            req.session.successMsg = 'Profile picture updated successfully.'; // Set success message
            res.redirect('/profile'); // Redirect to profile
        } catch (error) {
            console.error('Error updating profile picture:', error);
            req.session.errorMsg = 'Failed to update profile picture.'; // Set error message
            res.redirect('/profile');
        }
    } else {
        req.session.errorMsg = 'No file uploaded.'; // Set error message
        res.redirect('/profile');
    }
};

// Middleware for handling file uploads
exports.handleProfilePicUpload = upload.single('profilePic');
