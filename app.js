// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override'); // Add this

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cricket-admin:cricket2025@cluster0.avlirvg.mongodb.net/india-cricket-stats?retryWrites=true&w=majority';

// Connect to MongoDB database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas - Cricket Database'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware configuration
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // Add this for PUT/DELETE

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cricket-stats-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import and configure passport
require('./config/passport');

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Route handlers
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Player routes (protected)
const { requireAuth } = require('./config/auth');
app.use('/players', requireAuth, require('./routes/players'));

// 404 Error handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found - Cricket Stats',
    message: 'The cricket page you are looking for does not exist.'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).render('error', {
    title: 'Server Error - Cricket Stats',
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🏏 India Cricket Stats server running on http://localhost:${PORT}`);
});

module.exports = app;