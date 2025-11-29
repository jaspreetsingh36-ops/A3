// Add detailed error logging to your GitHub callback
router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/login',
    failureMessage: true 
  }),
  (req, res) => {
    console.log('GitHub callback successful, user:', req.user);
    res.redirect('/');
  }
);

// Add error handling middleware
router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    console.log('GitHub Auth Error:', err);
    console.log('GitHub Auth User:', user);
    console.log('GitHub Auth Info:', info);
    
    if (err) {
      console.error('GitHub authentication error:', err);
      return res.redirect('/login?error=auth_failed');
    }
    if (!user) {
      console.error('No user returned from GitHub auth');
      return res.redirect('/login?error=no_user');
    }
    
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return res.redirect('/login?error=login_failed');
      }
      console.log('User logged in successfully:', user.id);
      return res.redirect('/');
    });
  })(req, res, next);
});
