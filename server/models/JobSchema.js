var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
  date: String,
  location: String,
  name: String,
  offer: String,
  phone: Boolean,
  position: String,
  salary: String,
  site: String,
  respond: String,
  show: Boolean,
  editing: Boolean,
  user: String
});

module.exports = mongoose.model('Job', JobSchema);
