'use strict';

// Configuring the Articles module
angular.module('photos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fotos', 'photos', 'dropdown', '/photos(/create)?');
		Menus.addSubMenuItem('topbar', 'photos', 'Lista de Fotos', 'photos');
		Menus.addSubMenuItem('topbar', 'photos', 'Nova foto', 'photos/create');
	}
]);