'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Token = mongoose.model('Token'),
	_ = require('lodash');

/**
 * Create a Token
 */
exports.create = function(req, res) {
	var token = new Token(req.body);
	token.user = req.user;

	token.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(token);
		}
	});
};

/**
 * Show the current Token
 */
exports.read = function(req, res) {
	res.jsonp(req.token);
};

/**
 * Update a Token
 */
exports.update = function(req, res) {
	var token = req.token ;

	token = _.extend(token , req.body);

	token.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(token);
		}
	});
};

/**
 * Delete an Token
 */
exports.delete = function(req, res) {
	var token = req.token ;

	token.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(token);
		}
	});
};

/**
 * List of Tokens
 */
exports.list = function(req, res) { 
	Token.find().sort('-created').populate('user', 'displayName').exec(function(err, tokens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tokens);
		}
	});
};

/**
 * Token middleware
 */
exports.tokenByID = function(req, res, next, id) { 
	Token.findById(id).populate('user', 'displayName').exec(function(err, token) {
		if (err) return next(err);
		if (! token) return next(new Error('Failed to load Token ' + id));
		req.token = token ;
		next();
	});
};

/**
 * Token authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
