'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mapper = require('../mappers/login.server.mapper.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Admin = mongoose.model('Admin');


var messages = {
	error : {
		AdminNotSignedIn : 'Usuário não informado',
		AdminNotLoad : 'Usuário não encontrado'
	}
};

/**
 * Create a Admin
 */
exports.create = function(req, res) {
	var admin = new Admin(req.body);
	admin._creator = req.user.id;

	admin.save(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Show the current Admin
 */
exports.read = function(req, res) {
	res.jsonp(req.admin);
};



/**
 * Delete an Admin
 */
exports.delete = function(req, res) {
	var admin = req.admin ;

	admin.remove(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * List of Admins
 */
exports.list = function(req, res) { 
	Admin.find()
	.sort('-created')
	.populate('_creator', 'name')
	.exec(function(err, admins) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(admins);
		}
	});
};

/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) { 
	Admin.findById(id)
	.populate('_creator', 'name')
	.exec(function(err, admin) {
		if (err) return next(err);
		if (! admin) return next(new Error('Failed to load Admin ' + id));
		req.admin = admin ;
		next();
	});
};

/**
 * Update admin details
 */
exports.update = function(req, res) {
	// Init Variables
	var admin = req.admin;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (admin) {
		// Merge existing admin
		admin = _.extend(admin, req.body);
		admin.updated = Date.now();

		admin.save(function(err) {
			if (err) {
				errorHandler.getError(res, err);
			} else {
				req.login(admin, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(admin);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: messages.error.AdminNotSignedIn
		});
	}
};

exports.all = function (req, res) {
	Admin.find().sort('-created').exec(function(err, admins) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.json(admins);
		}
	});
};

/**
 * Send Admin
 */
exports.me = function(req, res) {
	res.json(req.admin || null);
};

/**
 * Get Admin by Login
 */
exports.getAdminByLogin = function(res, login, next){
	Admin.findOne({
		$or: [
        	{ 'email' : login.login },
        	{ 'adminname' : login.login }
        ],
		password: login.password
	}).exec(function(err, admin) {		
		if (err) return next(errorHandler.getError(res, err));
		if (!admin) return res.status(400).send({message: messages.error.AdminNotLoad});
		return res.json(admin);
	});
};