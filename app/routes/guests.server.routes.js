'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var guests = require('../../app/controllers/guests.server.controller');

	// Guests Routes
	app.route('/guests')
		.get(guests.list)
		.post(users.requiresLogin, guests.create);

	app.route('/guests/:guestId')
		.get(guests.read)
		.put(users.requiresLogin, guests.hasAuthorization, guests.update)
		.delete(users.requiresLogin, guests.hasAuthorization, guests.delete);

	// Finish by binding the Guest middleware
	app.param('guestId', guests.guestByID);
};
