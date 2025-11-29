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
    res.redirect('/');
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github'));

// GitHub callback with detailed error logging
router.get('/github/callback', (req, res, next) => {
  console.log('=== GITHUB CALLBACK RECEIVED ===');
  console.log('Query params:', req.query);
  console.log('=== END GITHUB CALLBACK RECEIVED ===');
  
  passport.authenticate('github', { 
    failureRedirect: '/login',
    failureMessage: true 
  }, (err, user, info) => {
    console.log('=== GITHUB AUTH RESULT ===');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);
    console.log('=== END GITHUB AUTH RESULT ===');
    
    if (err) {
      console.error('GitHub authentication failed:', err);
      return res.redirect('/login?error=github_auth_failed');
    }
    
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login after GitHub auth failed:', loginErr);
        return res.redirect('/login?error=login_failed');
      }
      console.log('GitHub login successful for user:', user.username);
      return res.redirect('/');
    });
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
