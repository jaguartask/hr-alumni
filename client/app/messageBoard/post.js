angular.module('myApp.post', [])

.controller('postCtrl', ['$scope', '$stateParams', '$state', 'messageBoardFactory', function($scope, $stateParams, $state, messageBoardFactory) {
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

  $scope.addComment = function() {
    if($scope.body === '') { return; }
    messageBoardFactory
    	.addComment($stateParams.id, {body: $scope.body, author: 'bobby'})
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
      .success(function(data) {
        console.log('success');
      });
  };
}]);