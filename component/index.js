'use strict';

"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var index = build;
/* global XMLHttpRequest, ActiveXObject, window, global */

function XHR() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }try {
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
  while (i--) if (array[i] === value) {
    return true;
  }return false;
}

var okStatus = [200, 304, 0];
function requestOk(req) {
  return contains(okStatus, req.status);
}

var XHRError = (function (Error) {
  function XHRError(message, status, request) {
    _classCallCheck(this, XHRError);

    this.message = message;
    this.status = status;
    this.request = request;
    this.responseHeaders = request.responseHeaders;
  }

  _inherits(XHRError, Error);

  return XHRError;
})(Error);

function callbacks(name, req, targets) {
  for (var i = 0; i < targets.length; i++) {
    if (typeof targets[i][name] === "function") targets[i][name](req);
  }
}

function merge() {
  var res = {},
      arg,
      k;
  for (var i = 0; i < arguments.length; i++) {
    arg = arguments[i];
    if (typeof arg === "object") {
      for (k in arg) {
        res[k] = arg[k];
      }
    }
  }
  return res;
}

var betweenQueryAndHash = /\?[^#]*#/;
var afterQuery = /\?.*/;function build(opts) {
  var Promise = opts.promise || opts.Promise || (window || {}).Promise || (global || {}).Promise;

  if (!Promise) throw new Error("I really need a Promise");

  function xhr() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    var req = XHR();

    options.headers = options.headers || {};

    if (options.binary && !req.sendAsBinary) {
      return Promise.reject(new Error("This browser does not support binary XHRs."));
    }callbacks("onbegin", req, [opts, options]);

    if (typeof options === "string") options = { url: options };

    if (options.query && typeof options.query === "object") {
      var qs = "";
      for (var k in options.query) {
        var v = options.query[k];
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          qs += (qs ? "&" : "") + ("" + encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }

      var hash = options.url.indexOf("#") !== -1,
          query = options.url.indexOf("?") !== -1;

      if (hash && query) {
        options.url = options.url.replace(betweenQueryAndHash, "?" + qs + "#");
      } else if (hash) {
        options.url = options.url.replace("#", "?" + qs + "#");
      } else if (query) {
        options.url = options.url.replace(afterQuery, "?" + qs);
      } else {
        options.url += "?" + qs;
      }
    }

    req.open(options.method || "GET", options.url, true);
    if (options.credentials) req.withCredentials = true;

    for (var k in options.headers) {
      req.setRequestHeader(k, options.headers[k]);
    }if (options.method === "POST" && (!("Content-Type" in options.headers) && !("type" in options))) {
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else if ("type" in options) {
      req.setRequestHeader("Content-Type", options.type);
    }

    if ("responseType" in options) req.responseType = options.responseType;

    var res = new Promise(function (ok, fail) {
      req.onreadystatechange = function () {
        if (req.readyState !== 4) return;

        callbacks("onend", req, [opts, options]);

        if (requestOk(req)) {
          ok(req);
        } else {
          var _res = req.responseHeaders = {};
          if (typeof req.getAllResponseHeaders === "function") {
            var headers = req.getAllResponseHeaders().split("\n");
            for (var i = 0; i < headers.length; i++) {
              var n = headers[i].substr(0, headers[i].indexOf(":"));
              if (!n) continue;
              var v = headers[i].substr(n.length + 1);
              _res[n] = v;
              _res[n.toLowerCase()] = v;
            }
          }
          fail(new XHRError("Server responded with a status of " + req.status, req.status, req));
        }
      };
    });

    req[options.binary ? "sendAsBinary" : "send"](options.data || void 0);

    return res;
  }

  (function () {
    xhr.get = function get(url, opts) {
      return xhr(merge({ url: url }, opts));
    };
    xhr.post = function post(url, data, opts) {
      return xhr(merge({ method: "POST", url: url, data: data }, opts));
    };
    xhr.put = function put(url, data, opts) {
      return xhr(merge({ method: "PUT", url: url, data: data }, opts));
    };
    xhr["delete"] = xhr.del = function del(url, data, opts) {
      return xhr(merge({ method: "DELETE", url: url, data: data }, opts));
    };
  })();

  (function () {
    var json = xhr.json = function json() {
      var options = arguments[0] === undefined ? {} : arguments[0];
      if (typeof options === "string") options = { url: options };
      var headers = options.headers = options.headers || {};
      if (!("Accept" in headers)) headers.Accept = "application/json,*/*";
      if (!("Content-Type" in headers) && !("type" in options)) headers["Content-Type"] = "application/json";
      if (typeof options.data !== "string") options.data = JSON.stringify(options.data || "");
      return xhr(options).then(function (res) {
        if ((res.getResponseHeader("Content-Type") || "").toLowerCase().indexOf("json") !== -1) {
          return JSON.parse(res.responseText);
        } else return res;
      });
    };
    json.get = function get(url, opts) {
      return json(merge({ url: url }, opts));
    };
    json.post = function post(url, data, opts) {
      return json(merge({ method: "POST", url: url, data: data }, opts));
    };
    json.put = function put(url, data, opts) {
      return json(merge({ method: "PUT", url: url, data: data }, opts));
    };
    json["delete"] = json.del = function del(url, data, opts) {
      return json(merge({ method: "DELETE", url: url, data: data }, opts));
    };
  })();

  return xhr;
}

exports['default'] = index;
//# sourceMappingURL=index.js.map
