// routes/players.js
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { requireAuth } = require('../config/auth');

// ===== PUBLIC ROUTES =====
// View all players (PUBLIC - no authentication required)
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ name: 1 });
    res.render('players/index', {
      title: 'Indian Cricket Players',
      players: players,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading players'
    });
  }
});

// View single player (PUBLIC - no authentication required)
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The requested player was not found.'
      });
    }
    res.render('players/show', {
      title: player.name + ' - Profile',
      player: player,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading player'
    });
  }
});

// ===== PROTECTED ROUTES =====
// Add new player (PROTECTED - requires login)
router.get('/new', requireAuth, (req, res) => {
  res.render('players/new', {
    title: 'Add New Player',
    user: req.user
  });
});

// Create player (PROTECTED - requires login)
router.post('/', requireAuth, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.redirect('/players');
  } catch (err) {
    console.error('Error creating player:', err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error creating player'
    });
  }
});

// Edit player form (PROTECTED - requires login)
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).render('error', {
        title: 'Player Not Found',
        message: 'The requested player was not found.'
      });
    }
    res.render('players/edit', {
      title: 'Edit Player: ' + player.name,
      player: player,
      user: req.user
    });
  } catch (err) {
    console.error('Error fetching player for edit:', err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading player for editing'
    });
  }
});

// Update player (PROTECTED - requires login)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    await Player.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/players/${req.params.id}`);
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error updating player'
    });
  }
});

// Delete player (PROTECTED - requires login)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.redirect('/players');
  } catch (err) {
    console.error('Error deleting player:', err);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error deleting player'
    });
  }
});

module.exports = router;
