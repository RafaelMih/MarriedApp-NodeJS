'use strict';

var contact = require('../../app/controllers/contacts.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/contact')
		.get(contact.list)
		.post(contact.create);

	app.route('/contact/:contactId')
		.get(contact.read)
		.delete(contact.delete);

	// Finish by binding the contact middleware
	app.param('contactId', contact.contactById);
};