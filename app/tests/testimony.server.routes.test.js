'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Testimony = mongoose.model('Testimony'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, testimony;

/**
 * Testimony routes tests
 */
describe('Testimony CRUD tests', function() {
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

		// Save a user to the test db and create new Testimony
		user.save(function() {
			testimony = {
				name: 'Testimony Name'
			};

			done();
		});
	});

	it('should be able to save Testimony instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimony
				agent.post('/testimonies')
					.send(testimony)
					.expect(200)
					.end(function(testimonySaveErr, testimonySaveRes) {
						// Handle Testimony save error
						if (testimonySaveErr) done(testimonySaveErr);

						// Get a list of Testimonies
						agent.get('/testimonies')
							.end(function(testimoniesGetErr, testimoniesGetRes) {
								// Handle Testimony save error
								if (testimoniesGetErr) done(testimoniesGetErr);

								// Get Testimonies list
								var testimonies = testimoniesGetRes.body;

								// Set assertions
								(testimonies[0].user._id).should.equal(userId);
								(testimonies[0].name).should.match('Testimony Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Testimony instance if not logged in', function(done) {
		agent.post('/testimonies')
			.send(testimony)
			.expect(401)
			.end(function(testimonySaveErr, testimonySaveRes) {
				// Call the assertion callback
				done(testimonySaveErr);
			});
	});

	it('should not be able to save Testimony instance if no name is provided', function(done) {
		// Invalidate name field
		testimony.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimony
				agent.post('/testimonies')
					.send(testimony)
					.expect(400)
					.end(function(testimonySaveErr, testimonySaveRes) {
						// Set message assertion
						(testimonySaveRes.body.message).should.match('Please fill Testimony name');
						
						// Handle Testimony save error
						done(testimonySaveErr);
					});
			});
	});

	it('should be able to update Testimony instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimony
				agent.post('/testimonies')
					.send(testimony)
					.expect(200)
					.end(function(testimonySaveErr, testimonySaveRes) {
						// Handle Testimony save error
						if (testimonySaveErr) done(testimonySaveErr);

						// Update Testimony name
						testimony.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Testimony
						agent.put('/testimonies/' + testimonySaveRes.body._id)
							.send(testimony)
							.expect(200)
							.end(function(testimonyUpdateErr, testimonyUpdateRes) {
								// Handle Testimony update error
								if (testimonyUpdateErr) done(testimonyUpdateErr);

								// Set assertions
								(testimonyUpdateRes.body._id).should.equal(testimonySaveRes.body._id);
								(testimonyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Testimonies if not signed in', function(done) {
		// Create new Testimony model instance
		var testimonyObj = new Testimony(testimony);

		// Save the Testimony
		testimonyObj.save(function() {
			// Request Testimonies
			request(app).get('/testimonies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Testimony if not signed in', function(done) {
		// Create new Testimony model instance
		var testimonyObj = new Testimony(testimony);

		// Save the Testimony
		testimonyObj.save(function() {
			request(app).get('/testimonies/' + testimonyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', testimony.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Testimony instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Testimony
				agent.post('/testimonies')
					.send(testimony)
					.expect(200)
					.end(function(testimonySaveErr, testimonySaveRes) {
						// Handle Testimony save error
						if (testimonySaveErr) done(testimonySaveErr);

						// Delete existing Testimony
						agent.delete('/testimonies/' + testimonySaveRes.body._id)
							.send(testimony)
							.expect(200)
							.end(function(testimonyDeleteErr, testimonyDeleteRes) {
								// Handle Testimony error error
								if (testimonyDeleteErr) done(testimonyDeleteErr);

								// Set assertions
								(testimonyDeleteRes.body._id).should.equal(testimonySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Testimony instance if not signed in', function(done) {
		// Set Testimony user 
		testimony.user = user;

		// Create new Testimony model instance
		var testimonyObj = new Testimony(testimony);

		// Save the Testimony
		testimonyObj.save(function() {
			// Try deleting Testimony
			request(app).delete('/testimonies/' + testimonyObj._id)
			.expect(401)
			.end(function(testimonyDeleteErr, testimonyDeleteRes) {
				// Set message assertion
				(testimonyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Testimony error error
				done(testimonyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Testimony.remove().exec();
		done();
	});
});