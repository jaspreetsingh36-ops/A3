/**
 * Players Routes - Handles all player-related CRUD operations
 * Manages displaying, adding, editing, and deleting player statistics
 */

// Import required modules
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET all players - Display complete player list with statistics
router.get('/', async (req, res) => {
  try {
    // Fetch all players from database, sorted by role then name
    const players = await Player.find().sort({ role: 1, name: 1 });
    
    // Render players list view with data
    res.render('players/list', { 
      title: 'Team Squad - Player Statistics',
      page: 'players',
      players: players
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).render('error', { 
      title: 'Error - Player Data',
      message: 'Failed to load player statistics. Please try again later.'
    });
  }
});

// GET form to add new player - Display player creation form
router.get('/new', (req, res) => {
  res.render('players/add', {
    title: 'Add New Player - Team Management',
    page: 'add-player',
    error: null,
    formData: {}
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
    console.error('Error creating player:', error);

    // Check if error is a validation error (from Mongoose)
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      
      // Re-render the form with error messages and previous input
      return res.render('players/add', {
        title: 'Add New Player - Team Management',
        page: 'add-player',
        error: errors.join(', '),
        formData: req.body
      });
    }

    // Handle other types of errors
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
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The requested player could not be found in the team squad.'
      });
    }
    
    // Render player details view with player data
    res.render('players/details', {
      title: `Player Profile - ${player.name}`,
      page: 'player-details',
      player: player
    });
  } catch (error) {
    console.error('Error fetching player details:', error);
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
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The player you are trying to edit does not exist.'
      });
    }
    
    // Render edit form with existing player data
    res.render('players/edit', {
      title: `Edit Player - ${player.name}`,
      page: 'edit-player',
      player: player,
      error: null
    });
  } catch (error) {
    console.error('Error fetching player for edit:', error);
    res.status(500).render('error', {
      title: 'Error - Edit Player',
      message: 'Failed to load player for editing. Please try again.'
    });
  }
});

// PUT update player - Handle form submission for updating player
router.put('/:id', async (req, res) => {
  try {
    // Find player by ID and update with new data from request body
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Check if player was found and updated
    if (!player) {
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The player you are trying to update does not exist.'
      });
    }
    
    // Redirect to player details page after successful update
    res.redirect(`/players/${player._id}`);
  } catch (error) {
    console.error('Error updating player:', error);
    
    // Check if error is a validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      
      // Fetch player data again to re-render form
      const player = await Player.findById(req.params.id);
      
      // Re-render edit form with error messages
      return res.render('players/edit', { 
        title: 'Edit Player',
        page: 'edit-player',
        error: errors.join(', '),
        player: player
      });
    }
    
    // Handle other types of errors
    res.status(500).render('error', { 
      title: 'Error - Update Player',
      message: 'Failed to update player. Please try again.'
    });
  }
});

// DELETE player - Handle player deletion
router.delete('/:id', async (req, res) => {
  try {
    // Find player by ID and delete from database
    const player = await Player.findByIdAndDelete(req.params.id);
    
    // Check if player was found and deleted
    if (!player) {
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The player you are trying to delete does not exist.'
      });
    }
    
    // Redirect to players list after successful deletion
    res.redirect('/players');
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).render('error', { 
      title: 'Error - Delete Player',
      message: 'Failed to delete player. Please try again.'
    });
  }
});

// Export router to be used in main app.js file
module.exports = router;