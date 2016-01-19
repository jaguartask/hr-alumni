angular.module('myApp', [
  'ui.router',
  'myApp.MessageBoardService',
  'myApp.messageBoard',
  'myApp.post',
  'myApp.tracker',
  'myApp.TrackerFactory',
  'angularMoment'
])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url:'/home',
      templateUrl: 'app/views/home.html',
      data: {
        requiresLogin: false
      }
    })
    .state('profiles', {
      url: '/profiles',
      templateUrl: 'app/views/profiles.html',
      data: {
        requiresLogin: true
      }

    })
    .state('Hire', {
      url: '/Hire',
      templateUrl: 'app/views/Hire.html',
      data: {
        requiresLogin: true
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'app/views/about.html',
      data: {
        requiresLogin: false
      }
    })
    // .state('createProfile', {
    //   url: '/createProfile',
    //   templateUrl: 'app/views/createProfile.html'
    // })
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      data: {
        requiresLogin: false
      }
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'app/views/login.html',
      data: {
        requiresLogin: false
      },
      controller: function($rootScope, $http, $state) {
        $rootScope.isLoggedIn = function() { return false; };
        $http.get('/auth/logout');
        $state.go('home');
      }
    })
    .state('profile', {
      url: '/profile/{githubName}',
      templateUrl: 'app/views/profile.html',
      data: {
        requiresLogin: true
      }
    })
    .state('updateProfile', {
      url: '/updateProfile/:githubName',
      templateUrl: 'app/views/updateProfile.html',
      data: {
        requiresLogin: true
      }
    })
    .state('messageBoard', {
      url: '/messages',
      templateUrl: 'app/messageBoard/messages.html',
      data: {
        requiresLogin: true
      }
    })
    .state('post', {
      url: '/post/{id}',
      templateUrl: 'app/messageBoard/post.html',
      data: {
        requiresLogin: true
      }
    })
    .state('membership', {
      url: '/membership',
      templateUrl: 'app/views/membership.html',
      data: {
        requiresLogin: false
      }
    });
}])

.run(function($rootScope, $state, Auth){
    $rootScope.$on('$stateChangeStart', function(e, to) {
      if (to.data && to.data.requiresLogin) {
        
        Auth.getUser().success(function(data){
          if(data.length === 0) {
            $rootScope.isLoggedIn = function(){return false;};
            //e.preventDefault();
            $state.go('login');
          }
          $rootScope.isLoggedIn = function(){return true;};
        });
      }
    });
})

.controller('homeCtrl', ['$scope','$state', function ($scope, $state) {

  $state.transitionTo('profiles');

}])

.controller('profileCtrl', ['$scope', 'HttpRequest', '$stateParams', function ($scope, HttpRequest,$stateParams) {
  //console.log('controller gets called');
  HttpRequest.getProfile($stateParams.githubName)
    .success(function(data) {
      //console.log('Profile = ', data);
      $scope.currentProfile = data[0];
    });
}])

.controller('profilesCtrl', ['$scope', '$http', 'HttpRequest', 'Profile', function ($scope, $http, HttpRequest, Profile) {

  HttpRequest.getProfiles()
    .then(function (res) {
      $scope.profiles= res.data;
      $scope.setProfile= function (profile) {
        console.log('set profile called');
        $scope.currentProfile= Profile.setProfile(profile);
        console.log('currentProfile', $scope.currentProfile);
      }
    });

    // used for showing the modal in profiles.html
    $scope.modalDetails = function(profile){
        console.log(profile);
        $scope.profile = profile;
        $('#modalDetails').openModal();


    };

}])

// .controller('createProfileCtrl', ['$scope', 'HttpRequest', function ($scope, HttpRequest){
//   $scope.submitProfile = function (isValid, formData) {
//     console.log(formData);
//     console.log('First isValid: ', isValid);
//     // HttpRequest.submitProfile(isValid, formData);
//   }
// }])

.controller('updateProfileCtrl', ['$scope', '$stateParams','HttpRequest', '$rootScope', function ($scope, $stateParams, HttpRequest, $rootScope){
  console.log('$stateParams are: ', $stateParams);
  $rootScope.isLoggeIn = function(){return true;};
  // redirects to /updateProfile/:githubName
  // $scope.submitProfile = function (isValid, formData) {
  //       console.log('formData', formData);
  //       console.log('First isValid: ', isValid);
  //       // HttpRequest.submitProfile(isValid, formData);
  // }

  $scope.submitProfile = function (isValid, formData) {

        console.log('formData', $scope.data);
        // console.log('First isValid: ', isValid);
        HttpRequest.submitProfile(isValid, formData);
  }

  //prepopulation of data
  HttpRequest.getProfile($stateParams.githubName)
    .then(function (res) {
      $scope.data= res.data;
      console.log('profile data: ', res.data[0]);
      console.log('contact data: ', res.data[0].contact);
      // $scope.setProfile= function (profile) {
      //   console.log('set profile called');
      //   $scope.currentProfile= Profile.setProfile(profile);
      //   console.log('currentProfile', $scope.currentProfile);
      // }


    })

}])

.controller('loginCtrl', ['$scope', 'HttpRequest', function ($scope, HttpRequest) {
  $scope.login= function (){
    HttpRequest.login()
      .then(
        function (res) {
          console.log('res to login', res);
        },
        function (err) {
          console.log('there was an error');
        }
      )
  }
}])

.factory('HttpRequest', ['$http', '$q', function ($http, $q){
  var deferred= $q.defer();
  var submitProfile = function (isValid, data) {
      console.log('Second isValid: ', isValid);
    if (isValid) {
        console.log('data does it get here>=? ', data);
        return $http({
            method: 'POST',
            url: '/api/updateProfile',
            data: data
        })
    } else {

    }
  };

  var getProfiles= function () {
    return $http({
      method: 'GET',
      url: '/api/profiles'
    }).success(function(result){
      deferred.resolve(result);
    }).error(function (result){
      deferred.reject(result);
    })
  }

  var getProfile= function (githubName){
    return $http({
      method: 'GET',
      url: '/api/profile/'+githubName
    }).success(function(result){
      // console.log('Get profile res: ', result);
      // deferred.resolve(result);
      return result;
    }).error(function (err){
      // console.log('Get profile err: ', result);
      // deferred.reject(result);
      return err;
    })
  }

  return {
    submitProfile: submitProfile,
    getProfiles: getProfiles,
    getProfile: getProfile
  }
}])

.factory('Profile', function (){
  var storedProfile;
  var setProfile= function (profile) {
    console.log('profile set');
    storedProfile= profile;
    return storedProfile;
  }
  var getProfile= function (){
    console.log('get profile');
    return storedProfile;
  }
  return {
    setProfile: setProfile,
    getProfile: getProfile
  }
})

.factory('Auth', ['$http', function($http) {
  var getUser = function() {
    return $http.get('/auth/currentuser').
      then(function (data) {
          if(data.length === 0) {
            //console.log('not logged in');
            return [];
          }
          else {
            //console.log('logged in: ', data);
            return data;
          }
      }).
      then(null, function () {
          console.log('Login failed');
      });
  };
  return {
    getUser: getUser,
    //isLoggedIn: isLoggedIn
  };
}]);
