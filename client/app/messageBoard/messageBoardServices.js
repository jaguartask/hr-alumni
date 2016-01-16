angular.module('myApp.MessageBoardService', [])

.factory('messageBoardFactory', ['$http', function($http) {
  var id = 3;
  var posts = [ 
    {id: 1, title: 'Post 1', body: 'some bs about cats :D', author: 'bill', comments: [{comment: 'meow', author: 'tacocat'}]},
    {id: 2, title: 'Very important post 2', body: 'aint anybody has time for that', author: 'swampbilly', comments: [{comment: 'write your blog posts', author: 'taylor'}]}
  ];
  var getPosts = function() {
    return $http.get('/api/posts')
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      });
  };
  var createPost = function(post) {
    post.id = id++;
    post.comments = [];
    posts.push(post);
    return $http.post('/api/posts', post)
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      });
  };
  var upvote = function(post) {
    return $http.put('/api/posts/' + post._id + '/upvote')
      .success(function(data) {
        post.upvotes += 1;
      })
      .error(function(err) {
        return err;
      });
  };

  var getPost = function(id) {
    return $http.get('/api/posts/' + id)
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      });
  };
  var addComment = function(id, comment) {
    return $http.post('/api/posts/' + id + '/comments', comment)
      .success(function(data) {
        console.log('data ', data);
        return data;
      })
      .error(function(err) {
        return err;
      });
  };
  var upvoteComment = function(post, comment) {
    return $http.put('/api/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
      .success(function(data){
      })
      .error(function(err) {
        return err;
      });
  };

  var downvoteComment = function(post, comment) {
    return $http.put('/api/posts/' + post._id + '/comments/'+ comment._id + '/downvote')
      .success(function(data){
      })
      .error(function(err) {
        return err;
      });
  };
  return {
    getPosts: getPosts,
    createPost: createPost,
    getPost: getPost,
    addComment: addComment,
    upvote: upvote,
    upvoteComment: upvoteComment,
    downvoteComment: downvoteComment
  };
}]);