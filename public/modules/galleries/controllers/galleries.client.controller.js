'use strict';

// Galleries controller
angular.module('galleries').controller('GalleriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Galleries',
	function($scope, $stateParams, $location, Authentication, Galleries) {
		$scope.authentication = Authentication;

		// Create new Gallery
		$scope.create = function() {
			// Create new Gallery object
			var gallery = new Galleries ({
				name: this.name
			});

			// Redirect after save
			gallery.$save(function(response) {
				$location.path('galleries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gallery
		$scope.remove = function(gallery) {
			if ( gallery ) { 
				gallery.$remove();

				for (var i in $scope.galleries) {
					if ($scope.galleries [i] === gallery) {
						$scope.galleries.splice(i, 1);
					}
				}
			} else {
				$scope.gallery.$remove(function() {
					$location.path('galleries');
				});
			}
		};

		// Update existing Gallery
		$scope.update = function() {
			var gallery = $scope.gallery;

			gallery.$update(function() {
				$location.path('galleries/' + gallery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Galleries
		$scope.find = function() {
			$scope.galleries = Galleries.query();
		};

		// Find existing Gallery
		$scope.findOne = function() {
			$scope.gallery = Galleries.get({ 
				galleryId: $stateParams.galleryId
			});
		};
	}
]);