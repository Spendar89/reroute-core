import 'babel-polyfill';
import { Map } from 'immutable';
import { EventEmitter2 } from 'eventemitter2';

let __plugins = {};

function getRouteHandler (e) {
  const { type, key } = e;
  const route = __plugins[type].routes[key];

  return Array
    .prototype
    .concat(route);
};

class Router extends EventEmitter2 {
  constructor () {
    super();

    this.state = new Map();
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
    this.state = this.state.merge(store);

    return this.state;
  };

  subscribe (cb) {
   this.on('commit', cb); 

   return _ => this.off('commit', cb);
  };

  route (e) {
    const route = getRouteHandler(e);
    const ctx = { ...e };
    const prevState = this.state;

    this.emit('route', e);

    let state = this.state;

    async function handle (e, i=0) {
      let output = route[i](
        state.toJS(),
        ctx
      );

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

export default new Router();
