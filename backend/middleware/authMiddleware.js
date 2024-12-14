// middleware/authMiddleware.js

function checkNotLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return res.status(403).json({ message: "Already logged in." });
  }
  next();
}

// Redirect logged-in users trying to access the login page
function checkAlreadyLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/welcome"); // Redirect to the welcome page or other pages
  }
  next();
}

module.exports = { checkNotLoggedIn, checkAlreadyLoggedIn };
