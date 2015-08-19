'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	users : [ {type : mongoose.Schema.ObjectId, ref : 'User'} ],
	guests : [ {type : mongoose.Schema.ObjectId, ref : 'Guest'} ],
	events : [ {type : mongoose.Schema.ObjectId, ref : 'Event'} ],
	photos : [ {type : mongoose.Schema.ObjectId, ref : 'Photo'} ],
	testimonies : [ {type : mongoose.Schema.ObjectId, ref : 'Testimony'} ],
});

mongoose.model('Project', ProjectSchema);