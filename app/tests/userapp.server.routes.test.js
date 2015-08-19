'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Userapp = mongoose.model('Userapp'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, userapp;

/**
 * Userapp routes tests
 */
describe('Userapp CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Userapp
		user.save(function() {
			userapp = {
				name: 'Userapp Name'
			};

			done();
		});
	});

	it('should be able to save Userapp instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Userapp
				agent.post('/userapps')
					.send(userapp)
					.expect(200)
					.end(function(userappSaveErr, userappSaveRes) {
						// Handle Userapp save error
						if (userappSaveErr) done(userappSaveErr);

						// Get a list of Userapps
						agent.get('/userapps')
							.end(function(userappsGetErr, userappsGetRes) {
								// Handle Userapp save error
								if (userappsGetErr) done(userappsGetErr);

								// Get Userapps list
								var userapps = userappsGetRes.body;

								// Set assertions
								(userapps[0].user._id).should.equal(userId);
								(userapps[0].name).should.match('Userapp Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Userapp instance if not logged in', function(done) {
		agent.post('/userapps')
			.send(userapp)
			.expect(401)
			.end(function(userappSaveErr, userappSaveRes) {
				// Call the assertion callback
				done(userappSaveErr);
			});
	});

	it('should not be able to save Userapp instance if no name is provided', function(done) {
		// Invalidate name field
		userapp.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Userapp
				agent.post('/userapps')
					.send(userapp)
					.expect(400)
					.end(function(userappSaveErr, userappSaveRes) {
						// Set message assertion
						(userappSaveRes.body.message).should.match('Please fill Userapp name');
						
						// Handle Userapp save error
						done(userappSaveErr);
					});
			});
	});

	it('should be able to update Userapp instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Userapp
				agent.post('/userapps')
					.send(userapp)
					.expect(200)
					.end(function(userappSaveErr, userappSaveRes) {
						// Handle Userapp save error
						if (userappSaveErr) done(userappSaveErr);

						// Update Userapp name
						userapp.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Userapp
						agent.put('/userapps/' + userappSaveRes.body._id)
							.send(userapp)
							.expect(200)
							.end(function(userappUpdateErr, userappUpdateRes) {
								// Handle Userapp update error
								if (userappUpdateErr) done(userappUpdateErr);

								// Set assertions
								(userappUpdateRes.body._id).should.equal(userappSaveRes.body._id);
								(userappUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Userapps if not signed in', function(done) {
		// Create new Userapp model instance
		var userappObj = new Userapp(userapp);

		// Save the Userapp
		userappObj.save(function() {
			// Request Userapps
			request(app).get('/userapps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Userapp if not signed in', function(done) {
		// Create new Userapp model instance
		var userappObj = new Userapp(userapp);

		// Save the Userapp
		userappObj.save(function() {
			request(app).get('/userapps/' + userappObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', userapp.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Userapp instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Userapp
				agent.post('/userapps')
					.send(userapp)
					.expect(200)
					.end(function(userappSaveErr, userappSaveRes) {
						// Handle Userapp save error
						if (userappSaveErr) done(userappSaveErr);

						// Delete existing Userapp
						agent.delete('/userapps/' + userappSaveRes.body._id)
							.send(userapp)
							.expect(200)
							.end(function(userappDeleteErr, userappDeleteRes) {
								// Handle Userapp error error
								if (userappDeleteErr) done(userappDeleteErr);

								// Set assertions
								(userappDeleteRes.body._id).should.equal(userappSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Userapp instance if not signed in', function(done) {
		// Set Userapp user 
		userapp.user = user;

		// Create new Userapp model instance
		var userappObj = new Userapp(userapp);

		// Save the Userapp
		userappObj.save(function() {
			// Try deleting Userapp
			request(app).delete('/userapps/' + userappObj._id)
			.expect(401)
			.end(function(userappDeleteErr, userappDeleteRes) {
				// Set message assertion
				(userappDeleteRes.body.message).should.match('User is not logged in');

				// Handle Userapp error error
				done(userappDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Userapp.remove().exec();
		done();
	});
});