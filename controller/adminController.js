const db = require('../config/db'); 
const pool = require('../config/db');

// Get admin dashboard
exports.getAdminDashboard = (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
      res.render('admin/dashboard');
  } else {
      req.session.errorMsg = 'Access denied. Please log in as an admin.';
      res.redirect('/login');
  }
};

//get messages
exports.getMessages = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.fullname, u.profile_pic, um.userMessage, um.created_at
      FROM users u
      LEFT JOIN user_message um ON u.id = um.user_id
      WHERE um.userMessage IS NOT NULL AND um.userMessage != ''
      ORDER BY u.id, um.created_at DESC;
    `);
    console.log("Full query result:", result);
    const rows = result[0]; 
    if (!rows || rows.length === 0) {
      throw new Error('Database query did not return any rows');
    }
    const groupedMessages = rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          fullname: row.fullname,
          profile_pic: row.profile_pic,
          messages: []
        };
      }
      acc[row.id].messages.push({
        message: row.userMessage,
        created_at: row.created_at
      });

      return acc;
    }, {});

    const userMessages = Object.values(groupedMessages);
    console.log("Grouped messages:", userMessages);
    res.render('admin/messages', { userMessages, user: req.session.user });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send('Error fetching messages');
  }
};

//get user accounts
exports.getAccounts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, fullname, email, profile_pic
      FROM users
    `);

    const users = result[0]; 

    if (!users || users.length === 0) {
      return res.render('admin/accounts', { users: [], user: req.session.user, message: "No users found" });
    }

    res.render('admin/accounts', { users, user: req.session.user });
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).send('Error fetching accounts');
  }
};





  
