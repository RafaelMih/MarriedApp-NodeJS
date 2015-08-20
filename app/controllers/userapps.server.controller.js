'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Userapp = mongoose.model('Userapp'),
	_ = require('lodash');

/**
 * Create a Userapp
 */
exports.create = function(req, res) {
	var userapp = new Userapp(req.body);
	userapp._creator = req.user;	

	userapp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userapp);
		}
	});
};

/**
 * Show the current Userapp
 */
exports.read = function(req, res) {
	res.jsonp(req.userapp);
};

/**
 * Update a Userapp
 */
exports.update = function(req, res) {
	var userapp = req.userapp ;

	userapp = _.extend(userapp , req.body);

	userapp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userapp);
		}
	});
};

/**
 * Delete an Userapp
 */
exports.delete = function(req, res) {
	var userapp = req.userapp ;

	userapp.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userapp);
		}
	});
};

/**
 * List of Userapps
 */
exports.list = function(req, res) { 
	Userapp.find().sort('-created')
	.populate('_creator', 'name')
	.exec(function(err, userapps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userapps);
		}
	});
};

/**
 * Userapp middleware
 */
exports.userappByID = function(req, res, next, id) { 
	Userapp.findById(id)
	.populate('_creator', 'name')
	.exec(function(err, userapp) {
		if (err) return next(err);
		if (! userapp) return next(new Error('Failed to load Userapp ' + id));
		req.userapp = userapp ;
		next();
	});
};

/**
 * Userapp authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
