'use strict';

module.exports = function(app) {
	var admins = require('../../app/controllers/admins.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(admins.hasAuthorization(['admin']), projects.list)
		.post(admins.hasAuthorization(['admin']), projects.create);

	// Projects Routes
	app.route('/projectUsers/:projectUserId')
		.get(admins.hasAuthorization(['admin']), projects.users);

	app.route('/projects/:projectId')
		.get(admins.hasAuthorization(['admin']), projects.read)
		.put(admins.hasAuthorization(['admin']), projects.update)
		.delete(admins.hasAuthorization(['admin']), projects.delete);

	app.route('/story')
		.get(projects.getStory)
		.put(projects.setStory);

	app.route('/video')
		.get(projects.getVideo)
		.put(projects.setVideo);

	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
	app.param('projectUserId', projects.users);
};
