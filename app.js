// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));

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

// ==================== OAUTH DEBUG ROUTES ====================

// Debug route for OAuth configuration
app.get('/debug-oauth', (req, res) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  const debugInfo = {
    environment: {
      nodeEnv: process.env.NODE_ENV,
      baseUrl: process.env.BASE_URL,
      port: process.env.PORT
    },
    google: {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      clientIdLength: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0,
      callbackUrl: `${BASE_URL}/auth/google/callback`,
      clientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'Not set'
    },
    github: {
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      clientIdLength: process.env.GITHUB_CLIENT_ID ? process.env.GITHUB_CLIENT_ID.length : 0,
      callbackUrl: `${BASE_URL}/auth/github/callback`,
      clientIdPrefix: process.env.GITHUB_CLIENT_ID ? process.env.GITHUB_CLIENT_ID.substring(0, 10) + '...' : 'Not set'
    },
    mongodb: {
      hasUri: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
    },
    session: {
      hasSecret: !!process.env.SESSION_SECRET,
      secretLength: process.env.SESSION_SECRET ? process.env.SESSION_SECRET.length : 0
    }
  };
  
  res.json(debugInfo);
});

// Test OAuth callback URLs
app.get('/test-callbacks', (req, res) => {
  res.json({
    google: {
      callbackUrl: 'https://india-cricket-stats.onrender.com/auth/google/callback',
      test: 'Visit /auth/google to test Google OAuth flow'
    },
    github: {
      callbackUrl: 'https://india-cricket-stats.onrender.com/auth/github/callback',
      test: 'Visit /auth/github to test GitHub OAuth flow'
    },
    status: 'Check if these URLs match your OAuth app configurations'
  });
});

// Simple OAuth status page (HTML)
app.get('/oauth-status', (req, res) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  res.render('oauth-status', {
    title: 'OAuth Configuration Status',
    baseUrl: BASE_URL,
    google: {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: `${BASE_URL}/auth/google/callback`
    },
    github: {
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: `${BASE_URL}/auth/github/callback`
    }
  });
});

// ==================== END OAUTH DEBUG ROUTES ====================

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
  console.log(`🔧 OAuth Debug: http://localhost:${PORT}/debug-oauth`);
  console.log(`🔧 OAuth Status: http://localhost:${PORT}/oauth-status`);
});

module.exports = app;
