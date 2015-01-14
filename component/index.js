'use strict';

"use strict";

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

function XHR() {
  if (window.XMLHttpRequest) return new XMLHttpRequest();
  try {
    return new ActiveXObject("msxml2.xmlhttp.6.0");
  } catch (e) {}
  try {
    return new ActiveXObject("msxml2.xmlhttp.3.0");
  } catch (e) {}
  try {
    return new ActiveXObject("msxml2.xmlhttp");
  } catch (e) {}
}

function contains(array, value) {
  var i = array.length;
  while (i--) if (array[i] === value) return true;
  return false;
}

var okStatus = [200, 304, 0];
function requestOk(req) {
  return contains(okStatus, req.status);
}

var XHRError = (function (Error) {
  function XHRError(message, status, request) {
    this.message = message;
    this.status = status;
    this.request = request;
  }

  _inherits(XHRError, Error);

  return XHRError;
})(Error);

function callbacks(name, req, targets) {
  for (var i = 0; i < targets.length; i++) {
    if (typeof targets[i][name] === "function") targets[i][name](req);
  }
}

function build(opts) {
  var Promise = opts.promise || opts.Promise || (window || {}).Promise || (global || {}).Promise;

  if (!Promise) throw new Error("I really need a Promise");

  function xhr(options) {
    var req = XHR();

    if (options.binary && !req.sendAsBinary) return Promise.reject(new Error("This browser does not support binary XHRs."));

    callbacks("onbegin", req, [opts, options]);

    if (typeof options === "string") options = { url: options };
    req.open(options.method || "GET", options, true);
    if (options.credentials) req.withCredentials = true;

    for (var k in options.headers) req.setRequestHeader(k, options.headers[k]);

    var res = new Promise(function (ok, fail) {
      req.onreadystatechange = function () {
        if (req.readyState !== 4) return;

        callbacks("onend", req, [opts, options]);

        if (requestOk(req)) {
          ok(req);
        } else {
          fail(new XHRError("Server responded with a status of " + req.status, req.status, req));
        }
      };
    });

    req[options.binary ? "sendAsBinary" : "send"](options.data || void 0);

    return res;
  }

  (function () {
    xhr.get = function get(url) {
      return xhr(url);
    };
    xhr.post = function post(url, data) {
      return xhr({ method: "POST", url: url, data: data });
    };
    xhr.put = function put(url, data) {
      return xhr({ method: "PUT", url: url, data: data });
    };
    xhr["delete"] = xhr.del = function del(url, data) {
      return xhr({ method: "DELETE", url: url, data: data });
    };
  })();

  (function () {
    var json = xhr.json = function json() {
      var options = arguments[0] === undefined ? {} : arguments[0];
      if (typeof options === "string") options = { url: options };
      var headers = options.headers = options.headers || {};
      headers.Accept = "application/json";
      return xhr(options).then(function (res) {
        return JSON.parse(res.responseText);
      });
    };
    json.get = function get(url) {
      return json({ url: url });
    };
    json.post = function post(url, data) {
      return json({ method: "POST", url: url, data: data });
    };
    json.put = function put(url, data) {
      return json({ method: "PUT", url: url, data: data });
    };
    json["delete"] = json.del = function del(url, data) {
      return json({ method: "DELETE", url: url, data: data });
    };
  })();

  return xhr;
}
//# sourceMappingURL=01-6to5-index.js.map

exports['default'] = build;
//# sourceMappingURL=./index.js.map