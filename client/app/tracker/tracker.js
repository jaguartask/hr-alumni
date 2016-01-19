angular.module('myApp.tracker', [])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tracker', {
    url: '/tracker',
    templateUrl: '/app/tracker/tracker.html',
    data: {
        requiresLogin: true
      }
  });
})

.controller('TrackerCtrl', function($scope, $state, TrackerFactory, Auth) {
  // get user messages
  Auth.getUser()
    .then(function(result) {
      var id = result.data[0].githubID;
      $scope.id = id;
      return TrackerFactory.getJobs(id)
    })
    .then(function(result) {
      console.log(result);
      $scope.jobs = result.data
    })
    .then(null, function(err) {
      console.log(err);
    })

// update respond
    $scope.updateRespond = function(job) {
      $('#updateRespond').openModal();
    };

  $scope.updateRespondData = function(job) {
    $scope.triggerJobUpdate(job);
  };
// update phone
    $scope.updatePhone = function(job) {
      if(!job.phone) {
        job.phone = true;
      } else {
        job.phone = false;
      }
      $scope.triggerJobUpdate(job);
      return job.phone;
    };

// dinamic editing - not used currently
    $scope.edit = function(job) {
      job.editing = true;
    };

    $scope.doneEditing = function(job) {
      job.editing = false;
      $scope.triggerJobUpdate(job);
    };

    // add new job to list/
    $scope.addJob = function(){
      $('#addJob').openModal();
    };

  $scope.save = function(user) {
    user.user = $scope.id;
    TrackerFactory
      .saveJob(user)
      .then(function(data) {
        $state.reload();
        $scope.user = {};
      })
      .then(null, function(err) {
      })
  };

    // update job
    $scope.updateJob = function(){
      var data = this.data;
    $('#updateJob').openModal();
      this.user = data;
    };

  $scope.update = function(job) {
    $scope.data = job;
    $scope.updateJob();
  }

 $scope.triggerJobUpdate = function(job) {
   console.log('triiger update', job);
    TrackerFactory
      .updateJob(job)
      .then(function(data) {
        console.log(data);
      })
      .then(null, function(err) {
        console.log(err);
      })
 }

// delete and reset
  $scope.remove = function(job) {
    job.show = false;
    TrackerFactory
      .removeJob(job)
      .then(function(data) {
        console.log(data);
      })
      .then(null, function(err) {
        console.log(err);
      })
  }
  $scope.reset = function() {
    $scope.user = null;
  }
})
