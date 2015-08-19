'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Photos', 'Galleries', 'Projects',
	function($scope, $stateParams, $location, Authentication, Photos, Galleries, Projects) {

		$scope.authentication = Authentication;

		// Create new Photo
		$scope.create = function() {
			// Create new Photo object
			var photo = new Photos ({
				name: this.name,
				gallery : this.gallery,
				project : this.project
			});

			// Redirect after save
			photo.$save(function(response) {
				$location.path('photos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Photo
		$scope.remove = function(photo) {
			if ( photo ) { 
				photo.$remove();

				for (var i in $scope.photos) {
					if ($scope.photos [i] === photo) {
						$scope.photos.splice(i, 1);
					}
				}
			} else {
				$scope.photo.$remove(function() {
					$location.path('photos');
				});
			}
		};

		// Update existing Photo
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Photos
		$scope.find = function() {
			$scope.photos = Photos.query();			
		};

		// Find existing Photo
		$scope.findOne = function() {
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			});
		};

		// Find existing Photo
		$scope.initCreate = function() {
			$scope.galleries = Galleries.get();
			$scope.projects = Projects.get();
			console.log('==='+$scope.projects);
		};

		$scope.initEdit = function(){
			$scope.getGalleries();
			$scope.findOne();
		};
	}
]);