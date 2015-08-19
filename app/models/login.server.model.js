'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	validator = require('validator'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

/*var validateLength = {
	phone : {
		min : 5,
		max : 100
	},
	projectId : {
		min : 64,
		max : 64
	}
};*/

var messages = {
	phone: 'Informe o telefone',
	projectId: 'Informe o projeto',
	hash: 'Informe o código de autenticação',
	ip: 'IP não informado',
	/*validate : {
		login: 'O login deve ter de '+ validateLength.login.min + ' à '+ validateLength.login.max + ' caracteres',
		password: 'A senha deve ter '+ validateLength.password.min + ' caracteres'
	}*/
};

/*var validateLocalStrategyLogin = function(property) {
	return validator.isLength(this.login, validateLength.login.min, validateLength.login.max);
};


var validateLocalStrategyPassword = function(property) {
	return validator.isLength(this.password, validateLength.password.min, validateLength.password.max);
};*/


/**
 * Login Schema
 */
var LoginSchema = new Schema({
	phone: {
		type: String,
		default: '',
		required: messages.phone,
		trim: true
	},
	projectId: {
		type: String,
		default: '',
		required: messages.projectId,
		trim: true
	},
	hash: {
		type: String,
		default: '',
		required: messages.hash,
		trim: true
	},
	ip :{
		type: String,
		default: '',
		required: messages.ip
	},
	created: {
		type: Date,
		default: Date.now
	}
});


/**
 * Hook a pre save method to hash the password
 */
LoginSchema.pre('save', function(next) {
	this.password = this.hashPassword(this.password);
	next();
});

/**
 * Create instance method for hashing a password
 */
LoginSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 4096, 32).toString('hex');
	} else {
		return password;
	}
};

mongoose.model('Login', LoginSchema);