'use strict';

//Photos service used to communicate Photos REST endpoints
angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		return $resource('photos/:photoId', { photoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Get Gallery domain
angular.module('photos').factory('Galleries', ['$resource',
	function($resource) {
		return $resource('galleries/', { 
		}, {
			'query': {
			    method: 'GET',
			    isArray: false
			},
			'get': {
			    method: 'GET',
			    isArray: true
			}
		});
	}
]);

//Get Project domain
angular.module('photos').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/', { 
		}, {
			'query': {
			    method: 'GET',
			    isArray: false
			},
			'get': {
			    method: 'GET',
			    isArray: true
			}
		});
	}
]);