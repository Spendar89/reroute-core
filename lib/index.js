'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = require('./router');

Object.defineProperty(exports, 'router', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_router).default;
  }
});

var _connect = require('./connect');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_connect).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }