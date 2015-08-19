'use strict';

module.exports = function(app) {
	var admins = require('../../app/controllers/admins.server.controller');

	// Admins Routes
	app.route('/admins')
		.get(admins.hasAuthorization(['admin']), admins.list)
		.post(admins.hasAuthorization(['admin']), admins.create);

	app.route('/admins/:adminId')
		.get(admins.hasAuthorization(['admin']), admins.read)
		.put(admins.hasAuthorization(['admin']), admins.update)
		.delete(admins.hasAuthorization(['admin']), admins.delete);

	// Setting up the users authentication api
	app.route('/auth/signin').post(admins.signin);
	app.route('/auth/signout').get(admins.signout);

	// Finish by binding the Admin middleware
	app.param('adminId', admins.adminByID);
};
