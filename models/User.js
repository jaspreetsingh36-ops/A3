const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  displayName: String,
  email: String,
  profilePhoto: String,
  role: { type: String, default: 'user' }
}, { timestamps: true });

// Static method to find or create user
userSchema.statics.findOrCreate = async function(profile, provider) {
  let user;
  
  if (provider === 'google') {
    user = await this.findOne({ googleId: profile.id });
  } else if (provider === 'github') {
    user = await this.findOne({ githubId: profile.id });
  }
  
  if (!user) {
    // Create new user
    user = new this({
      displayName: profile.displayName,
      email: profile.emails ? profile.emails[0].value : `${profile.username}@github.com`,
      profilePhoto: profile.photos ? profile.photos[0].value : null
    });
    
    if (provider === 'google') {
      user.googleId = profile.id;
    } else if (provider === 'github') {
      user.githubId = profile.id;
    }
    
    await user.save();
  }
  
  return user;
};

module.exports = mongoose.model('User', userSchema);