const pool = require('../db');

exports.createUser = async (fullname, email, password) => {
    try {
        const sql = `INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)`;
        await pool.query(sql, [fullname, email, password]);
    } catch (error) {
        throw error;
    }
};

exports.findUserByEmail = async (email) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
