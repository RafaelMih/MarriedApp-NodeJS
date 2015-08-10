'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Gallery = mongoose.model('Gallery'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gallery;

/**
 * Gallery routes tests
 */
describe('Gallery CRUD tests', function() {
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

		// Save a user to the test db and create new Gallery
		user.save(function() {
			gallery = {
				name: 'Gallery Name'
			};

			done();
		});
	});

	it('should be able to save Gallery instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gallery
				agent.post('/galleries')
					.send(gallery)
					.expect(200)
					.end(function(gallerySaveErr, gallerySaveRes) {
						// Handle Gallery save error
						if (gallerySaveErr) done(gallerySaveErr);

						// Get a list of Galleries
						agent.get('/galleries')
							.end(function(galleriesGetErr, galleriesGetRes) {
								// Handle Gallery save error
								if (galleriesGetErr) done(galleriesGetErr);

								// Get Galleries list
								var galleries = galleriesGetRes.body;

								// Set assertions
								(galleries[0].user._id).should.equal(userId);
								(galleries[0].name).should.match('Gallery Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gallery instance if not logged in', function(done) {
		agent.post('/galleries')
			.send(gallery)
			.expect(401)
			.end(function(gallerySaveErr, gallerySaveRes) {
				// Call the assertion callback
				done(gallerySaveErr);
			});
	});

	it('should not be able to save Gallery instance if no name is provided', function(done) {
		// Invalidate name field
		gallery.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gallery
				agent.post('/galleries')
					.send(gallery)
					.expect(400)
					.end(function(gallerySaveErr, gallerySaveRes) {
						// Set message assertion
						(gallerySaveRes.body.message).should.match('Please fill Gallery name');
						
						// Handle Gallery save error
						done(gallerySaveErr);
					});
			});
	});

	it('should be able to update Gallery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gallery
				agent.post('/galleries')
					.send(gallery)
					.expect(200)
					.end(function(gallerySaveErr, gallerySaveRes) {
						// Handle Gallery save error
						if (gallerySaveErr) done(gallerySaveErr);

						// Update Gallery name
						gallery.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gallery
						agent.put('/galleries/' + gallerySaveRes.body._id)
							.send(gallery)
							.expect(200)
							.end(function(galleryUpdateErr, galleryUpdateRes) {
								// Handle Gallery update error
								if (galleryUpdateErr) done(galleryUpdateErr);

								// Set assertions
								(galleryUpdateRes.body._id).should.equal(gallerySaveRes.body._id);
								(galleryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Galleries if not signed in', function(done) {
		// Create new Gallery model instance
		var galleryObj = new Gallery(gallery);

		// Save the Gallery
		galleryObj.save(function() {
			// Request Galleries
			request(app).get('/galleries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gallery if not signed in', function(done) {
		// Create new Gallery model instance
		var galleryObj = new Gallery(gallery);

		// Save the Gallery
		galleryObj.save(function() {
			request(app).get('/galleries/' + galleryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gallery.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gallery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gallery
				agent.post('/galleries')
					.send(gallery)
					.expect(200)
					.end(function(gallerySaveErr, gallerySaveRes) {
						// Handle Gallery save error
						if (gallerySaveErr) done(gallerySaveErr);

						// Delete existing Gallery
						agent.delete('/galleries/' + gallerySaveRes.body._id)
							.send(gallery)
							.expect(200)
							.end(function(galleryDeleteErr, galleryDeleteRes) {
								// Handle Gallery error error
								if (galleryDeleteErr) done(galleryDeleteErr);

								// Set assertions
								(galleryDeleteRes.body._id).should.equal(gallerySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gallery instance if not signed in', function(done) {
		// Set Gallery user 
		gallery.user = user;

		// Create new Gallery model instance
		var galleryObj = new Gallery(gallery);

		// Save the Gallery
		galleryObj.save(function() {
			// Try deleting Gallery
			request(app).delete('/galleries/' + galleryObj._id)
			.expect(401)
			.end(function(galleryDeleteErr, galleryDeleteRes) {
				// Set message assertion
				(galleryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gallery error error
				done(galleryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Gallery.remove().exec();
		done();
	});
});