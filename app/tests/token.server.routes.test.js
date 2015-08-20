'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Token = mongoose.model('Token'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, token;

/**
 * Token routes tests
 */
describe('Token CRUD tests', function() {
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

		// Save a user to the test db and create new Token
		user.save(function() {
			token = {
				name: 'Token Name'
			};

			done();
		});
	});

	it('should be able to save Token instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Token
				agent.post('/tokens')
					.send(token)
					.expect(200)
					.end(function(tokenSaveErr, tokenSaveRes) {
						// Handle Token save error
						if (tokenSaveErr) done(tokenSaveErr);

						// Get a list of Tokens
						agent.get('/tokens')
							.end(function(tokensGetErr, tokensGetRes) {
								// Handle Token save error
								if (tokensGetErr) done(tokensGetErr);

								// Get Tokens list
								var tokens = tokensGetRes.body;

								// Set assertions
								(tokens[0].user._id).should.equal(userId);
								(tokens[0].name).should.match('Token Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Token instance if not logged in', function(done) {
		agent.post('/tokens')
			.send(token)
			.expect(401)
			.end(function(tokenSaveErr, tokenSaveRes) {
				// Call the assertion callback
				done(tokenSaveErr);
			});
	});

	it('should not be able to save Token instance if no name is provided', function(done) {
		// Invalidate name field
		token.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Token
				agent.post('/tokens')
					.send(token)
					.expect(400)
					.end(function(tokenSaveErr, tokenSaveRes) {
						// Set message assertion
						(tokenSaveRes.body.message).should.match('Please fill Token name');
						
						// Handle Token save error
						done(tokenSaveErr);
					});
			});
	});

	it('should be able to update Token instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Token
				agent.post('/tokens')
					.send(token)
					.expect(200)
					.end(function(tokenSaveErr, tokenSaveRes) {
						// Handle Token save error
						if (tokenSaveErr) done(tokenSaveErr);

						// Update Token name
						token.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Token
						agent.put('/tokens/' + tokenSaveRes.body._id)
							.send(token)
							.expect(200)
							.end(function(tokenUpdateErr, tokenUpdateRes) {
								// Handle Token update error
								if (tokenUpdateErr) done(tokenUpdateErr);

								// Set assertions
								(tokenUpdateRes.body._id).should.equal(tokenSaveRes.body._id);
								(tokenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tokens if not signed in', function(done) {
		// Create new Token model instance
		var tokenObj = new Token(token);

		// Save the Token
		tokenObj.save(function() {
			// Request Tokens
			request(app).get('/tokens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Token if not signed in', function(done) {
		// Create new Token model instance
		var tokenObj = new Token(token);

		// Save the Token
		tokenObj.save(function() {
			request(app).get('/tokens/' + tokenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', token.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Token instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Token
				agent.post('/tokens')
					.send(token)
					.expect(200)
					.end(function(tokenSaveErr, tokenSaveRes) {
						// Handle Token save error
						if (tokenSaveErr) done(tokenSaveErr);

						// Delete existing Token
						agent.delete('/tokens/' + tokenSaveRes.body._id)
							.send(token)
							.expect(200)
							.end(function(tokenDeleteErr, tokenDeleteRes) {
								// Handle Token error error
								if (tokenDeleteErr) done(tokenDeleteErr);

								// Set assertions
								(tokenDeleteRes.body._id).should.equal(tokenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Token instance if not signed in', function(done) {
		// Set Token user 
		token.user = user;

		// Create new Token model instance
		var tokenObj = new Token(token);

		// Save the Token
		tokenObj.save(function() {
			// Try deleting Token
			request(app).delete('/tokens/' + tokenObj._id)
			.expect(401)
			.end(function(tokenDeleteErr, tokenDeleteRes) {
				// Set message assertion
				(tokenDeleteRes.body.message).should.match('User is not logged in');

				// Handle Token error error
				done(tokenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Token.remove().exec();
		done();
	});
});