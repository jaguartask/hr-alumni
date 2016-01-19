angular.module('myApp.post', [])

.controller('postCtrl', ['$scope', '$stateParams', '$state', 'messageBoardFactory', 'Auth', function($scope, $stateParams, $state, messageBoardFactory, Auth) {
  if($stateParams._id === null) {
    $state.go('messageBoard');
  }
  messageBoardFactory
  	.getPost($stateParams.id)
  	.success(function(data) {
  		$scope.post = data;
  	})
  	.error(function(err) {
  	  $scope.error = 'Ooopsss...something went wrong. Please try again later.';
  });

  Auth.getUser().success(function(user) {
    if(user.length !== 0)
      console.log('USER: ', user[0]);
      $scope.user = user[0];
  });

  $scope.addComment = function() {
    if($scope.body === '') { return; }
    messageBoardFactory
    	.addComment($stateParams.id, {body: $scope.body, author: $scope.user.contact.name, profile: $scope.user.contact.githubName})
    	.success(function(data) {
    		console.log('data: ', data);
    		$scope.post.comments.push(data);
    	});
    $scope.body = '';
  };

  $scope.upvoteComment = function(comment) {
  	messageBoardFactory
  		.upvoteComment($scope.post, comment)
  		.success(function(data) {
  			comment.upvotes += 1;
  		})
  		.error(function(err) {
  	  	$scope.error = 'Ooopsss...something went wrong. Please try again later.';
  		});
  };

  $scope.downvoteComment = function(comment) {
  	messageBoardFactory
  		.downvoteComment($scope.post, comment)
  		.success(function(data) {
  			comment.upvotes -= 1;
  		})
  		.error(function(err) {
  	  	$scope.error = 'Ooopsss...something went wrong. Please try again later.';
  		});
  };

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

  $scope.showCreateComment = function() {
    $('#createComment').openModal();
  };
}]);