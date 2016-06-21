'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('babel-polyfill');

var _immutable = require('immutable');

var _eventemitter = require('eventemitter2');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var __plugins = {};

function _parse(str) {
  var numVal = parseInt(str);

  return numVal >= 0 || numVal < 0 ? numVal : str;
};

function matchKeys(routeKey, eventKey) {
  var src = "\\b" + routeKey + "\\b";

  return new RegExp(src).test(eventKey);
};

function getMatchingRouteKeys(eventKey, routes) {
  var eventKeyArray = eventKey.split('/');
  var isBasePath = eventKeyArray[1] && !eventKeyArray[1].length;

  if (isBasePath) return eventKey;

  return Object.keys(routes).reduce(function (curr, routeKey) {
    var routeKeyArray = routeKey.split('/');

    for (var i in routeKeyArray) {
      var isKeyMatch = matchKeys(routeKeyArray[i], eventKeyArray[i]);
      var isParamMatch = routeKeyArray[i][0] == ':' && eventKeyArray[i];
      var isKeyMissing = !eventKeyArray[i] && !routeKeyArray[i];

      var isNotMatch = !isKeyMatch && !isParamMatch && !isKeyMissing;

      if (isNotMatch) return curr;
    };

    return [].concat(_toConsumableArray(curr), [routeKey]);
  }, []);
};

function mapRouteKeysToHandler(routeKeys, routes) {
  return routeKeys.reduce(function (curr, k) {
    return curr.concat(routes[k]);
  }, []);
};

function routesByType(type) {
  return __plugins[type].routes;
};

function routeKeyToParamsArray(routeKey) {
  return routeKey.split('/').map(function (k) {
    return k[0] === ':' ? k.substr(1) : false;
  });
};

function getParams(eventKey, routeKeys) {
  var eventKeyArray = eventKey.split('/');

  return routeKeys.reduce(function (curr, routeKey) {
    var params = routeKeyToParamsArray(routeKey).reduce(function (curr, param, i) {
      if (!param) return curr;

      var val = _parse(eventKeyArray[i]);

      return _extends({}, curr, _defineProperty({}, param, val));
    }, {});

    return _extends({}, curr, params);
  }, {});
};

var Router = function (_EventEmitter) {
  _inherits(Router, _EventEmitter);

  function Router(_ref) {
    var _ref$store = _ref.store;
    var store = _ref$store === undefined ? {} : _ref$store;
    var plugins = _ref.plugins;

    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this));

    _this.state = (0, _immutable.fromJS)(store);
    _this.registerPlugins(plugins);
    return _this;
  }

  _createClass(Router, [{
    key: 'registerPlugins',
    value: function registerPlugins(plugins) {
      for (var name in plugins) {
        if (!__plugins[name]) {
          var register = plugins[name].register;


          register && register(this);
        };
      };

      __plugins = _extends({}, __plugins, plugins);

      return __plugins;
    }
  }, {
    key: 'registerStore',
    value: function registerStore(store) {
      this.state = this.state.mergeDeep(store);

      return this.state;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(cb) {
      var _this2 = this;

      this.on('commit', cb);

      return function (_) {
        return _this2.off('commit', cb);
      };
    }
  }, {
    key: 'route',
    value: function route(e) {
      var handle = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
          var i = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
          var output;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  output = typeof handler[i] === 'function' ? handler[i](state.toJS(), ctx) : {};

                  // resolve ouput if it returns a promise

                  if (!(output && output.then)) {
                    _context.next = 7;
                    break;
                  }

                  _context.next = 4;
                  return output;

                case 4:
                  _context.t0 = _context.sent;
                  _context.next = 8;
                  break;

                case 7:
                  _context.t0 = output;

                case 8:
                  output = _context.t0;


                  state = state.merge(output);

                  if (i + 1 < handler.length) {
                    requestAnimationFrame(handle.bind(this, e, i + 1));
                  } else {
                    this.state = state;

                    this.emit('commit', this.state);
                  };

                case 12:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function handle(_x, _x2) {
          return ref.apply(this, arguments);
        };
      }();

      this.emit('route', e);

      var routes = routesByType(e.type);
      var routeKeys = getMatchingRouteKeys(e.key, routes);
      var handler = mapRouteKeysToHandler(routeKeys, routes);
      var params = getParams(e.key, routeKeys);

      var ctx = _extends({}, e, {
        routeKeys: routeKeys,
        params: params
      });

      // TODO: add proper logging (as middleware)
      console.info('matching routes for ' + e.key + ':', routeKeys);

      var state = this.state;

      ;

      requestAnimationFrame(handle.bind(this));
    }
  }]);

  return Router;
}(_eventemitter.EventEmitter2);

;

exports.default = Router;