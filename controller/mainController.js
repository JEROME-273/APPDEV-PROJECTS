const bcrypt = require('bcryptjs');
const userModel = require('../model/mainModel');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multerConfig');

// Get about us page
exports.getAboutUsPage = (req, res) => {
    const user = req.session.user || null; 
    res.render('aboutus', { user });
};

// Get contact page
exports.loadContactPage = (req, res) => {
    const user = req.session.user || null; 
    res.render('contact', { user }); 
};

// Get Login 
exports.getLoginPage = (req, res) => {
    const errorMsg = req.session.errorMsg;
    req.session.errorMsg = null; 
    res.render('login', { errorMsg });
};

// Get signup
exports.getSignupPage = (req, res) => {
    res.render('signup');
};

// Post sign up
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

// Post Login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (email !== 'admin' && !email.includes('@')) {
        req.session.errorMsg = 'Invalid email format. Please try again.';
        return res.redirect('/login');
    }

    try {
        if (email === 'admin' && password === 'admin') {
            const adminUser = {
                id: 1, 
                fullname: 'Admin',
                email: 'admin',
                role: 'admin',
            };
            req.session.user = adminUser; 
            return res.redirect('/admin/dashboard');
        }

        const user = await userModel.findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user; // Store the entire user object
            res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/welcome');
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
        const successMsg = req.session.successMsg;
        const errorMsg = req.session.errorMsg; 
        req.session.successMsg = null; 
        req.session.errorMsg = null; 
        res.render('userProfile', { user, successMsg, errorMsg }); 
    } else {
        req.session.errorMsg = 'Please log in first.';
        res.redirect('/login');
    }
};

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
    console.log('Uploaded file:', req.file);
    const userId = req.session.user.id; 
    const profilePic = req.file ? req.file.filename : null;

    if (profilePic) {
        try {
            await userModel.updateProfilePic(userId, profilePic);
            req.session.user.profile_pic = profilePic; 
            req.session.successMsg = 'Profile picture updated successfully.'; 
            res.redirect('/profile'); 
        } catch (error) {
            console.error('Error updating profile picture:', error);
            req.session.errorMsg = 'Failed to update profile picture.'; 
            res.redirect('/profile');
        }
    } else {
        req.session.errorMsg = 'No file uploaded.'; 
        res.redirect('/profile');
    }
};

exports.handleProfilePicUpload = upload.single('profilePic');
