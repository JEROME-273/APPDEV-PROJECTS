const bcrypt = require('bcryptjs');
const userModel = require('../model/mainModel');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multerConfig');
const pool = require('../config/db');


// Get about us page
exports.getAboutUsPage = (req, res) => {
    const user = req.session.user || null; 
    res.render('aboutus', { user });
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


exports.loadContactPage = async (req, res) => {
    const user = req.session.user || null;
    const successMsg = req.session.successMsg || null;
    const errorMsg = req.session.errorMsg || null;
    req.session.successMsg = null;  // Clear successMsg after rendering
    req.session.errorMsg = null;    // Clear errorMsg after rendering

    let contactMessages = [];
    let phone = '';  // Default value for phone
    let message = ''; // Default value for message (empty)

    if (user) {
        try {
            // Fetch all contact messages sent by the logged-in user
            const query = 'SELECT id, phone_number, message, created_at FROM contacts WHERE user_id = ? ORDER BY created_at DESC';
            const [result] = await pool.query(query, [user.id]);
            contactMessages = result; // Store the array of messages

            // Get the phone number from the user's last message (if available)
            if (result.length > 0) {
                phone = result[0].phone_number;  // Assuming the latest message's phone number is to be used
                message = result[0].message; // Get the latest message text
            }
        } catch (error) {
            console.error('Error fetching contact messages:', error);
        }
    }

    res.render('contact', {
        user,
        successMsg,
        errorMsg,
        contactMessages,  // Pass the array of all messages
        phone,            // Pass the phone number to the EJS template
        message           // Pass the message to the EJS template
    });
};


exports.postContactMessage = async (req, res) => {
    const { phone, message } = req.body;
    const userId = req.session.user ? req.session.user.id : null;

    // Validate phone and message fields
    if (!phone || !message) {
        req.session.errorMsg = 'Please fill in all fields.';
        return res.redirect('/contact');
    }

    try {
        // Insert the contact message into the database
        await userModel.createContactMessage(userId, phone, message);

        // Set success message in session
        req.session.successMsg = 'Your message has been sent successfully.';
        
        // Fetch all contact messages for the user, including the newly sent one
        const query = 'SELECT id, phone_number, message, created_at FROM contacts WHERE user_id = ? ORDER BY created_at DESC';
        const [result] = await pool.query(query, [userId]);

        // Render the contact page with success and all sent messages
        res.render('contact', {
            user: req.session.user,
            successMsg: req.session.successMsg,
            contactMessages: result,  // Pass the list of all messages, including the new one
            errorMsg: req.session.errorMsg, // Pass any error message
            phone: phone,  // Pass the phone number to the template
            message: message // Pass the message to the template
        });
    } catch (error) {
        console.error('Error during sending message:', error);
        req.session.errorMsg = 'An error occurred while sending your message. Please try again.';
        res.redirect('/contact');
    }
};


// Function to delete the contact message
exports.deleteMessage = async (req, res) => {
    const messageId = req.params.id;  // Get the message ID from the URL params
    const userId = req.session.user ? req.session.user.id : null;

    console.log('Attempting to delete message with ID:', messageId);  // Log the ID to check

    // Ensure the user is logged in
    if (!userId) {
        req.session.errorMsg = 'You must be logged in to delete a message.';
        return res.redirect('/contact');
    }

    try {
        // Check if the message belongs to the logged-in user
        const query = 'SELECT * FROM contacts WHERE id = ? AND user_id = ?';
        const [result] = await pool.query(query, [messageId, userId]);

        if (result.length === 0) {
            req.session.errorMsg = 'Message not found or you do not have permission to delete it.';
            return res.redirect('/contact');
        }

        // Proceed to delete the message
        const deleteQuery = 'DELETE FROM contacts WHERE id = ?';
        await pool.query(deleteQuery, [messageId]);

        req.session.successMsg = 'Your message has been deleted successfully.';
        res.redirect('/contact');
    } catch (error) {
        console.error('Error during message deletion:', error);
        req.session.errorMsg = 'An error occurred while deleting the message. Please try again.';
        res.redirect('/contact');
    }
};











