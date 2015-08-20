'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contact = mongoose.model('Contact'),	
	_ = require('lodash');


var messages = {
	error : {

	},
	success:{
		create : 'Contato cadastrado com sucessso!',
		delete: 'Contato apagado com sucesso!'
	}
};

/**
 * Create a Contact
 */
exports.create = function(req, res) {
	var contact = new Contact(req.body);
	contact.ip = req.connection.remoteAddress;

	contact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(messages.success.create);
		}
	});
};


/**
 * Show the current contact
 */
exports.read = function(req, res) {
	res.json(req.contact);
};

/**
 * Delete a Contact
 */
exports.delete = function(req, res) {

	var contact = req.contact;

	contact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.send(messages.success.delete);
		}
	});
};

/**
 * List of Contacts
 */
exports.list = function(req, res) {
	Contact.find().sort('-created').exec(function(err, contacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(contacts);
		}
	});
};

/**
 * Contact middleware
 */
exports.contactById = function(req, res, next, id) {
	Contact.findById(id).exec(function(err, contact) {
		if (err) return next(err);
		if (!contact) return next(new Error('Contato não encontrado ' + id));
		req.contact = contact;
		next();
	});
};