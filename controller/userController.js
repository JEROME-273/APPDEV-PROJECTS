const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');

exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.getSignupPage = (req, res) => {
    res.render('signup');
};

exports.postSignup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(fullname, email, hashedPassword);
        res.redirect('/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.send('Error in signup: ' + error.message);
    }
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/welcome');  
        } else {
            res.send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.send('Error in login');
    }
};

exports.getWelcomePage = (req, res) => {
    if (req.session.user) {
        res.render('welcome', { user: req.session.user }); 
    } else {
        req.session.errorMsg = 'Please log in first.'; 
        res.redirect('/login'); 
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
