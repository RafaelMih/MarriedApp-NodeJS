'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var galleries = require('../../app/controllers/galleries.server.controller');

	// Galleries Routes
	app.route('/galleries')
		.get(galleries.list)
		.post(users.requiresLogin, galleries.create);

	app.route('/galleries/:galleryId')
		.get(galleries.read)
		.put(users.requiresLogin, galleries.hasAuthorization, galleries.update)
		.delete(users.requiresLogin, galleries.hasAuthorization, galleries.delete);

	// Finish by binding the Gallery middleware
	app.param('galleryId', galleries.galleryByID);
};
