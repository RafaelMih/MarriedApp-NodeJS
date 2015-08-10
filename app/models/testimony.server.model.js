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
	name: {
		type: String,
		default: '',
		required: 'Please fill Testimony name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Testimony', TestimonySchema);