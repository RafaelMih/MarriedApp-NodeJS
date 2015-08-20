'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
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
		required: 'Data de expiração não informada'
	}
});

/**
 * Save the token
 */
TokenSchema.method.create = function(token, callback) {
	
	token.expires = token.created.add('h', 2);
	
	this.model('Token').insert(token, function(err, tokenId){
  		console.log(tokenId);
    	callback(err, tokenId);
	});
};

mongoose.model('Token', TokenSchema);