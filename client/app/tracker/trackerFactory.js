angular.module('myApp.TrackerFactory', [])

.factory('TrackerFactory', function($http) {

  function getJobs() {
    return $http.get('api/tracker')
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      })
  }

  return {
    getJobs: getJobs
  }
})
