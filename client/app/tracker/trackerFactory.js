angular.module('myApp.TrackerFactory', [])

.factory('TrackerFactory', function($http) {
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

  function getJobs(id) {
    console.log('idInFactory', id);
    return $http.get('api/tracker/' + id)
      .then(function(data) {
        return data;
      })
      .then(null, function(err) {
        return err;
      })
  }

  function saveJob(user) {
    user.offer = 'not yet';
    user.date = day + ' ' + monthNames[monthIndex];
    user.phone = false;
    user.site = ' ';
    user.respond = 'Insert Date';
    user.show = true;
    user.editing = false;
    return $http.post('/api/tracker', user)
      .then(function(data) {
        return data;
      })
      .then(null, function(err) {
        return err;
      })
  }

  function removeJob(job) {
    return $http.post('/api/tracker/remove', job)
      .then(function(data) {
        return data;
      })
      .then(null, function(err) {
        return err;
      })
  }

  function updateJob(job) {
    return $http.post('/api/tracker/update', job)
      .then(function(data) {
        return data;
      })
      .then(null, function(err) {
        return err;
      })
  }

  return {
    saveJob: saveJob,
    getJobs: getJobs,
    removeJob: removeJob,
    updateJob: updateJob
  }
})
