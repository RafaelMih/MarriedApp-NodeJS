'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gallery Schema
 */
var GallerySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gallery name',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	active: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Gallery', GallerySchema);