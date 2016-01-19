angular.module('myApp.TrackerFactory', [])

.factory('TrackerFactory', function($http) {

  function getJobs(user) {
    return $http.get('api/tracker', user)
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      })
  }

  function saveJob(user) {
    return $http.post('/api/tracker', user)
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      })
  }

  function removeJob(job) {
    return $http.post('/api/tracker/remove', job)
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      })
  }

  function updateJob(job) {
    return $http.post('/api/tracker/update', job)
      .success(function(data) {
        return data;
      })
      .error(function(err) {
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
