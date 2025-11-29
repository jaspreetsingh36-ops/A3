const express = require('express');
const passport = require('passport');
const router = express.Router();

// Check if OAuth is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'dummy-google-client-id';
const isGitHubConfigured = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'dummy-github-client-id';

// Debug route
router.get('/debug', (req, res) => {
  res.json({
    googleConfigured: isGoogleConfigured,
    githubConfigured: isGitHubConfigured,
    baseURL: process.env.BASE_URL
  });
});

// Google OAuth routes - only if configured
if (isGoogleConfigured) {
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
      console.log('Google authentication successful for:', req.user?.displayName);
      res.redirect('/players');
    }
  );
} else {
  router.get('/google', (req, res) => {
    res.redirect('/?error=google_not_configured');
  });
}

// GitHub OAuth routes - only if configured
if (isGitHubConfigured) {
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
      console.log('GitHub authentication successful for:', req.user?.displayName);
      res.redirect('/players');
    }
  );
} else {
  router.get('/github', (req, res) => {
    res.redirect('/?error=github_not_configured');
  });
}

// Local login for development
router.post('/local',
  passport.authenticate('local', {
    failureRedirect: '/?error=local_auth_failed',
    failureMessage: true
  }),
  (req, res) => {
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
