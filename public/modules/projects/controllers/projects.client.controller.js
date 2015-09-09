'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects',
	function($scope, $stateParams, $location, Authentication, Projects) {
		$scope.authentication = Authentication;

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
				name: this.name,
				story: this.story,
				urlVideo: this.urlVideo
			});

			for(var key in this.usersAdm) {
    			var value = this.usersAdm[key];

    			if (value){
    				project.users.push(key);
    			}
			}

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			for(var key in project.usersAdm) {
    			var value = project.usersAdm[key];

    			if (value && project.users.indexOf(key) === -1){
    				project.users.push(key);
    			}else{
    				project.users.splice(project.users.indexOf(key), 1);
    			}
			}

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};

		// Find existing Photo
		$scope.initCreate = function() {
   			$scope.users = Projects.getUsers().query();
		};

		$scope.initEdit = function(){
			$scope.initCreate();
			$scope.findOne();
			$scope.projectUsers = Projects.getProjectUsers().get({ 
				projectUserId: $stateParams.projectId
			});
		};
	}
]);