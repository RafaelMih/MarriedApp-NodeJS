'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var userapps = require('../../app/controllers/userapps.server.controller');

	// Userapps Routes
	app.route('/userapps')
		.get(userapps.list)
		.post(users.requiresLogin, userapps.create);

	app.route('/userapps/:userappId')
		.get(userapps.read)
		.put(users.requiresLogin, userapps.hasAuthorization, userapps.update)
		.delete(users.requiresLogin, userapps.hasAuthorization, userapps.delete);

	// Finish by binding the Userapp middleware
	app.param('userappId', userapps.userappByID);
};
