const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const path = require("path");
const userRoutes = require("./routes/router");
const db = require("./config/db");
const cors = require("cors");

const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Set up session store
const sessionStore = new MySQLStore({}, db);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Global middleware for CORS
app.use(
  cors({
    origin: "http://localhost:8081", // Vue.js development server
    credentials: true, // Allow cookies/session sharing
  })
);

// Middleware to check login status globally
app.use((req, res, next) => {
  const isLoggedIn = req.session && req.session.user;

  // If trying to access the login endpoint while logged in
  if (req.path === "/login" && isLoggedIn) {
    return res.status(403).json({
      message: "You are already logged in.",
      redirectTo: "/welcome", // Adjust redirection path as needed
    });
  }

  // Allow all other requests to proceed
  next();
});

// Routes
app.use("/api/", userRoutes);

// Default route for undefined paths
app.get("/", (req, res) => {
  res.json({ redirect: "/login" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(2500, () => {
  console.log("Server is running on http://localhost:2500");
});
