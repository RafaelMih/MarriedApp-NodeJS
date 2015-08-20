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

/**
 * Verify if exists
 */
ProjectSchema.statics.exists = function(projectId, callback) {
  this.model('Project')
  	.findOne({ _id: projectId }).count()
  	.exec(function(err, count) {		
		callback(err, count > 0);
	});
};

var ProjectModel = mongoose.model('Project', ProjectSchema);