'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _immutable = require('immutable');

var _eventemitter = require('eventemitter2');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __plugins = {};

function getRouteHandler(e) {
  var type = e.type;
  var key = e.key;

  var route = __plugins[type].routes[key];

  return Array.prototype.concat(route);
};

var Router = function (_EventEmitter) {
  _inherits(Router, _EventEmitter);

  function Router() {
    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this));

    _this.state = new _immutable.Map();
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
      this.state = this.state.merge(store);

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
                  output = route[i](state.toJS(), ctx);

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

                  if (i + 1 < route.length) {
                    requestAnimationFrame(handle.bind(this, e, i + 1));
                  } else {
                    this.state = state;

                    this.emit('commit', this.state, prevState);
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

      var route = getRouteHandler(e);
      var ctx = _extends({}, e);
      var prevState = this.state;

      this.emit('route', e);

      var state = this.state;

      ;

      requestAnimationFrame(handle.bind(this));
    }
  }]);

  return Router;
}(_eventemitter.EventEmitter2);

;

exports.default = new Router();