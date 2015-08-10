'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var testimonies = require('../../app/controllers/testimonies.server.controller');

	// Testimonies Routes
	app.route('/testimonies')
		.get(testimonies.list)
		.post(users.requiresLogin, testimonies.create);

	app.route('/testimonies/:testimonyId')
		.get(testimonies.read)
		.put(users.requiresLogin, testimonies.hasAuthorization, testimonies.update)
		.delete(users.requiresLogin, testimonies.hasAuthorization, testimonies.delete);

	// Finish by binding the Testimony middleware
	app.param('testimonyId', testimonies.testimonyByID);
};
