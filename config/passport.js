const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');

// Create User model dynamically - no file import needed
const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  displayName: String,
  email: String,
  profilePhoto: String,
  role: { type: String, default: 'user' }
}, { timestamps: true });

// Add findOrCreate method to schema
userSchema.statics.findOrCreate = async function(profile, provider) {
  try {
    let query = {};
    if (provider === 'google') query.googleId = profile.id;
    if (provider === 'github') query.githubId = profile.id;
    
    let user = await this.findOne(query);
    
    if (!user) {
      user = new this({
        displayName: profile.displayName || 'User',
        email: profile.emails?.[0]?.value || 'user@example.com',
        profilePhoto: profile.photos?.[0]?.value || null
      });
      
      if (provider === 'google') user.googleId = profile.id;
      if (provider === 'github') user.githubId = profile.id;
      
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Error in findOrCreate:', error);
    throw error;
  }
};

// Create the model
const User = mongoose.model('User', userSchema);
console.log('✅ User model created dynamically');

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
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

// Get base URL for production
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Check if OAuth credentials are available
const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const hasGitHubCredentials = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;

console.log('OAuth Configuration:');
console.log('- Google OAuth:', hasGoogleCredentials ? 'Configured' : 'Not Configured');
console.log('- GitHub OAuth:', hasGitHubCredentials ? 'Configured' : 'Not Configured');

// Google OAuth Strategy
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
} else {
  console.warn('⚠️ Google OAuth not configured - missing credentials');
}

// GitHub OAuth Strategy
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
} else {
  console.warn('⚠️ GitHub OAuth not configured - missing credentials');
}

module.exports = passport;
