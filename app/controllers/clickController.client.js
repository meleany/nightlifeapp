'use strict';

(function () {
  
  angular
    .module("nightapp", ["ngResource"])
    .controller("appController", ["$scope", "$resource", "$window", "$http", function ($scope, $resource, $window, $http){
      
      var searchYelp = $resource("/api/yelp/:place", {place: "@placename"});
      
      var loginCheck = $resource("/api/login");      
      loginCheck.get(function (res) {
        $scope.logged = res.logged;
        if($scope.logged) {
          $scope.loginName = res.userid.username;
          var venue = sessionStorage.getItem("venue");
          if(venue) {
            searchYelp.get({place: venue}, function (res) {
              $scope.locals = res.businesses;
              $scope.going = res.going;
            })          
          }
        } else {
          $scope.loginName = "guest";
        }
      });
      
      $scope.loading=false;  
      $scope.search = function () {
        if($scope.place) {
          $scope.loading=true;
          sessionStorage.setItem("venue", $scope.place);
          searchYelp.get({place: $scope.place}, function (res) {
            if(res) {
              $scope.loading = false;
              $scope.locals = res.businesses;
              $scope.going = res.going;
            } 
          });
        } else {
          alert("Please, enter where you want to go");
        }        
      };
      
      $scope.userUpdate = function (local, id, index) {
        if($scope.logged){
          $http.post("/api/update", {user:$scope.loginName, local: local, localID: id}).then(function successCallback(response) {
            $scope.going[index] = response.data.going; // this callback will be called asynchronously when the response is available          
          }, function errorCallback(response) {}); // called asynchronously if an error occurs or server returns response with an error status.
        }else{
          alert("Login first");
        }
      };
      
    }])
})();