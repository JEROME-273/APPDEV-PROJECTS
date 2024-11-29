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
  res.render("aboutus", { user });
};

// Get contact page
exports.loadContactPage = (req, res) => {
  const user = req.session.user || null;
  res.render("contact", { user });
};

// Get Login
exports.getLoginPage = (req, res) => {
  const errorMsg = req.session.errorMsg || null; // Get error message from session
  const successMsg = req.session.successMsg || null; // Get success message from session
  req.session.errorMsg = null; // Clear error message after displaying
  req.session.successMsg = null; // Clear success message after displaying

  // Pass both successMsg and errorMsg to the view
  res.render("login", { errorMsg, successMsg });
};

// Get signup
exports.getSignupPage = (req, res) => {
  // Pass success and error messages from the session to the view, then clear them from session
  const successMsg = req.session.successMsg;
  const errorMsg = req.session.errorMsg;

  // Clear messages from the session
  req.session.successMsg = null;
  req.session.errorMsg = null;

  res.render("signup", { successMsg, errorMsg });
};

// Post sign up
exports.postSignup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    req.session.errorMsg = "All fields are required.";
    return res.redirect("/signup");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const result = await userModel.createUser(
      fullname,
      email,
      hashedPassword,
      verificationToken
    );

    if (result && result.affectedRows > 0) {
      const verificationUrl = `http://localhost:1010/verify-email?token=${verificationToken}`;
      const mailOptions = {
        from: "no-reply@yourapp.com",
        to: email,
        subject: "Email Verification",
        html: `<p>Click the link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
      };

      await transporter.sendMail(mailOptions);
      req.session.successMsg =
        "Please check your email to verify your account.";
      res.redirect("/login");
    } else {
      req.session.errorMsg = "Error during signup. Please try again.";
      res.redirect("/signup");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    req.session.errorMsg = "Error during signup. Please try again.";
    res.redirect("/signup");
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const [user] = await pool.execute(
      "SELECT * FROM users WHERE verification_token = ?",
      [token]
    );

    if (!user || user.length === 0) {
      req.session.errorMsg = "Invalid verification token.";
      return res.redirect("/login");
    }

    await pool.execute(
      "UPDATE users SET email_verified_at = NOW(), verification_token = NULL WHERE verification_token = ?",
      [token]
    );
    req.session.successMsg = "Email verified successfully. You can now log in.";
    res.redirect("/login");
  } catch (error) {
    console.error("Error during email verification:", error);
    req.session.errorMsg = "Error during email verification. Please try again.";
    res.redirect("/login");
  }
};

// Post Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin" && !email.includes("@")) {
    req.session.errorMsg = "Invalid email format. Please try again.";
    return res.redirect("/login");
  }

  try {
    if (email === "admin" && password === "admin") {
      const adminUser = {
        id: 1,
        fullname: "Admin",
        email: "admin",
        role: "admin",
      };
      req.session.user = adminUser;
      return res.redirect("/admin/dashboard");
    }

    const user = await userModel.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user; // Store the entire user object
      res.redirect(user.role === "admin" ? "/admin/dashboard" : "/welcome");
    } else {
      req.session.errorMsg = "Invalid credentials. Please try again.";
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.session.errorMsg =
      "An error occurred during login. Please try again later.";
    res.redirect("/login");
  }
};

// Get welcome page
exports.getWelcomePage = (req, res) => {
  if (req.session.user) {
    res.render("welcome", { user: req.session.user });
  } else {
    req.session.errorMsg = "Please log in first.";
    res.redirect("/login");
  }
};

// Get admin dashboard
exports.getAdminDashboard = (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    res.render("admin/dashboard");
  } else {
    req.session.errorMsg = "Access denied. Please log in as an admin.";
    res.redirect("/login");
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    if (req.session.user) {
      const user = req.session.user;
      const successMsg = req.session.successMsg;
      const errorMsg = req.session.errorMsg;
      req.session.successMsg = null;
      req.session.errorMsg = null;

      // Fetch orders for the user
      const orders = (await orderModel.getUserOrders(user.id)) || []; // Ensure it's an array even if empty

      res.render("userProfile", { user, successMsg, errorMsg, orders });
    } else {
      req.session.errorMsg = "Please log in first.";
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    req.session.errorMsg = "Error loading profile.";
    res.redirect("/login");
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
      res.redirect("/profile");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      req.session.errorMsg = "Failed to update profile picture.";
      res.redirect("/profile");
    }
  } else {
    req.session.errorMsg = "No file uploaded.";
    res.redirect("/profile");
  }
};

exports.handleProfilePicUpload = upload.single("profilePic");

exports.getOrderHistory = async (req, res) => {
  if (!req.session.user) {
    req.session.errorMsg = "Please log in first.";
    return res.redirect("/login");
  }

  const userId = req.session.user.id;

  try {
    const orders = await orderModel.getUserOrders(userId); // Fetch orders using the model function
    res.render("orderHistory", { user: req.session.user, orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    req.session.errorMsg = "Failed to load order history. Please try again.";
    res.redirect("/profile");
  }
};

exports.getResetPasswordPage = (req, res) => {
  const errorMsg = req.session.errorMsg || null;
  const successMsg = req.session.successMsg || null;
  req.session.errorMsg = null;
  req.session.successMsg = null;
  res.render("resetPassword", { errorMsg, successMsg });
};

exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    req.session.errorMsg = "Email is required.";
    return res.redirect("/reset-password");
  }

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      req.session.errorMsg = "No account found with that email.";
      return res.redirect("/reset-password");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetUrl = `http://localhost:1010/reset-password/${resetToken}`;
    const mailOptions = {
      from: "no-reply@yourapp.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetUrl}">${resetUrl}</a>`,
    };

    await userModel.storeResetToken(user.id, resetToken);
    await transporter.sendMail(mailOptions);

    req.session.successMsg =
      "Password reset email sent. Please check your inbox.";
    res.redirect("/reset-password");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    req.session.errorMsg = "An error occurred. Please try again.";
    res.redirect("/reset-password");
  }
};

exports.getNewPasswordPage = async (req, res) => {
  const { token } = req.params;
  let errorMsg = null;

  try {
    const user = await userModel.findUserByResetToken(token);

    if (!user) {
      errorMsg = "Invalid or expired token.";
      return res.render("resetPassword", { errorMsg, successMsg: null }); // Redirect user to reset-password page
    }

    res.render("newPassword", {
      userId: user.id,
      token,
      errorMsg,
      successMsg: null,
    });
  } catch (error) {
    console.error("Error validating reset token:", error);
    errorMsg = "An error occurred. Please try again.";
    res.render("resetPassword", { errorMsg, successMsg: null });
  }
};

exports.updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.session.errorMsg = "Passwords do not match.";
    return res.redirect(`/reset-password/${token}`);
  }

  try {
    const user = await userModel.findUserByResetToken(token);

    if (!user) {
      req.session.errorMsg = "Invalid or expired token.";
      return res.redirect("/reset-password");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updateUserPassword(user.id, hashedPassword);
    await userModel.clearResetToken(user.id);

    req.session.successMsg = "Password updated successfully. Please log in.";
    res.redirect("/login");
  } catch (error) {
    console.error("Error updating password:", error);
    req.session.errorMsg = "An error occurred. Please try again.";
    res.redirect(`/reset-password/${token}`);
  }
};
