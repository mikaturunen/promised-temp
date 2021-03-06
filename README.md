promised-temp
=============

Tool for making temporary files asynchronously. Great when you need to stream files to harddrive temporarily. Promised-temp can be told to
clean the created temporary (random) files or directories when needed.

Internally uses the excellent node-temp library (https://github.com/bruce/node-temp). Unfortunately as functional as the original library was, it was lacking in modern functionality and so promised-temp came about. The module fully uses all the async functions of the temp module and does not even reveal the sync methods. Only async ones with promises. All the methods that are async return a promise for the programmer to wait for resolving or rejecting.

## Installing
You can get promised-temp from NPM by writing:

    npm install promised-temp --save

Automatically fethces the latest version, saves it to your package.json ans it's ready for use.

## How to use
There is a minor key difference to the original node-temp and that is that none of the functions throw errors, they all return a promise and they either resolve on success or reject on error and the node-temp throw error is rejected out for the user to handle. Also the .open call creates a new directory if the affixes.dir is used. Commonly the idea with the node-temp was the first create the dir with mkdir and then call the open with affixes.dir but here you can just provide the affixes.dir for the .open function and if the dir is not present, it will be creted as it's opened.

### Affixes parameter
All the functions that take in parameters take in the affixes as the first parameter. Affixes can be either a string (which is internally resolved to affixes.prefix) or an object containing the following properties: prefix, suffix and dir.

    Example type:
    affixes {
        prefix: string;
        suffix: string;
        dir: string;
    };

    Example use:
    var affixes = {
        prefix: "foobar",
        suffix: ".zip",
        dir: "tempfoo"
    };

This generates a temporary file in the system common tmp directory with added temp directory name containing tempfoo word and a a file with name that contains foobar as the prefix and .zip as the suffix. For example a file name can be something along these lines: '/tmp/tempfoo-fase223/114103-7648-kpv2q1.zip'. This is extremely useful when creating random files on hdd that will be deleted either manually after they've been processed or automatically by the system.

## .open(affixes), returns: Q.Promise

    // I generally prefer the maintain a strict rule of order by following with the .catch, .done blocks to make sure 
    // that none of the actual expection get eaten by accident.
    
    var temp = require("promised-temp").track();
    temp
        .open("/tmp/foo/bar")
        // use case with affixes: .open({ prefix: "/tmp/foo/bar", prefix: ".zip", dir: "somewhere" })
        .then(function(result) {
            // do something with the result
        })
        .catch(function(error) {
            // do something with the error case
        })
        .done();

## .mkdir(affixes), returns: Q.Promise
Creates a temporary directory with the provided prefix.

    var temp = require("promised-temp").track();
    temp
        .mkdir("/tmp/foo/bar")
        .then(function(result) {
            // do something with the result
        })
        .catch(function(error) {
            // do something with the error case
        })
        .done();

## .track(Boolean), returns: Q.Promise
Starts tracking for created tmp directories and files. When files are tracked, they can be removed by the .cleanup call or automatically
on exit.

    var temp = require("promised-temp");
    temp.track();
    // commonly it's chained with the actual temp lib call as follows. require("promised-temp").track();

## .cleanup(), returns: Q.Promise
Manually performs a cleanup of created directories and files. Please note that if .track has not been called, an error will be returned with the information explaining that tracking was not on (does not know what files to remove as the created temp files/directories are randomly generated).

    var temp = require("promised-temp");
    temp.track();
    temp
        .cleanup()
        .then(function(result) {
            // do something with the result
        })
        .catch(function(error) {
            // do something with the error case
        })
        .done();

## Pull Requests
Please, do submit PR's as the need rises and use the issue tracker for bugs and issues in the library. Thanks!