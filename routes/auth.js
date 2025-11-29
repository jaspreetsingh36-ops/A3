const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureMessage: true 
  }),
  (req, res) => {
    console.log('Google login successful for:', req.user.displayName);
    res.redirect('/');
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/login',
    failureMessage: true 
  }),
  (req, res) => {
    console.log('GitHub login successful for:', req.user.displayName || req.user.username);
    res.redirect('/');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  console.log('User logging out:', req.user ? (req.user.displayName || req.user.username) : 'No user');
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
