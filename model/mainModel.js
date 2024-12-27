const pool = require('../config/db');

//Create User
exports.createUser = async (fullname, email, password, role) => {
    try {
        const sql = `INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)`;
        await pool.query(sql, [fullname, email, password, role]);
    } catch (error) {
        throw error;
    }
};

//Find User by Email
exports.findUserByEmail = async (email) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Add this function
exports.getUserById = async (userId) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
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

exports.createContactMessage = async (userId, phone, message) => {
    const query = 'INSERT INTO user_message (user_id, phoneNumber, userMessage, created_at) VALUES (?, ?, ?, ?)';
    const values = [userId, phone, message, new Date()];

    try {
        await pool.query(query, values);  
    } catch (error) {
        console.error('Error inserting contact message:', error);
        throw error;
    }
};

