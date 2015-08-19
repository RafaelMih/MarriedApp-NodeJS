'use strict';

// Configuring the Articles module
angular.module('galleries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Galerias', 'galleries', 'dropdown', '/galleries(/create)?');
		Menus.addSubMenuItem('topbar', 'galleries', 'Lista de galeria', 'galleries');
		Menus.addSubMenuItem('topbar', 'galleries', 'Nova galeria', 'galleries/create');
	}
]);