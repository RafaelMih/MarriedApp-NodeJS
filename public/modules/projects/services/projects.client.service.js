'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		var Projects = $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		Projects.getUsers = function() { 
			return $resource('userapps/', { 
			}, {
			'query': {
			    method: 'GET',
			    isArray: true
			},
			'get': {
			    method: 'GET',
			    isArray: true
			}
			});
		};

		Projects.getProjectUsers = function() { 
			return $resource('projectUsers/:projectUserId', { projectUserId: '@_id'
			}, {
			'query': {
			    method: 'GET',
			    isArray: true
			},
			'get': {
			    method: 'GET',
			    isArray: true
			}
			});
		};

		return Projects;
	}
]);