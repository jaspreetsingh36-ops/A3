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

// GitHub OAuth Strategy - WITH ENHANCED ERROR LOGGING
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/github/callback`,
  scope: ['user:email', 'read:user']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('=== GITHUB OAUTH SUCCESS ===');
    console.log('Access Token Received:', accessToken ? 'Yes' : 'No');
    console.log('GitHub Username:', profile.username);
    console.log('GitHub Display Name:', profile.displayName);
    console.log('GitHub ID:', profile.id);
    console.log('GitHub Emails:', profile.emails);
    console.log('=== END GITHUB OAUTH SUCCESS ===');
    
    // Return profile directly without database
    return done(null, profile);
  } catch (error) {
    console.error('=== GITHUB OAUTH ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END GITHUB OAUTH ERROR ===');
    return done(error, null);
  }
}));

// Simple debug middleware instead of overriding authenticate
const originalGitHubAuthenticate = GitHubStrategy.prototype.authenticate;
GitHubStrategy.prototype.authenticate = function(req, options) {
  console.log('=== GITHUB AUTH START ===');
  console.log('Client ID being used:', this._oauth2._clientId);
  console.log('Callback URL:', this._callbackURL);
  console.log('=== END GITHUB AUTH START ===');
  
  // Call the original authenticate method
  return originalGitHubAuthenticate.call(this, req, options);
};

module.exports = passport;
