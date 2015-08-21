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


TokenSchema.statics.create = function(token, next, callback) {
	token.save(function(err, tokenId) {
		callback(err, tokenId);
		next();
	});
};

mongoose.model('Token', TokenSchema);