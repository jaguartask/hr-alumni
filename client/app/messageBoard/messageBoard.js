angular.module('myApp.messageBoard', [])

.controller('messageBoardCtrl', ['$scope', 'messageBoardFactory', '$state', function($scope, messageBoardFactory, $state) {
  messageBoardFactory.getPosts()
    .success(function(data) {
      $scope.posts = data;
    })
    .error(function(err) {
      $scope.error = 'Ooopsss...something went wrong. Please try again later.';
    });

  $scope.createPost = function() {
    if($scope.title) {
      var post = {};
      post.title = $scope.title;
      post.body = $scope.body;
      post.author = 'bobby';
      messageBoardFactory
        .createPost(post)
        .success(function(data) {
          $state.go('post', {id: data._id});
        })
        .error(function(err) {
          $scope.error = 'Ooopsss...something went wrong. Please try again later.';
      });
    }
    $scope.title = '';
    $scope.body = '';
  }

  $scope.upvote = function(post) {
    messageBoardFactory.upvote(post)
      .error(function(err) {
          $scope.error = 'Ooopsss...something went wrong. Please try again later.';
      });
  };

  $scope.downvote = function(post) {
    messageBoardFactory.downvote(post)
      .error(function(err) {
          $scope.error = 'Ooopsss...something went wrong. Please try again later.';
      });
  };
}]);