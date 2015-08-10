'use strict';

//Galleries service used to communicate Galleries REST endpoints
angular.module('galleries').factory('Galleries', ['$resource',
	function($resource) {
		return $resource('galleries/:galleryId', { galleryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);