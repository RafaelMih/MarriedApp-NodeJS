'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),	
	_ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);

	project.save(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
	var project = req.project ;

	project = _.extend(project , req.body);

	project.save(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;

	project.remove(function(err) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) { 
	Project.find().sort('-created')
	.populate('users', 'displayName')
	.exec(function(err, projects) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(projects);
		}
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { 
	Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
		if (err) return next(err);
		if (! project) return next(new Error('Failed to load Project ' + id));
		req.project = project ;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {	
	next();
};
