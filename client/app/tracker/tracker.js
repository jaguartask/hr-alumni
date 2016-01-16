angular.module('myApp.tracker', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tracker', {
    url: '/tracker',
    templateUrl: '/app/tracker/tracker.html'
  });
})

.controller('TrackerCtrl', function($scope, $state, TrackerFactory) {
  TrackerFactory
    .getJobs()
    .success(function(data) {
      console.log(data);
      $scope.jobs = data;

    })
    .error(function(err) {
      console.log('err', err);
    })


  // TrackerFactory.getJobs()
  //   .success(function(data) {
  //     $scope.jobs = data;
  //   })
  //   .error(function(err) {
  //     console.log('unable to getJobs', err);
  //   })
})

