'use strict';

(function() {
	// Userapps Controller Spec
	describe('Userapps Controller Tests', function() {
		// Initialize global variables
		var UserappsController,
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

			// Initialize the Userapps controller.
			UserappsController = $controller('UserappsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Userapp object fetched from XHR', inject(function(Userapps) {
			// Create sample Userapp using the Userapps service
			var sampleUserapp = new Userapps({
				name: 'New Userapp'
			});

			// Create a sample Userapps array that includes the new Userapp
			var sampleUserapps = [sampleUserapp];

			// Set GET response
			$httpBackend.expectGET('userapps').respond(sampleUserapps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userapps).toEqualData(sampleUserapps);
		}));

		it('$scope.findOne() should create an array with one Userapp object fetched from XHR using a userappId URL parameter', inject(function(Userapps) {
			// Define a sample Userapp object
			var sampleUserapp = new Userapps({
				name: 'New Userapp'
			});

			// Set the URL parameter
			$stateParams.userappId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/userapps\/([0-9a-fA-F]{24})$/).respond(sampleUserapp);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userapp).toEqualData(sampleUserapp);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Userapps) {
			// Create a sample Userapp object
			var sampleUserappPostData = new Userapps({
				name: 'New Userapp'
			});

			// Create a sample Userapp response
			var sampleUserappResponse = new Userapps({
				_id: '525cf20451979dea2c000001',
				name: 'New Userapp'
			});

			// Fixture mock form input values
			scope.name = 'New Userapp';

			// Set POST response
			$httpBackend.expectPOST('userapps', sampleUserappPostData).respond(sampleUserappResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Userapp was created
			expect($location.path()).toBe('/userapps/' + sampleUserappResponse._id);
		}));

		it('$scope.update() should update a valid Userapp', inject(function(Userapps) {
			// Define a sample Userapp put data
			var sampleUserappPutData = new Userapps({
				_id: '525cf20451979dea2c000001',
				name: 'New Userapp'
			});

			// Mock Userapp in scope
			scope.userapp = sampleUserappPutData;

			// Set PUT response
			$httpBackend.expectPUT(/userapps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/userapps/' + sampleUserappPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userappId and remove the Userapp from the scope', inject(function(Userapps) {
			// Create new Userapp object
			var sampleUserapp = new Userapps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Userapps array and include the Userapp
			scope.userapps = [sampleUserapp];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/userapps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserapp);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userapps.length).toBe(0);
		}));
	});
}());