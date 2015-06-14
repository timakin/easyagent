'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var globalPlugins = [];

var fetch = window.fetch || function () {
  throw new ReferenceError('fetch is not defined');
};

var EasyAgent = (function () {
  function EasyAgent(url) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, EasyAgent);

    this.url = url;
    this.method = options.method || 'GET';
    this.queries = options.queries || {};
    this.headers = options.headers || {};
    this.body = options.body || null;
    this.plugins = options.plugins || globalPlugins;
  }

  _createClass(EasyAgent, [{
    key: 'setUrl',
    value: function setUrl(newUrl) {
      return new this.constructor(newUrl, this.options);
    }
  }, {
    key: 'setOptions',
    value: function setOptions(newOptions) {
      var options = _util2['default'].assign(this, newOptions);
      var Uppermethod = options.method.toUpperCase();
      var body = options.body;

      if (body !== null && (upperMethod === 'GET' || upperMethod === 'HEAD')) {
        throw new TypeError('Body not allowed for GET or HEAD requests');
      }

      return new this.constructor(this.url, newOptions);
    }
  }, {
    key: 'setMethod',
    value: function setMethod(method) {
      return this.setOptions({ method: method });
    }
  }, {
    key: 'setHeaders',
    value: function setHeaders(headers) {
      return this.setOptions({ headers: headers });
    }
  }, {
    key: 'setBody',
    value: function setBody(body) {
      return this.setOptions({ body: body });
    }
  }, {
    key: 'setJson',
    value: function setJson(json) {
      var jsonStr = JSON.stringify(json);

      return this.setOptions({
        body: jsonStr,
        headers: _util2['default'].assign(this.headers, {
          'Content-Type': 'application/json'
        })
      });
    }
  }, {
    key: 'setForm',
    value: function setForm(form) {
      return this.setOptions({
        body: form,
        headers: _util2['default'].assign(this.headers, {
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    }
  }, {
    key: 'setQueries',
    value: function setQueries(queries) {
      return this.setOptions({ queries: queries });
    }
  }, {
    key: 'use',
    value: function use(plugin) {
      return this.setOptions({ plugins: this.plugins.concat([plugin]) });
    }
  }, {
    key: 'fetchResponse',
    value: function fetchResponse() {
      var queryString = _util2['default'].queryString(this.queries);

      var f = fetch(this.url + queryString, {
        method: this.method,
        headers: this.hearders,
        body: this.body
      });

      if (this.plugins.length > 0) {
        f = this.plugins.reduce(function (__f, plugin) {
          return plugin(__f).call(__f);
        }, f);
      }

      return f;
    }
  }, {
    key: 'fetchJson',
    value: function fetchJson() {
      return this.setHeaders({ 'Accept': 'application/json' }).fetchResponse().then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'fetchText',
    value: function fetchText() {
      var mimeType = arguments[0] === undefined ? 'text/plain' : arguments[0];

      return this.setHeaders({ 'Accept': mimeType }).fetchResponse().then(function (res) {
        return res.text();
      });
    }
  }, {
    key: 'fetchHtml',
    value: function fetchHtml() {
      return this.fetchText('text/html');
    }
  }], [{
    key: 'get',
    value: function get(url, options) {
      return new this(url, _util2['default'].assign({ method: 'GET', body: null }, options));
    }
  }, {
    key: 'post',
    value: function post(url, options) {
      return new this(url, _util2['default'].assign({ method: 'POST', body: null }, options));
    }
  }, {
    key: 'put',
    value: function put(url, options) {
      return new this(url, _util2['default'].assign({ method: 'PUT', body: null }, options));
    }
  }, {
    key: 'del',
    value: function del(url, options) {
      return new this(url, _util2['default'].assign({ method: 'DELETE', body: null }, options));
    }
  }, {
    key: 'head',
    value: function head(url, options) {
      return new this(url, _util2['default'].assign({ method: 'HEAD', body: null }, options));
    }
  }, {
    key: 'opt',
    value: function opt(url, options) {
      return new this(url, _util2['default'].assign({ method: 'OPTIONS', body: null }, options));
    }
  }, {
    key: 'setFetchFunction',
    value: function setFetchFunction(anotherFetch) {
      fetch = anotherFetch;
    }
  }, {
    key: 'use',
    value: function use(plugin) {
      globalPlugins.push(plugin);
    }
  }, {
    key: 'unuse',
    value: function unuse(plugin) {
      var index = globalPlugins.indexOf(plugin);

      if (index < 0) return false;

      globalPlugins.splice(index, 1);
    }
  }, {
    key: 'unuseAll',
    value: function unuseAll() {
      globalPlugins.splice(0, globalPlugins.length);
    }
  }]);

  return EasyAgent;
})();

;

exports['default'] = EasyAgent;
module.exports = exports['default'];