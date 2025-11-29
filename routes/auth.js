const express = require('express');
const passport = require('passport');
const router = express.Router();

// Debug route to check OAuth configuration
router.get('/debug', (req, res) => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  res.json({
    baseURL: baseURL,
    googleCallback: `${baseURL}/auth/google/callback`,
    githubCallback: `${baseURL}/auth/github/callback`,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set',
    githubClientId: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not Set'
  });
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/?error=google_auth_failed',
    failureMessage: true 
  }),
  (req, res) => {
    console.log('Google authentication successful for:', req.user.displayName);
    res.redirect('/players');
  }
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'] 
  })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/?error=github_auth_failed',
    failureMessage: true 
  }),
  (req, res) => {
    console.log('GitHub authentication successful for:', req.user.displayName);
    res.redirect('/players');
  }
);

// Logout route
router.get('/logout', (req, res, next) => {
  const userName = req.user ? req.user.displayName : 'User';
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log('User logged out:', userName);
    res.redirect('/?message=logged_out');
  });
});

module.exports = router;