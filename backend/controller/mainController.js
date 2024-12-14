const bcrypt = require("bcryptjs");
const userModel = require("../model/mainModel");
const orderModel = require("../model/orderModel");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const upload = require("../config/multerConfig");
const nodemailer = require("nodemailer");
const pool = require("../config/db");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "firedown1231@gmail.com",
    pass: "qcyn fkrg rzdi rsac",
  },
});

// Get about us page
exports.getAboutUsPage = (req, res) => {
  const user = req.session.user || null;
  res.json({ user });
};

// Get contact page
exports.loadContactPage = (req, res) => {
  const user = req.session.user || null;
  res.json({ user });
};

// Get Login
exports.getLoginPage = (req, res) => {
  const errorMsg = req.session.errorMsg || null; // Get error message from session
  const successMsg = req.session.successMsg || null; // Get success message from session
  req.session.errorMsg = null; // Clear error message after displaying
  req.session.successMsg = null; // Clear success message after displaying

  // Send errorMsg and successMsg as a JSON response
  res.json({ errorMsg, successMsg });
};

// Get signup
exports.getSignupPage = (req, res) => {
  // Get success and error messages from the session
  const successMsg = req.session.successMsg || null;
  const errorMsg = req.session.errorMsg || null;

  // Clear messages from the session
  req.session.successMsg = null;
  req.session.errorMsg = null;

  // Send successMsg and errorMsg as a JSON response
  res.json({ successMsg, errorMsg });
};

