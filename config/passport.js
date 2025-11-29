const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');

// Try to import User model, but provide fallback if it fails
let User;
try {
  User = require('../models/user');
} catch (error) {
  console.warn('⚠️ User model not found, creating fallback...');
  // Create a simple in-memory user schema as fallback
  const userSchema = new mongoose.Schema({
    googleId: String,
    githubId: String,
    displayName: String,
    email: String,
    profilePhoto: String,
    role: { type: String, default: 'user' }
  }, { timestamps: true });
  
  User = mongoose.model('User', userSchema);
}

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      done(null, user);
    } else {
      // Fallback for demo users
      done(null, { 
        _id: 'demo-user', 
        displayName: 'Demo User', 
        email: 'demo@example.com',
        role: 'user' 
      });
    }
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

// Rest of your passport configuration remains the same...
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const hasGitHubCredentials = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;

console.log('OAuth Configuration:');
console.log('- Google OAuth:', hasGoogleCredentials ? 'Configured' : 'Not Configured');
console.log('- GitHub OAuth:', hasGitHubCredentials ? 'Configured' : 'Not Configured');

if (hasGoogleCredentials) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile received:', profile.displayName);
      const user = await User.findOrCreate(profile, 'google');
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
}

if (hasGitHubCredentials) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/github/callback`,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('GitHub profile received:', profile.displayName);
      const user = await User.findOrCreate(profile, 'github');
      return done(null, user);
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return done(error, null);
    }
  }));
}

// Fallback local strategy
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Create a demo user
      const demoUser = {
        _id: 'demo-user-id',
        displayName: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      };
      return done(null, demoUser);
    } catch (error) {
      return done(error);
    }
  }
));

module.exports = passport;
