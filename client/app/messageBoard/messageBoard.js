angular.module('myApp.messageBoard', [])

.controller('messageBoardCtrl', ['$scope', 'messageBoardFactory', '$state', 'Auth', function($scope, messageBoardFactory, $state, Auth) {

  messageBoardFactory.getPosts()
    .success(function(data) {
      $scope.posts = data;
    })
    .error(function(err) {
      $scope.error = 'Ooopsss...something went wrong. Please try again later.';
    });
  Auth.getUser().success(function(user) {
    if(user.length !== 0)
      console.log('USER: ', user[0]);
      $scope.user = user[0];
  });
  $scope.createPost = function() {
    if($scope.title) {
      var post = {};
      post.title = $scope.title;
      post.body = $scope.body;
      post.author = $scope.user.contact.name;
      post.profile = $scope.user.contact.githubName;
      messageBoardFactory
        .createPost(post)
        .success(function(data) {
          $('#createPost').closeModal()
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

  $scope.showCreatePost = function() {
    $('#createPost').openModal();
  };
}]);