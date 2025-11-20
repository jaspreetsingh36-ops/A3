/**
 * Players Routes - Handles all player-related CRUD operations
 * Manages displaying, adding, editing, and deleting player statistics
 */

// Import required modules
const express = require('express'); // Express framework
const router = express.Router(); // Create router for player routes
const Player = require('../models/Player'); // Player database model

// GET all players - Display complete player list with statistics
router.get('/', async (req, res) => {
  try {
    // Fetch all players from database, sorted by role then name
    const players = await Player.find().sort({ role: 1, name: 1 });
    
    // Render players list view with data
    res.render('players/list', { 
      title: 'Team Squad - Player Statistics', // Page title
      page: 'players', // Current page identifier
      players: players // Pass players data to template
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching players:', error);
    
    // Render error page if database operation fails
    res.status(500).render('error', { 
      title: 'Error - Player Data',
      message: 'Failed to load player statistics. Please try again later.'
    });
  }
});

// GET form to add new player - Display player creation form
router.get('/new', (req, res) => {
  // Render the add player form
  res.render('players/add', {
    title: 'Add New Player - Team Management', // Page title
    page: 'add-player', // Current page identifier
    error: null, // Initialize error as null (no errors on form load)
    formData: {} // Empty form data for fresh form
  });
});

// POST create new player - Handle form submission for new player
router.post('/', async (req, res) => {
  try {
    // Create new Player instance with data from request body
    const newPlayer = new Player(req.body);
    
    // Save the new player to MongoDB database
    await newPlayer.save();
    
    // Redirect to players list after successful creation
    res.redirect('/players');
  } catch (error) {
    // Log error for debugging
    console.error('Error creating player:', error);

    // Check if error is a validation error (from Mongoose)
    if (error.name === 'ValidationError') {
      // Extract all validation error messages
      const errors = Object.values(error.errors).map(err => err.message);
      
      // Re-render the form with error messages and previous input
      return res.render('players/add', {
        title: 'Add New Player - Team Management',
        page: 'add-player',
        error: errors.join(', '), // Combine error messages
        formData: req.body // Pass back user's form data for correction
      });
    }

    // Handle other types of errors (database connection, etc.)
    res.status(500).render('error', {
      title: 'Error - Add Player',
      message: 'Failed to add new player. Please try again.'
    });
  }
});

// GET player details - Display individual player statistics
router.get('/:id', async (req, res) => {
  try {
    // Find player by ID from URL parameters
    const player = await Player.findById(req.params.id);
    
    // Check if player exists in database
    if (!player) {
      // Return 404 error if player not found
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The requested player could not be found in the team squad.'
      });
    }
    
    // Render player details view with player data
    res.render('players/details', {
      title: `Player Profile - ${player.name}`, // Dynamic title with player name
      page: 'player-details', // Current page identifier
      player: player // Pass player data to template
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching player details:', error);
    
    // Render error page if player fetch fails
    res.status(500).render('error', {
      title: 'Error - Player Profile',
      message: 'Failed to load player profile. Please try again.'
    });
  }
});

// GET form to edit player - Display edit form for existing player
router.get('/:id/edit', async (req, res) => {
  try {
    // Find player by ID from URL parameters
    const player = await Player.findById(req.params.id);
    
    // Check if player exists
    if (!player) {
      // Return 404 error if player not found
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The player you are trying to edit does not exist.'
      });
    }
    
    // Render edit form with existing player data
    res.render('players/edit', {
      title: `Edit Player - ${player.name}`, // Dynamic title
      page: 'edit-player', // Current page identifier
      player: player, // Pass player data to pre-fill form
      error: null // Initialize error as null
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching player for edit:', error);
    
    // Render error page if player fetch fails
    res.status(500).render('error', {
      title: 'Error - Edit Player',
      message: 'Failed to load player for editing. Please try again.'
    });
  }
});

// PUT update player - Handle form submission for updating player
router.post('/:id/update', async (req, res) => {
  try {
    // Find player by ID and update with new data from request body
    const player = await Player.findByIdAndUpdate(
      req.params.id, // Player ID from URL parameters
      req.body, // New data from form submission
      { new: true, runValidators: true } // Options: return updated document, run validators
    );
    
    // Check if player was found and updated
    if (!player) {
      // Return 404 error if player not found
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The player you are trying to update does not exist.'
      });
    }
    
    // Redirect to player details page after successful update
    res.redirect(`/players/${player._id}`);
  } catch (error) {
    // Log error for debugging
    console.error('Error updating player:', error);
    
    // Check if error is a validation error
    if (error.name === 'ValidationError') {
      // Extract all validation error messages
      const errors = Object.values(error.errors).map(err => err.message);
      
      // Fetch player data again to re-render form
      const player = await Player.findById(req.params.id);
      
      // Re-render edit form with error messages
      return res.render('players/edit', { 
        title: 'Edit Player',
        page: 'edit-player',
        error: errors.join(', '), // Combine error messages
        player: player // Pass player data back to form
      });
    }
    
    // Handle other types of errors
    res.status(500).render('error', { 
      title: 'Error - Update Player',
      message: 'Failed to update player. Please try again.'
    });
  }
});

// DELETE player - Handle player deletion with confirmation
router.post('/:id/delete', async (req, res) => {
  try {
    // Find player by ID and delete from database
    const player = await Player.findByIdAndDelete(req.params.id);
    
    // Check if player was found and deleted
    if (!player) {
      // Return 404 error if player not found
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The player you are trying to delete does not exist.'
      });
    }
    
    // Redirect to players list after successful deletion
    res.redirect('/players');
  } catch (error) {
    // Log error for debugging
    console.error('Error deleting player:', error);
    
    // Render error page if deletion fails
    res.status(500).render('error', { 
      title: 'Error - Delete Player',
      message: 'Failed to delete player. Please try again.'
    });
  }
});

// Export router to be used in main app.js file
module.exports = router;