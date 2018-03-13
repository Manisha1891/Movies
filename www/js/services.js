var adminurl = "http://localhost:1337/api/";
angular.module('starter.services', [])

    .factory('CreateMovies', function ($http){
        return {
            getNavigation: function () {
                return navigation;
            },
            callApiMovies: function (url, data, callback) {
                $http.post(adminurl + url, data).then(function (data) {
console.log("services",data);
                    callback(data);
                });
            },


            apiCallWithoutData: function (url, callback) {
                
                $http.post(adminurl + url).then(function (data) {
                  if (data) {
                    data = data.data;
                    callback(data);
                  }
        
                
              });
        }
    };
    
    });