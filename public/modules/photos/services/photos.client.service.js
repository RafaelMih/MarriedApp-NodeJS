'use strict';

//Photos service used to communicate Photos REST endpoints
angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		
		var Photos = $resource('photos/:photoId', { photoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		Photos.getGalleries = function() { 
			return $resource('galleries/', { 
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

		Photos.getProjects = function() { 
			return $resource('projects/', { 
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

		return Photos;
	}
]);