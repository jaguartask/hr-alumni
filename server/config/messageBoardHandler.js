var Post = require('../models/PostSchema');
var Comment = require('../models/CommentSchema');

exports.getAllPosts = function(req, res, next) {
	Post.find(function(err, posts){
		if(err) { return next(err); }
		res.json(posts);
	});
};

exports.savePost = function(req, res, next) {
	var newPost = new Post(req.body);

	newPost.save(function(err, post) {
		if(err) { return next(err); }
		res.json(newPost);
	});
};

//preload post data from db based on passed in id
exports.preloadPost = function(req, res, next, id) {
  var query = Post.findById(id);
  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }
    req.post = post;
    return next();
  });
};

exports.getPost = function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
};

exports.upvotePost = function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
};

exports.addComment = function(req, res, next) {
  var newComment = new Comment(req.body);
  newComment.post = req.post;

  newComment.save(function(err, comment){
    if(err){ return next(err); }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }
      res.json(comment);
    });
  });
};

//preload comment data from db based on passed in id
exports.preloadComment = function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find post')); }
    req.comment = comment;
    return next();
  });
};

exports.upvoteComment = function(req, res, next) {
  req.comment.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
};

exports.getPostComments = function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
};