'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Testimony Schema
 */
var TestimonySchema = new Schema({
	message: {
		type: String,
		default: '',
		required: 'Informe a mensagem depoimento',
	},
	created: {
		type: Date,
		default: Date.now
	},
	guest: {
		type: Schema.ObjectId,
		ref: 'Guest'
	},
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	}
});

mongoose.model('Testimony', TestimonySchema);