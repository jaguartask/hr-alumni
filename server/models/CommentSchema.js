var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  profile: String,
  upvotes: {type: Number, default: 0},
  createdAt: { type: Date, default: Date.now },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

CommentSchema.methods.downvote = function(cb) {
  this.upvotes -= 1;
  this.save(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);