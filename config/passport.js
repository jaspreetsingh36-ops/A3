const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User');

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

// Get base URL for production
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Check if OAuth credentials are available
const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const hasGitHubCredentials = process.env.GITUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;

console.log('OAuth Configuration:');
console.log('- Google OAuth:', hasGoogleCredentials ? 'Configured' : 'Not Configured');
console.log('- GitHub OAuth:', hasGitHubCredentials ? 'Configured' : 'Not Configured');

// Google OAuth Strategy - Only setup if credentials exist
if (hasGoogleCredentials) {
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
} else {
  console.warn('⚠️ Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

// GitHub OAuth Strategy - Only setup if credentials exist
if (hasGitHubCredentials) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/github/callback`,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('GitHub profile received:', profile.displayName);
      
      // Find or create user
      const user = await User.findOrCreate(profile, 'github');
      return done(null, user);
      
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return done(error, null);
    }
  }));
} else {
  console.warn('⚠️ GitHub OAuth not configured - missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
}

// Dummy strategy for development when no OAuth is configured
if (!hasGoogleCredentials && !hasGitHubCredentials) {
  console.log('🔧 Using dummy authentication for development');
  
  const LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        // Create or find a dummy user
        let user = await User.findOne({ email: 'demo@example.com' });
        if (!user) {
          user = new User({
            displayName: 'Demo User',
            email: 'demo@example.com',
            role: 'user'
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
}

module.exports = passport;
