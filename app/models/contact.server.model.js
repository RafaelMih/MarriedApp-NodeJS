'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	validator = require('validator'),
	Schema = mongoose.Schema;


var validateLength = {
	name : {
		min: 6,
		max : 300
	},
	message : {
		min : 10,
		max : 500
	}
};

var messages = {
	required : {
		name : 'Informe seu nome.',
		email : 'Informe seu e-mail.',
		message : 'Informe a mensagem.'
	},
	validate : {
		'name':'O nome deve conter de '+ validateLength.name.min + ' `a '+ validateLength.name.max + ' caracteres.',
		'message':'A mensagem deve conter de '+ validateLength.message.min + ' `a '+ validateLength.message.max + ' caracteres.',
		'email':'Informe um e-mail válido.'		
	}
};

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyName = function(property) {
	return (this.name && validator.isLength(this.name, validateLength.name.min, validateLength.name.max));
};

var validateLocalStrategyMessage = function(property) {
	return (this.message && validator.isLength(this.message, validateLength.message.min, validateLength.message.max));
};

var validateLocalStrategyEmail = function(property) {
	return (this.email && validator.isEmail(this.email));
};

/**
 * Contact Schema
 */
var ContactSchema = new Schema({	
	name: {
		type: String,
		default: '',
		trim: true,
		required: messages.required.name,
		validate: [validateLocalStrategyName, messages.validate.name]
	},
	email: {
		type: String,
		default: '',
		trim: true,
		required: messages.required.email,
		match: [/.+\@.+\..+/, messages.validate.email],
		validate: [validateLocalStrategyEmail, messages.validate.email]
	},
	telephone: {
		type: String,
		default: '',
		trim: true
	},
	message: {
		type: String,
		default: '',
		trim: true,
		required : messages.required.message,
		validate: [validateLocalStrategyMessage, messages.validate.message]
	},
	ip: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});


mongoose.model('Contact', ContactSchema);