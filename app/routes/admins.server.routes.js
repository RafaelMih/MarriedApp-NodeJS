'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admins = require('../../app/controllers/admins.server.controller');

	// Admins Routes
	app.route('/admins')
		.get(users.requiresLogin, admins.hasAuthorization(['admin']), admins.list)
		.post(users.requiresLogin, admins.hasAuthorization(['admin']), admins.create);

	app.route('/admins/:adminId')
		.get(users.requiresLogin, admins.hasAuthorization(['admin']), admins.read)
		.put(users.requiresLogin, admins.hasAuthorization(['admin']), admins.update)
		.delete(users.requiresLogin, admins.hasAuthorization(['admin']), admins.delete);

	// Finish by binding the Admin middleware
	app.param('adminId', admins.adminByID);
};
