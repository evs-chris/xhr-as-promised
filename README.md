# XHR As Promised

Yet another XMLHttpRequest wrapper that combines some of the very good but painfully tiny components (rangermauve/xhr, rangermauve/xhr-promise, yields/xhr, matthewp/xhrerror) into a single module for easier consumption. It also adds a convenience wrapper for doing JSON service calls.

## Where to get it?

XHR is available as a [giblet](https://github.com/evs-chris/xhr-as-promised), a [component](https://github.com/componentjs/component), and a pre-assembled UMD module.

All of the pre-built files live in tags on the build branch.

## Usage

XHR provides a library init function that you can supply options to get back an XHR factory function. Notably, if the environment you're using doesn't already supply a global Promise, you have to provide one.

#### `XHRAsPromised(options)`
This is the default export library init function. If is used to set up a request factory function.

##### `options`
* `promise` - the promise constructor to use. It is expected to supply at least a `Promise.reject` function and to turn out usable `then`ables. If none is provided, then the global Promise will be used. If no global can be found, an `Error` will be thrown.
* `onbegin(request)` - a callback function that will be called synchronously just before *any* request is opened
* `onend(request)` - a callback function that will be called synchronously just before *any* request promise is resolved, even if it is a failure

#### `xhr(options)`
This is the function that you will use to make actual requests. It takes an options object or a URL. It also has helper functions for simple requests and a helper object for simple JSON requests. This and all its direct helper functions return a Promise for a completed request.

##### `options`
*All of the options XMLHttpRequest supports*
* `url` - the URL to request
* `method` - the method to use - defaults to `GET`
* `headers` - object - header key/value pairs to set with `setRequestHeader`
* `onbegin(request)` - a callback function that will be called synchronously just before *this* request is opened
* `onend(request)` - a callback function that will be called synchronously just before *this* request promise is resolved, even if it is a failure
* `binary` - boolen - use `sendAsBinary` and if it's not available, return a rejected Promise

##### Helpers
* `xhr.get(url)`
* `xhr.post(url, data)`
* `xhr.put(url, data)`
* `xhr.delete(url, data)` - alias `xhr.del(url, data)` - thanks IE8

##### JSON Helpers
These functions all set the `Accept` header to `application/json` and return a Promise that resolves to the returned object.

* `xhr.json(options)` - JSON version of `xhr(options)`
* `xhr.json.get(url)`
* `xhr.json.post(url, data)`
* `xhr.json.put(url, data)`
* `xhr.json.delete(url, data)` - alias `xhr.json.del(url, data)`

## License
Copyright (c) 2014 Chris Reeves. Released under an [MIT license](https://github.com/evs-chris/xhr-as-promised/blob/master/LICENSE.md).

Probably (c) some others too (rangermauve, yields, matthewp).
