angular.module('myApp.tracker', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tracker', {
    url: '/tracker',
    templateUrl: '/app/tracker/tracker.html'
  });
})

.controller('TrackerCtrl', function($scope, $state, TrackerFactory) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
      "November", "December"
  ];

  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  TrackerFactory
    .getJobs()
    .success(function(data) {
      console.log(data);
      $scope.jobs = data;
    })
    .error(function(err) {
      console.log('err', err);
    })

    $scope.addJob = function(){
      $('#addJob').openModal();
    }
    $scope.updateJob = function(){
    $('#updateJob').openModal();
    }

  $scope.save = function(user) {
    console.log(user);
    user.offer = 'not yet';
    user.date = day + ' ' + monthNames[monthIndex];
    user.phone = false;
    user.site = ' ';
    user.respond = ' ';
    user.show = true;
    TrackerFactory
      .saveJob(user)
      .success(function(data) {
        $state.reload();
        $scope.user = {};
      })
      .error(function(err) {
        console.log(err);
      })
  };

  $scope.update = function(job) {
    $scope.user = job;
    $scope.updateJob();
  }

 $scope.triggerJobUpdate = function(job) {
   console.log('triiger update');
    TrackerFactory
      .updateJob(job)
      .success(function(data) {
        console.log(data);
      })
      .error(function(err) {
        console.log(err);
      })
 }

  $scope.remove = function(job) {
    console.log(job);
    job.show = false;
    TrackerFactory
      .removeJob(job)
      .success(function(data) {
        console.log(data);
      })
      .error(function(err) {
        console.log(err);
      })
  }
  $scope.reset = function() {
    $scope.user = null;
  }
})
