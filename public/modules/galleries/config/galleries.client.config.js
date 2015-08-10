'use strict';

// Configuring the Articles module
angular.module('galleries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Galerias', 'galleries', 'dropdown', '/galleries(/create)?');
		Menus.addSubMenuItem('topbar', 'galleries', 'Lista de Galerias', 'galleries');
		Menus.addSubMenuItem('topbar', 'galleries', 'Nova Galeria', 'galleries/create');
	}
]);