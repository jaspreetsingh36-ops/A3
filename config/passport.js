const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  done(null, { id: id });
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
    console.log('Google OAuth Successful for:', profile.displayName);
    // Return profile directly without database
    return done(null, profile);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// GitHub OAuth Strategy  
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/github/callback`,
  scope: ['user:email', 'read:user']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub OAuth Successful for:', profile.username);
    // Return profile directly without database
    return done(null, profile);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));

module.exports = passport;
