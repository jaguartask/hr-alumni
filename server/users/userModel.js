var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  contact: {
    name: {type: String},
    profilePic:  {type: String},
    githubName: {type: String, required: true, unique: true},
    email: {type: String, unique: true},
    location: {type: String}
  },

  about: {
    job: { type: Boolean, required: true, default: false },
    invest: {type: Boolean, required: true, default: false},
    summary: {type: String},
    status: {type: String}
  },

  experience: {
    companies: {type: String},
    languages: {type: String}
  },

  links: {
    blog: {type: String},
    website: {type: String},
    linkedin: {type: String},
    github: {type: String}
  },

  projects: {
    project1: {type: String},
    project2: {type: String},
    project3: {type: String}
  }

});



module.exports = mongoose.model('users', UserSchema);

//https://www.npmjs.com/package/mongoose-type-url
