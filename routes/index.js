/**
 * Home Routes - Handles main page and general site routes
 * Contains routes for home page, about, and other general pages
 */

// Import Express framework
const express = require('express');
// Create router object to define routes
const router = express.Router();

// Import Player model for database operations
const Player = require('../models/Player');

// GET home page - Display welcome page with team overview
router.get('/', async (req, res) => {
  try {
    // Fetch all players from database to display on home page
    const players = await Player.find().sort({ name: 1 }); // Sort by name alphabetically
    
    // Render the home page with player data
    res.render('index', { 
      title: 'India Cricket Team - Home', // Page title
      page: 'home', // Current page identifier for navigation
      players: players // Pass players data to the view
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error fetching players for home page:', error);
    
    // Render error page if database query fails
    res.status(500).render('error', { 
      title: 'Error - Cricket Stats',
      message: 'Failed to load team data. Please try again later.'
    });
  }
});

// Export router to be used in main app.js file
module.exports = router;