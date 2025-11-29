const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/user');

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Get base URL from environment
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile.displayName);
    
    // Find or create user
    const user = await User.findOrCreate(profile, 'google');
    return done(null, user);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// GitHub OAuth Strategy - UPDATED
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/github/callback`,
  scope: ['user:email', 'read:user']  // Added read:user scope
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub profile received:', profile);
    console.log('GitHub profile ID:', profile.id);
    console.log('GitHub username:', profile.username);
    console.log('GitHub emails:', profile.emails);
    
    // Enhanced profile handling for GitHub
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const displayName = profile.displayName || profile.username || 'GitHub User';
    
    console.log('Processed email:', email);
    console.log('Processed display name:', displayName);
    
    // Find or create user with enhanced profile data
    const enhancedProfile = {
      ...profile,
      displayName: displayName,
      email: email
    };
    
    const user = await User.findOrCreate(enhancedProfile, 'github');
    return done(null, user);
    
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));

module.exports = passport;
