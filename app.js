/**
 * India Cricket Team Stats - Main Application File
 * INFR3120 Assignment 3 - Cricket Statistics Portal
 * Author: Jaspreet Singh
 */

// Import required modules
const express = require('express'); // Express.js web framework
const mongoose = require('mongoose'); // MongoDB object modeling
const dotenv = require('dotenv'); // Environment variables loader

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cricket-admin:cricket2025@cluster0.avlirvg.mongodb.net/india-cricket-stats?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB Atlas - Cricket Database'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware configuration

// Serve static files from public directory (CSS, images, JS)
app.use(express.static('public'));

// Parse URL-encoded form data (from form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse JSON data from requests
app.use(express.json());

// Set EJS as templating engine for dynamic HTML rendering
app.set('view engine', 'ejs');

// Route handlers - Import and use route modules

// Home page and main routes
app.use('/', require('./routes/index'));

// Player statistics and management routes
app.use('/players', require('./routes/players'));

// 404 Error handler - Catch all unmatched routes
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found - Cricket Stats',
    message: 'The cricket page you are looking for does not exist.'
  });
});

// Global error handler - Catch all server errors
app.use((err, req, res, next) => {
  console.error('Global error handler:', err); // Log error for debugging
  res.status(500).render('error', {
    title: 'Server Error - Cricket Stats',
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// Start the server and listen on specified port
app.listen(PORT, () => {
  console.log(`🏏 India Cricket Stats server running on http://localhost:${PORT}`);
});

// Export app for testing purposes
module.exports = app;