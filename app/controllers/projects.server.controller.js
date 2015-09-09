'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	Token = mongoose.model('Token'),
	Qs = require('querystring'),
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
 * List of Projects
 */
exports.users = function(req, res, next, id) { 
	Project.findById(id, { users : true})
	.exec(function(err, projects) {
		if (err) {
			errorHandler.getError(res, err);
		} else {
			res.jsonp(projects.users);
		}
	});
};


/**
 * Get story of project
 */
exports.getStory = function(req, res){
	Token.getValidToken(req, res, function(err, token){

		if (err){
			errorHandler.getError(res, err);
		}
		else {
			Project.findById(token.projectId, { story: 1})
			.exec(function(err, project) {
				if (err) {
					errorHandler.getError(res, err);
				} else {
					return res.status(200).send({
						story: project.story
					});
				}
			});
		}
	});
};


/**
 * Get story of project
 */
exports.getVideo = function(req, res){
	Token.getValidToken(req, res, function(err, token){
		if (err){
			errorHandler.getError(res, err);
		}
		else {
			Project.findById(token.projectId, { urlVideo: 1})
			.exec(function(err, project) {
				if (err) {
					errorHandler.getError(res, err);
				} else {
					return res.status(200).send({
						urlVideo: project.urlVideo,
						videoId: project.urlVideo.split('v=').pop()
					});
				}
			});
		}
	});
};


/**
 * Set story of project
 */
exports.setStory = function(req, res){
	Token.getValidToken(req, res, function(err, token){
		if (err){
			errorHandler.getError(res, err);
		}
		else {

			var story = req.body.story;

			if (story) {
				Project.findByIdAndUpdate(token.projectId, { story: story })
				.exec(function(err, project) {
					if (err) {
						errorHandler.getError(res, err);
					} else {
						return res.status(200).send({
							story: project.story
						});
					}
				});
			}
			else
			errorHandler.setError(res, 'História não informada');
		}
	});
};


/**
 * Set story of project
 */
exports.setVideo = function(req, res){
	Token.getValidToken(req, res, function(err, token){
		if (err){
			errorHandler.getError(res, err);
		}
		else {

			var urlVideo = req.body.urlVideo;			

			if (urlVideo) {

				urlVideo = urlVideo.replace('https', 'http');

				Project.findByIdAndUpdate(token.projectId, { urlVideo: urlVideo })
				.exec(function(err, project) {
					if (err) {
						errorHandler.getError(res, err);
					} else {
						return res.status(200).send({
							urlVideo: project.urlVideo
						});
					}
				});
			}
			else
			errorHandler.setError(res, 'Url do vídeo não informado');
		}
	});
};











/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { 
	Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
		if (err) errorHandler.getError(res, err);
		if (! project) errorHandler.setError(res, 'Projeto não encontrado');
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
