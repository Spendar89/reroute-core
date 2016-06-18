'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = connect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function connect(mapStateToProps, mapRouteToProps) {
  return function (WrappedComponent) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      _inherits(Connect, _React$Component);

      function Connect(props, _ref) {
        var state = _ref.state;
        var subscribe = _ref.subscribe;
        var route = _ref.route;

        _classCallCheck(this, Connect);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Connect).call(this));

        _this.subscribe = subscribe;
        _this.route = route;
        _this.state = mapStateToProps(state, props);
        return _this;
      }

      _createClass(Connect, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this2 = this;

          this.unsubscribe = this.subscribe(function (state) {
            return _this2.setState(mapStateToProps(state, _this2.props));
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.unsubscribe();
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(_, nextState) {
          var combinedState = _extends({}, this.state, nextState);

          for (var k in combinedState) {
            if (nextState[k] !== this.state[k]) {
              return true;
            };
          };

          return false;
        }
      }, {
        key: 'render',
        value: function render() {
          var props = _extends({}, this.props, this.state);

          var routeToProps = mapRouteToProps(this.route, props);

          return _react2.default.createElement(WrappedComponent, _extends({}, props, routeToProps));
        }
      }]);

      return Connect;
    }(_react2.default.Component), _class.contextTypes = {
      route: _react2.default.PropTypes.func,
      subscribe: _react2.default.PropTypes.func,
      state: _react2.default.PropTypes.object
    }, _temp;
  };
};