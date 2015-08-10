'use strict';

(function() {
	// Testimonies Controller Spec
	describe('Testimonies Controller Tests', function() {
		// Initialize global variables
		var TestimoniesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Testimonies controller.
			TestimoniesController = $controller('TestimoniesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Testimony object fetched from XHR', inject(function(Testimonies) {
			// Create sample Testimony using the Testimonies service
			var sampleTestimony = new Testimonies({
				name: 'New Testimony'
			});

			// Create a sample Testimonies array that includes the new Testimony
			var sampleTestimonies = [sampleTestimony];

			// Set GET response
			$httpBackend.expectGET('testimonies').respond(sampleTestimonies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.testimonies).toEqualData(sampleTestimonies);
		}));

		it('$scope.findOne() should create an array with one Testimony object fetched from XHR using a testimonyId URL parameter', inject(function(Testimonies) {
			// Define a sample Testimony object
			var sampleTestimony = new Testimonies({
				name: 'New Testimony'
			});

			// Set the URL parameter
			$stateParams.testimonyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/testimonies\/([0-9a-fA-F]{24})$/).respond(sampleTestimony);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.testimony).toEqualData(sampleTestimony);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Testimonies) {
			// Create a sample Testimony object
			var sampleTestimonyPostData = new Testimonies({
				name: 'New Testimony'
			});

			// Create a sample Testimony response
			var sampleTestimonyResponse = new Testimonies({
				_id: '525cf20451979dea2c000001',
				name: 'New Testimony'
			});

			// Fixture mock form input values
			scope.name = 'New Testimony';

			// Set POST response
			$httpBackend.expectPOST('testimonies', sampleTestimonyPostData).respond(sampleTestimonyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Testimony was created
			expect($location.path()).toBe('/testimonies/' + sampleTestimonyResponse._id);
		}));

		it('$scope.update() should update a valid Testimony', inject(function(Testimonies) {
			// Define a sample Testimony put data
			var sampleTestimonyPutData = new Testimonies({
				_id: '525cf20451979dea2c000001',
				name: 'New Testimony'
			});

			// Mock Testimony in scope
			scope.testimony = sampleTestimonyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/testimonies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/testimonies/' + sampleTestimonyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid testimonyId and remove the Testimony from the scope', inject(function(Testimonies) {
			// Create new Testimony object
			var sampleTestimony = new Testimonies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Testimonies array and include the Testimony
			scope.testimonies = [sampleTestimony];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/testimonies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTestimony);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.testimonies.length).toBe(0);
		}));
	});
}());