// Post sign up
exports.postSignup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ errorMsg: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.checkUserExists(email);
    if (existingUser) {
      return res.status(400).json({ errorMsg: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await userModel.createUser(
      fullname,
      email,
      hashedPassword,
      verificationToken
    );

    if (result && result.affectedRows > 0) {
      // Send email verification in the background
      const verificationUrl = `http://localhost:8080/verify-email?token=${verificationToken}`;
      const mailOptions = {
        from: "no-reply@yourapp.com",
        to: email,
        subject: "Email Verification",
        html: `<p>Click the link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Email sending failed:", error);
        }
      });

      // Respond with success message
      return res.status(200).json({
        success: true,
        successMsg: "Account created. Check your email for verification.",
      });
    } else {
      return res.status(500).json({
        success: false,
        errorMsg: "Error during signup. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ errorMsg: "Internal server error. Please try again later." });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    console.log("Verification token received:", token);

    const [user] = await pool.execute(
      "SELECT * FROM users WHERE verification_token = ?",
      [token]
    );

    if (!user || user.length === 0) {
      return res.status(400).json({ errorMsg: "Invalid verification token." });
    }

    console.log("User to be verified:", user);

    await pool.execute(
      "UPDATE users SET email_verified_at = NOW(), verification_token = NULL WHERE verification_token = ?",
      [token]
    );

    res
      .status(200)
      .json({ successMsg: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error during email verification:", error);
    res
      .status(500)
      .json({ errorMsg: "Error during email verification. Please try again." });
  }
};

// Post Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ errorMsg: "Invalid credentials. Please try again." });
    }
    // Check email verification status
    if (!user.email_verified_at) {
      return res
        .status(403)
        .json({ errorMsg: "Please verify your email before logging in." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ errorMsg: "Invalid credentials. Please try again." });
    }

    // Set session data
    req.session.user = user;

    // Log session data
    console.log("Session user set:", req.session.user);

    res.status(200).json({
      success: true,
      role: user.role,
      verified: !!user.email_verified_at,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      errorMsg: "An error occurred during login. Please try again later.",
    });
  }
};

// Get welcome page
exports.getWelcomePage = (req, res) => {
  if (req.session.user) {
    // Send user information in a JSON response
    res.json({ user: req.session.user });
  } else {
    req.session.errorMsg = "Please log in first.";
    res.status(401).json({ errorMsg: "Please log in first." });
  }
};

// Get admin dashboard
exports.getAdminDashboard = (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    // Send a success response with user data
    res.json({ success: true, user: req.session.user });
  } else {
    req.session.errorMsg = "Access denied. Please log in as an admin.";
    res
      .status(403)
      .json({ errorMsg: "Access denied. Please log in as an admin." });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ errorMsg: "Logout failed. Please try again." });
    }
    res.status(200).json({ successMsg: "Successfully logged out." });
  });
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    if (req.session.user) {
      const user = req.session.user;
      const successMsg = req.session.successMsg || null;
      const errorMsg = req.session.errorMsg || null;
      req.session.successMsg = null;
      req.session.errorMsg = null;

      // Fetch orders for the user
      const orders = (await orderModel.getUserOrders(user.id)) || []; // Ensure it's an array even if empty

      // Send user profile details and orders as JSON
      res.json({ user, successMsg, errorMsg, orders });
    } else {
      req.session.errorMsg = "Please log in first.";
      res.status(401).json({ errorMsg: "Please log in first." });
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    req.session.errorMsg = "Error loading profile.";
    res
      .status(500)
      .json({ errorMsg: "Error loading profile. Please try again." });
  }
};

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  console.log("Uploaded file:", req.file);
  const userId = req.session.user.id;
  const profilePic = req.file ? req.file.filename : null;

  if (profilePic) {
    try {
      await userModel.updateProfilePic(userId, profilePic);
      req.session.user.profile_pic = profilePic;
      req.session.successMsg = "Profile picture updated successfully.";

      // Send success response with updated user info
      res.json({
        success: true,
        message: "Profile picture updated successfully.",
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);

      // Send error response
      res.status(500).json({
        success: false,
        errorMsg: "Failed to update profile picture.",
      });
    }
  } else {
    // Send error response if no file is uploaded
    res.status(400).json({ success: false, errorMsg: "No file uploaded." });
  }
};

exports.handleProfilePicUpload = upload.single("profilePic");

exports.getOrderHistory = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ errorMsg: "Please log in first." });
  }

  const userId = req.session.user.id;

  try {
    const orders = await orderModel.getUserOrders(userId); // Fetch orders using the model function
    // Send order history and user details in a JSON response
    res.json({ user: req.session.user, orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({
      errorMsg: "Failed to load order history. Please try again.",
    });
  }
};

exports.getResetPasswordPage = (req, res) => {
  const errorMsg = req.session.errorMsg || null;
  const successMsg = req.session.successMsg || null;
  req.session.errorMsg = null;
  req.session.successMsg = null;

  // Send JSON response with error and success messages
  res.json({ errorMsg, successMsg });
};

exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ errorMsg: "Email is required." });
  }

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ errorMsg: "No account found with that email." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    // Use frontend port in reset URL
    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;

    const mailOptions = {
      from: "no-reply@yourapp.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>If you did not request this, please ignore this email.</p>`,
    };

    // Add error handling for email sending
    try {
      const info = await transporter.sendMail(mailOptions);
    } catch (emailError) {
      return res.status(500).json({
        errorMsg: "Failed to send reset email. " + emailError.message,
      });
    }

    // Store reset token in database
    await userModel.storeResetToken(user.id, resetToken);

    return res.status(200).json({
      successMsg: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMsg: "An error occurred. Please try again." });
  }
};

exports.getNewPasswordPage = async (req, res) => {
  const { token } = req.params;
  let errorMsg = null;

  try {
    const user = await userModel.findUserByResetToken(token);

    if (!user) {
      errorMsg = "Invalid or expired token.";
      return res.status(400).json({ errorMsg }); // Return error message in JSON response
    }

    return res.status(200).json({
      userId: user.id,
      token,
      errorMsg,
      successMsg: null,
    });
  } catch (error) {
    console.error("Error validating reset token:", error);
    errorMsg = "An error occurred. Please try again.";
    return res.status(500).json({ errorMsg }); // Return error message in JSON response
  }
};

exports.updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ errorMsg: "Passwords do not match." });
  }

  try {
    const user = await userModel.findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ errorMsg: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updateUserPassword(user.id, hashedPassword);
    await userModel.clearResetToken(user.id);

    return res
      .status(200)
      .json({ successMsg: "Password updated successfully. Please log in." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ errorMsg: "An error occurred. Please try again." });
  }
};
