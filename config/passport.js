const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Serialize user to session - FIXED
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.displayName || user.username);
  done(null, user);
});

// Deserialize user from session - FIXED
passport.deserializeUser(async (user, done) => {
  console.log('Deserializing user:', user.displayName || user.username);
  done(null, user);
});

// Get base URL from environment
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Google OAuth Strategy - FIXED
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth Successful for:', profile.displayName);
    
    // Create user object with all needed fields
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
      photos: profile.photos,
      provider: 'google',
      googleId: profile.id
    };
    
    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// GitHub OAuth Strategy - FIXED
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/github/callback`,
  scope: ['user:email', 'read:user']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub OAuth Successful for:', profile.username);
    
    // Create user object with all needed fields
    const user = {
      id: profile.id,
      displayName: profile.displayName || profile.username,
      username: profile.username,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
      photos: profile.photos,
      provider: 'github',
      githubId: profile.id
    };
    
    return done(null, user);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));

module.exports = passport;
