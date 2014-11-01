promised-temp
=============

Tool for making temporary files asynchronously. Wraps node-temp module with Q.Promises.

Internally uses the excellent node-temp library (https://github.com/bruce/node-temp). Unfortunately as functional as the library is, it was lacking in modern functionality and so promised-temp came about. The module fully uses all the async functions of the temp module and does not even reveal the sync methods. Only async ones with promises. All the methods that are async return a promise for the programmer to wait for resolving or rejecting.

