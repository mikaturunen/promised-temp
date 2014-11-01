"use strict"

var chai  	= require("chai");
var expect  = chai.expect;
var temp 	= require("../lib/promised-temp");
var Q		= require("q");
var os		= require("os");
var path    = require("path");

/**
 * Simplified test suite for promised-temp module to test that it correctly calls the 
 * underlying temp module. Temp module has it's own tests suite to test the actual inner
 * workins, how it generates the temps and such inside it and these tests do not take any
 * part in that.
 */
describe("Promise wrapped temps", function() {
	"use strict"

	describe("Creates temporary path", function() {
		it("With specified prefix (string).", function(done) {
			var path = "foobar213";
			temp
				.open(path)
				.then(function(result) {
					expect(result.path).to.include(path);
					done();
				})
				.catch(function(error) {
					console.log("Error: " + error);
				})
				.done();
		});
		
		it("With specified prefix (Object).", function(done) {
			var path = "foobar321";
			temp
				.open({ prefix: path })
				.then(function(result) {
					expect(result.path).to.include(path);
					done();
				})
				.catch(function(error) {
					console.log("Error: " + error);
				})
				.done();
		});

		it("With specified suffix.", function(done) {
			var path = "foobar123";
			temp
				.open({ suffix: path })
				.then(function(result) {
					expect(result.path).to.include(path);
					done();
				})
				.catch(function(error) {
					console.log("Error: " + error);
				})
				.done();
		});

		it("With specified prefix and suffix.", function(done) {
			var path1 = "foobar123";
			var path2 = "foobar321";
			temp
				.open({ prefix: path1, suffix: path2 })
				.then(function(result) {
					expect(result.path).to.include(path1).and.to.include(path2);
					done();
				})
				.catch(function(error) {
					console.log("Error: " + error);
				})
				.done();
		});

		it("With specified prefix, suffix and dir.", function(done) {
			var path1 = "foobar123";
			var path2 = "foobar321";
			var path3 = path.join(os.tmpdir(), "321foobar");
			temp
				.open({ prefix: path1, suffix: path2, dir: path3 })
				.then(function(result) {
					expect(result.path)
						.to.include(path1)
						.and.to.include(path2)
						.and.to.include(path3);
					done();
				})
				.catch(function(error) {
					console.log("Error: " + error);
				})
				.done();
		});

		it("With specified dir.", function(done) {
			var path1 = path.join(os.tmpdir(), "321foobar");
			temp
				.open({ dir: path1 })
				.then(function(result) {
					expect(result.path).to.include(path1);
					done();
				})
				.catch(function(error) {
					console.log("Error: " + error);
				})
				.done();
		});
	});

	describe("Creates temporary directory", function() {

	});
});