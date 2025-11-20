/**
 * Player Model - Database schema for cricket players
 * Defines the structure for storing player statistics in MongoDB
 */

// Import mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Define the player schema with validation rules
const playerSchema = new mongoose.Schema({
  // Player's full name
  name: {
    type: String,
    required: [true, 'Player name is required'], // Must have a name
    trim: true // Remove whitespace from both ends
  },
  
  // Player's role in the team
  role: {
    type: String,
    required: [true, 'Player role is required'], // Must have a role
    enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] // Only these values allowed
  },
  
  // Number of matches played
  matches: {
    type: Number,
    required: [true, 'Matches played is required'], // Must specify matches
    min: [0, 'Matches cannot be negative'] // Cannot have negative matches
  },
  
  // Total runs scored by the player
  runs: {
    type: Number,
    default: 0, // Default to 0 if not specified
    min: [0, 'Runs cannot be negative'] // Runs can't be negative
  },
  
  // Total wickets taken (for bowlers)
  wickets: {
    type: Number,
    default: 0, // Default to 0 if not specified
    min: [0, 'Wickets cannot be negative'] // Wickets can't be negative
  },
  
  // Batting average (runs per dismissal)
  average: {
    type: Number,
    default: 0 // Default to 0 if not specified
  },
  
  // Batting strike rate (runs per 100 balls)
  strikeRate: {
    type: Number,
    default: 0 // Default to 0 if not specified
  },
  
  // Player profile image URL
  image: {
    type: String,
    default: '/images/default-player.jpg' // Default image if none provided
  },
  
  // Player's jersey number
  jerseyNumber: {
    type: Number,
    min: [1, 'Jersey number must be at least 1'], // Minimum jersey number
    max: [99, 'Jersey number cannot exceed 99'] // Maximum jersey number
  }
}, {
  // Automatic timestamps for record creation and updates
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create Player model from the schema
const Player = mongoose.model('Player', playerSchema);

// Export the Player model for use in other files
module.exports = Player;