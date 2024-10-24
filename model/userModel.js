const pool = require('../db');

exports.createUser = async (fullname, email, password, role) => {
    try {
        const sql = `INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)`;
        await pool.query(sql, [fullname, email, password, role]);
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
