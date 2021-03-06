"use strict";

var Q = require("q");
var temp = require ("temp");
var mkdir = require("mkdirp");

/**
 * Simple wrapper for resolving the deferred object in a controller manner.
 * On error we reject with 'error' object and other cases resolve with info.
 */
var deferredResolver = function(error, info, deferred) {
	if (error) {
		deferred.reject(error);
	} else {
		deferred.resolve(info);
	}
};

var resolveDirectories = function(affixes) {
	var deferred = Q.defer();

	if (affixes && affixes.dir !== undefined) {
		// if user provided the actual directory, we are going to make sure that the directory is present. For now, temp
		// module does not make sure.
		mkdir(affixes.dir, function(error) {
			if (error) {
				deferred.reject(error)
			} else {
				deferred.resolve();
			}
		});
	} else {
		// user did not specify any .dir on affixes or the affixes is undefined, we resolve the directory structure
		// to be intanct
		deferred.resolve();
	}

	return deferred.promise;
}

/**
 * Wrapper for the temp modules async functions that take in affixes and callback as a parameters.
 * @param tempFn {Function} Any async function from temp module.
 * @param affixes {Object} affixes JSON object from temp module async functions.
 * @returns {Q.Deferred} Deferred object from Q module. Resolves on success, rejects on error with error reason.
 */
var wrappedTempCaller = function(tempFn, affixes) {
	var deferred = Q.defer();

	// some of the temp modules functions 'throw' and we do not want the throw leaking out of promised-temp
	// module but instead reject the promise and give the error out that way
	try {
		if (affixes !== undefined) {
			// calling functions that use 'affixes' parameter

			// we have to make sure that the actual directory the user might have specified is present
			resolveDirectories(affixes).then(function() {
				// now that we know the possibly requested directories are present, we can go ahead and create the
				// temp files as per users request
				tempFn(affixes, function(error, info) {
					deferredResolver(error, info, deferred);
				});
			})
			.catch(function(error) {
				deferredResolver(error, undefined, deferred);
			})
			.done();

		} else {
			// calling functions that do not use 'affixes' parameter

			tempFn(function(error, info) {
				deferredResolver(error, info, deferred);
			});
		}
	} catch (error) {
		deferred.reject(error);
	}

	return deferred.promise;
};

/**
 * Module for promise wrapped temporary file, directory and stream creation. All asynchronous
 * functions returns a Q.Promise that resolves when no errors and rejects on error with error reason.
 */
var promisedTemp = {
	/**
	 * @Returns a uniquer dir name in temporary directory
	 */
	dir: temp.dir,

	/**
	 * @Returns a unique name in temporary directory
	 */
	path: temp.path,

	/**
	 * Creates a temporary writable Stream.
	 * @returns {Stream}
	 */
	createWriteStream: temp.createWriteStream,

	/**
	 * Call track to automatically cleanup all the temps created. Function can be chained with promise-temp require call.
	 * @param value {boolean} undefined/true for removing automatically and false for disabling automatic removal.
	 */
	track: function(value) {
		temp.track(value);
		// so we can chain it properly
		return module.exports;
	},

	/**
	 * Creates a temporary directory. With 'affixes' parameter certain details can be defined of the temp file.
	 * @param affixes {any} Can be string for prefix only and object with .prefix, .suffix, .dir for more complex use.
	 * @returns {Q.Promise} Promise. Resolves on clean success and rejects on errors.
	 */
	mkdir: function(affixes) {
		return wrappedTempCaller(temp.mkdir, affixes);
	},

	/**
	 * Creates a temporary file path. With 'affixes' parameter certain details can be defined of the temp file. If .dir
	 * is provided, creates the directory if it's not present.
	 * @param affixes {any} Can be string for prefix only and object with .prefix, .suffix, .dir for more complex use.
	 * @returns {Q.Promise} Promise. Resolves on clean success and rejects on errors.
	 */
	open: function(affixes) {
		return wrappedTempCaller(temp.open, affixes);
	},

	/**
	 * Manually cleans up the temps created.
	 * @returns {Q.Promise} Promise. Resolves on clean success and rejects on errors.
	 */
	cleanup: function() {
		return wrappedTempCaller(temp.cleanup);
	}
};

module.exports = promisedTemp;
