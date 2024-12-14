const pool = require("../config/db");

// Function to create a new user
exports.createUser = async (
  fullname,
  email,
  hashedPassword,
  verificationToken
) => {
  try {
    // If verificationToken is undefined, set it to null
    verificationToken = verificationToken || null;

    const query =
      "INSERT INTO users (fullname, email, password, verification_token) VALUES (?, ?, ?, ?)";
    const [results] = await pool.execute(query, [
      fullname,
      email,
      hashedPassword,
      verificationToken,
    ]);

    console.log("User created successfully:", results);
    return results;
  } catch (err) {
    console.error("Error during user creation:", err);
    throw err; // Re-throw the error so it can be handled by the controller
  }
};

exports.checkUserExists = async (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await pool.execute(query, [email]);
    return results.length > 0; // Returns true if user exists
  } catch (err) {
    console.error("Error checking user existence:", err);
    throw err; // Re-throw the error for handling by the controller
  }
  
};
// Find a user by verification token
exports.findUserByToken = async (token) => {
  const query = "SELECT * FROM users WHERE verification_token = ?";
  const [rows] = await pool.query(query, [token]);
  return rows[0]; // Return the first matching user
};

// Mark the user's email as verified
exports.verifyUserEmail = async (userId) => {
  const query = "UPDATE users SET email_verified_at = NOW() WHERE id = ?";
  await pool.query(query, [userId]);
};

exports.findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Add this function
exports.getUserById = async (userId) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [
      userId,
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Update profile picture
exports.updateProfilePic = async (userId, profilePic) => {
  try {
    const sql = `UPDATE users SET profile_pic = ? WHERE id = ?`;
    await pool.query(sql, [profilePic, userId]);
  } catch (error) {
    throw error;
  }
};

exports.storeResetToken = async (userId, token) => {
  const query =
    "UPDATE users SET reset_token = ?, reset_token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?";
  await pool.query(query, [token, userId]);
};

exports.findUserByResetToken = async (token) => {
  const query =
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()";
  const [rows] = await pool.query(query, [token]);
  return rows[0];
};

exports.updateUserPassword = async (userId, hashedPassword) => {
  const query =
    "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?";
  await pool.query(query, [hashedPassword, userId]);
};

exports.clearResetToken = async (userId) => {
  const query =
    "UPDATE users SET reset_token = NULL, reset_token_expiration = NULL WHERE id = ?";
  await pool.query(query, [userId]);
};
