var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  author: String,
  title: String,
  body: String,
  profile: String,
  upvotes: {type: Number, default: 0},
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
  this.upvotes -= 1;
  this.save(cb);
};

module.exports = mongoose.model('Post', PostSchema);