# 🏏 India Cricket Team Statistics

A full-stack web application for tracking and managing Indian cricket team player statistics. Built with Node.js, Express, MongoDB, and EJS templating.

##  Features

- **Player Statistics**: Track runs, wickets, averages, and strike rates
- ** Role-based Filtering**: View players by batsmen, bowlers, all-rounders, and wicket-keepers
- ** Full CRUD Operations**: Create, Read, Update, and Delete player records
- ** Professional UI**: Dark theme with cricket-inspired design
- ** Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ** Safe Deletion**: Confirmation modals for player removal
- ** Real-time Validation**: Form validation with error handling
### Frontend
- **EJS Templating** - Dynamic HTML rendering
- **Bootstrap 5** - Responsive UI framework
- **Custom CSS** - Cricket-themed dark design
- **JavaScript** - Interactive components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management

### Database
- **MongoDB Atlas** - Cloud database service
- **MongoDB** - NoSQL database

### Deployment
- **Railway/renader** - Cloud hosting platform
- **GitHub** - Version control

###Project Structure##
india-cricket-stats/
├── models/
│ └── Player.js # Database schema
├── routes/
│ ├── index.js # Home page routes
│ └── players.js # Player CRUD operations
├── views/
│ ├── partials/
│ │ ├── header.ejs # Navigation header
│ │ └── footer.ejs # Page footer
│ ├── players/
│ │ ├── list.ejs # All players view
│ │ ├── add.ejs # Add player form
│ │ ├── edit.ejs # Edit player form
│ │ └── details.ejs # Player details
│ ├── index.ejs # Home page
│ └── error.ejs # Error page
├── public/
│ └── css/
│ └── style.css # Custom styles
├── config/
│ └── database.js # DB configuration
├── app.js # Main application
└── package.json # Dependencie



##  Database Schema

### Player Model
```javascript
{
  name: String,           // Player full name
  role: String,           // Batsman, Bowler, All-Rounder, Wicket-Keeper
  matches: Number,        // Total matches played
  runs: Number,           // Career runs scored
  wickets: Number,        // Career wickets taken
  average: Number,        // Batting average
  strikeRate: Number,     // Batting strike rate
  jerseyNumber: Number,   // Player jersey number (1-99)
  image: String,          // Profile image URL
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-updated
}

License
This project is developed for educational purposes as part of INFR3120 Assignment 3.


Jaspreet Singh
INFR3120 - Web Application Development
Assignment 3 - CRUD Application
Fall 2025

Acknowledgments
Indian Cricket Team for inspiration
MongoDB Atlas for cloud database services
Bootstrap team for UI framework
Express.js community for web framewor


Reference:
Cricket Data Sources
- [ESPN Cricinfo](https://www.espncricinfo.com/) - Player statistics reference
- [ICC Official Website](https://www.icc-cricket.com/) - International cricket data
- [BCCI Official Website](https://www.bcci.tv/) - Indian cricket team information

Official Documentation
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose ODM Documentation](https://mongoosejs.com/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [EJS Templating Documentation](https://ejs.co/)
- [Node.js Documentation](https://nodejs.org/docs/)

Course Materials
- INFR3120 Course Lectures & Materials
- Professor's Code Examples & Demos
