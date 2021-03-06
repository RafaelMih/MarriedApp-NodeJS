'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
    errorHandler = require('../controllers/errors.server.controller'),
	Schema = mongoose.Schema;

/**
 * Token Schema
 */
var TokenSchema = new Schema({
	userId: {
		type: String,
		default: '',
		required: 'Informe o usuário'
	},
	projectId: {
		type: String,
		default: '',
		required: 'Informe o projeto'
	},
	created: {
		type: Date,
		default: Date.now
	},
	expires: {
		type: Date,
		default: Date.now,
		required: 'Data de expiração não informada'
	}
});

/**
 * Hook a pre save method to hash the password
 */
TokenSchema.pre('save', function(next) {
	if (this.created) {
		this.expires = moment(this.created).add(2, 'h');
	}

	next();
});


TokenSchema.statics.create = function(userAppId, projectId, callback) {
	var _this = this;

	var token = new this();
	_this.userAppId = userAppId;
	_this.projectId = projectId;

	_this.model('Token').save(function(err, tokenId) {
		callback(err, tokenId);
	});
};

TokenSchema.statics.getValidToken = function(req, res, callback) {
	var _this = this;
	var _authorization = req.headers.authorization;
	var _error = new Error();
	_error.stack = '';

	if (!_authorization){
		_error.message = 'Autorização não informada';
		callback(_error, null);
	}
	else{
		_this.model('Token')
	  	.findOne({_id: _authorization, expires : { $gt: new Date() }})
	  	.exec(function(err, token) {

	  		if (_authorization && !token){
	  			_error.message = 'Autorização inválida ou expirada';
			}

			if (!_error.message && !err){
		  		callback(null, token);
	  		}
	  		else{
				callback(_error || err, null);
			}
		});
  	}
};

mongoose.model('Token', TokenSchema);