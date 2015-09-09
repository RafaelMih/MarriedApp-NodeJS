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
		required: 'Informe o nome do projeto',
		trim: true
	},
	urlVideo: {
		type: String,
		default: '',
		trim: true
	},
	story: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	users : [ {type : mongoose.Schema.ObjectId, ref : 'Userapp'} ],
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



/**
 * Get UserApp by project
 */
ProjectSchema.statics.getUsers = function(projectId, callback) {
  this.model('Project')
  	.findOne({ projectId: projectId}, { 'users': 1 })
  	.exec(function(err, users) {
  		if (users){
			callback(err, users);
		}
	});
};

var ProjectModel = mongoose.model('Project', ProjectSchema);