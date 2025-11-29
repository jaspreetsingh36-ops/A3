const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'India Cricket Team Stats - Home',
    user: req.user 
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About - Cricket Stats',
    user: req.user 
  });
});

module.exports = router;