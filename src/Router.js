import 'babel-polyfill';
import { Map, fromJS } from 'immutable';
import { EventEmitter2 } from 'eventemitter2';

let __plugins = {};

function _parse (str) {
  const numVal = parseInt(str);

  return numVal >= 0 || numVal < 0 ? numVal : str;
};

function matchKeys (routeKey, eventKey) {
  const src = "\\b" + routeKey + "\\b";

  return new RegExp(src).test(eventKey);
};

function getMatchingRouteKeys (eventKey, routes) {
  const eventKeyArray = eventKey.split('/');
  const isBasePath = eventKeyArray[1] 
    && !eventKeyArray[1].length;

  if (isBasePath) return eventKey;

  return Object.keys(routes).reduce((curr, routeKey) => {
    const routeKeyArray = routeKey.split('/');

    for(let i in routeKeyArray) {
      const isKeyMatch = matchKeys(routeKeyArray[i], eventKeyArray[i]);
      const isParamMatch = routeKeyArray[i][0] == ':' && eventKeyArray[i];
      const isKeyMissing = !eventKeyArray[i] && !routeKeyArray[i];

      const isNotMatch = !isKeyMatch && !isParamMatch && !isKeyMissing;

      if (isNotMatch) return curr;
    };

    return [ ...curr, routeKey ];
  }, []);
};

function mapRouteKeysToHandler (routeKeys, routes) {
  return routeKeys.reduce((curr, k) => curr.concat(routes[k]), []);
};

function routesByType (type) {
  return __plugins[type].routes;
};

function routeKeyToParamsArray (routeKey) {
  return routeKey
    .split('/')
    .map(k => k[0] === ':' ? k.substr(1) : false);
};

function getParams (eventKey, routeKeys) {
  const eventKeyArray = eventKey.split('/');

  return routeKeys
    .reduce((curr, routeKey) => { 
      const params = routeKeyToParamsArray(routeKey)
        .reduce((curr, param, i) => {
          if (!param) return curr;

          const val = _parse(eventKeyArray[i]);

          return { 
            ...curr, 
            [param]: val 
          };
        }, {});

      return {
        ...curr,
        ...params
      };
    }, {});
};

class Router extends EventEmitter2 {
  constructor ({ store={}, plugins }) {
    __plugins = {};

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

    const routes = routesByType(e.type);
    const routeKeys = getMatchingRouteKeys(e.key, routes);
    const handler = mapRouteKeysToHandler(routeKeys, routes);
    const params = getParams(e.key, routeKeys);

    const ctx = { 
      ...e, 
      routeKeys, 
      params 
    };

    // TODO: add proper logging (as middleware) 
    console.info(
      `matching routes for ${e.key}:`, 
      routeKeys
    );

    let state = this.state;

    async function handle (e, i=0) {
      let output = typeof handler[i] === 'function'
        ? handler[i](state.toJS(), ctx)
        : {};

      // resolve ouput if it returns a promise
        output = output && output.then
          ? await output
          : output;

        state = state.merge(output);

        if (i + 1 < handler.length) {
          requestAnimationFrame(handle.bind(this, e, i+1));
        } else {
          this.state = state;

          this.emit('commit', this.state);
        };
    };

    requestAnimationFrame(handle.bind(this));
  };
};

export default Router;
