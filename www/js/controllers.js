angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $state, $http, CreateMovies, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.addMovieData = {};
    $scope.submitForm = function (data) {
      $state.reload();
      console.log(data);
      CreateMovies.callApiMovies("MovieRating/save", data, function (saveddata) {
        console.log("saved data", saveddata);
        if (saveddata.data.value == true) {
          $state.go("app.lists");
        }
      });
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/addMovie.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeAddMovie = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.addMovie = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doAddMovie = function () {
      console.log('Adding Movie', $scope.addMovieData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeAddMovie();
      }, 1000);
      window.location.reload();
    };
  })

  .controller('ListsCtrl', function ($scope, $http, CreateMovies, $timeout, $state) {
   
    CreateMovies.apiCallWithoutData("MovieRating/displayList", function (data) {
      console.log("ssssssssssssssssss", data);
      //console.log("ssssssssssssssssss", data.data[0].name);
     
// var rate1=data.data;
// var rate2=data.data.length;
// console.log('helooooo',rate2);
// console.log('helooooo',rate1[0]);


//       $scope.ratings2 = [{
//         current:rate1,
//         max: 5
//       }];
//       console.log('ooooooooooooooo',rate1.rating);

      $scope.lists = data.data;
     
      $scope.View = function (data) {
        console.log(data);
        CreateMovies.callApiMovies("MovieRating/getone", data, function (saveddata) {
          if (saveddata.data.value == true) {
            $state.go("app.single", {
              listId: saveddata.data.data._id
            });
           
          }
          console.log("saved data", saveddata);
        });

      };


    });
  })

  .controller('ListCtrl', function ($scope, CreateMovies, $stateParams) {
    console.log($stateParams.listId);
    data = $stateParams.listId;
    // $scope.rating1 = 0;

    CreateMovies.callApiMovies("MovieRating/getone", {
      _id: data
    }, function (saveddata) {
      console.log(saveddata);
      $scope.movies = saveddata.data.data;
      console.log("fghfjfdhjj", $scope.movies);
      $scope.ratings1 = [{
        current: $scope.movies.rating,
        max: 5
      }];
    }
    );

  })


  .controller('StarCtrl', ['$scope', '$http', 'CreateMovies', '$timeout', function ($scope, $http, CreateMovies, $timeout) {
    $scope.rating = 0;
    $scope.ratings = [{
      current:1,
      max: 5
    }];

    $scope.getSelectedRating = function (rating, list) {
      console.log(rating);
      console.log($scope.ratings);
      list.rating = rating;
      CreateMovies.callApiMovies("MovieRating/save", list, function (saveddata) {
        console.log("saved data", saveddata);
      });
      
      // $scope.ratings1 = [{
      // current: list.rating,
      //  max: 5
      //  }];

    };
  }])

  .directive('starRating', function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        onRatingSelected: '&'
      },
      link: function (scope, elem, attrs) {

        var updateStars = function () {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };

        scope.toggle = function (index) {
          scope.ratingValue = index + 1;
          scope.onRatingSelected({
            rating: index + 1
          });
        };

        scope.$watch('ratingValue', function (oldVal, newVal) {
          if (newVal) {
            updateStars();
          }
        });
      }
    };
  });
