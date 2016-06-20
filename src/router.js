import 'babel-polyfill';
import { Map, fromJS } from 'immutable';
import { EventEmitter2 } from 'eventemitter2';

let __plugins = {};

function matchKeys (routeKey, eventKey) {
  const src = "\\b" + routeKey + "\\b";

  return new RegExp(src).test(eventKey);
};

function getRouteHandler ({ type, key }) {
  const { routes } = __plugins[type];
  const eventKeyArray = key.split('/');

  if (eventKeyArray[1] && !eventKeyArray[1].length) {
    return [].concat(routes[key]);
  };

  return Object.keys(routes).reduce((curr, routeKey) => {
    const routeKeyArray = routeKey.split('/');

    for(let i in routeKeyArray) {
      const isKeyMatch = matchKeys(routeKeyArray[i], eventKeyArray[i]);
      const isParamMatch = routeKeyArray[i][0] == ':' && eventKeyArray[i];
      const isKeyMissing = !eventKeyArray[i] && !routeKeyArray[i];

      const isMatch = !isKeyMatch && !isParamMatch && !isKeyMissing;

      if (isMatch) return curr;
    };

    return curr.concat(routes[routeKey]);
  }, []);
};

class Router extends EventEmitter2 {
  constructor ({ store={}, plugins }) {
    super();
    this.state = fromJS(store);
    this.registerPlugins(plugins);
  };

  registerPlugins (plugins) {
    for (let name in plugins) {
      if (!__plugins[name]) {
        let { register } = plugins[name];

        register && register(this);
      };
    };

    __plugins = {
      ...__plugins,
      ...plugins
    };

    return __plugins;
  };

  registerStore (store) {
    this.state = this.state.mergeDeep(store);

    return this.state;
  };

  subscribe (cb) {
    this.on('commit', cb); 

    return _ => this.off('commit', cb);
  };

  route (e) {
    this.emit('route', e);

    const route = getRouteHandler(e);
    const ctx = { ...e };
    const prevState = this.state;

    let state = this.state;

    async function handle (e, i=0) {
      let output = typeof route[i] === 'function'
        ? route[i](state.toJS(), ctx)
        : {};

      // resolve ouput if it returns a promise
        output = output && output.then
          ? await output
          : output;

        state = state.merge(output);

        if (i + 1 < route.length) {
          requestAnimationFrame(handle.bind(this, e, i+1));
        } else {
          this.state = state;

          this.emit('commit', this.state, prevState);
        };
    };

    requestAnimationFrame(handle.bind(this));
  };
};

export default Router;
