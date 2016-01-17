var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
  date: String,
  location: String,
  name: String,
  offer: String,
  phone: Boolean,
  position: String,
  salary: String,
  site: Boolean,
  respond: String,
  show: Boolean
});

module.exports = mongoose.model('Job', JobSchema);
