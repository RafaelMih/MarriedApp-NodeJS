'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	validator = require('validator'),
	Schema = mongoose.Schema;

/**
 * E-mail validate
 */
var validateLocalStrategyEmail = function(property) {
	return validator.isEmail(this.email);
};

/**
 * Userapp Schema
 */
var UserappSchema = new Schema({	
	name: {
		type: String,
		trim: true,
		default: '',
		required: 'Informe o primeiro nome'
	},	
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyEmail, 'Email inválido'],
	},
	urlPhoto: {
		type: String,
		trim: true,
		default: ''
	},
	cellphone: {
		type: String,
		trim: true,
		default: '',
		unique: 'Número de celular já cadastrado',
		required: 'Infome o número do celular'
	},
	telephone: {
		type: String,
		trim: true,
		default: ''
	},
	active: {
		type: Boolean,
		default: true
	},
	isAdmin: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	_creator : {
		type : Schema.ObjectId, 
		ref : 'Admin'
	},
	_projects : [String]
});

/**
 * Verify if exists
 */
UserappSchema.statics.exists = function(cellphone, projectId, callback) {
  this.model('Userapp')
  	.find({ cellphone: cellphone, _projects: { $in: [projectId] }}).count()
  	.exec(function(err, count) {	
		callback(err, count > 0);
	});
};

/**
 * Verify if exists
 */
UserappSchema.statics.existsInProject = function(userId, projectId, callback) {
  this.model('Project')
  	.find({ _id: projectId, users: { $in: [userId] }}).count()
  	.exec(function(err, count) {	
		callback(err, count > 0);
	});
};

/**
 * Get UserApp by cellphone
 */
UserappSchema.statics.getByCellphone = function(cellphone, callback) {
  this.model('Userapp')
  	.findOne({ cellphone: cellphone}, { '_id': 1 })
  	.exec(function(err, userApp) {
  		if (userApp){
			callback(null, userApp._id);
		}else{
			callback(err, null);
		}
	});
};

/**
 * Get UserApp by token
 */
UserappSchema.statics.getByToken = function(token, callback){
	this.model('Userapp')
		.findById(token.userId, { _creator: 0, __v: 0})
		.exec(function(err, user){
			callback(err, user);
	});
};


mongoose.model('Userapp', UserappSchema);