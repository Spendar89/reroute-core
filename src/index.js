import 'babel-polyfill';
import { Map, fromJS } from 'immutable';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

let __plugins = {};

function getRouteHandler (event) {
  const { type='react', key } = event;
  const route = __plugins[type].routes[key];

  return Array
    .prototype
    .concat(route);
};

function registerPlugins (router, plugins) {
  for (let name in plugins) {
    if (!__plugins[name]) {
      let { register } = plugins[name];

      register && register(router);
    };
  };

  return {
    ...plugins,
    ...__plugins
  };
};

class Router extends EventEmitter {
  constructor () {
    super();
    this.store = {};
  };

  set plugins (plugins) {
    __plugins = registerPlugins(
      this,
      plugins
    );
  };

  set store (store) {
    this.state = fromJS(store);
  };

  route (event) {
    const route = getRouteHandler(event);
    const ctx = { ...event };
    const prevState = this.state;

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

      state = state.mergeDeep(output);

      if (i + 1 < route.length) {
        requestAnimationFrame(handle.bind(this, e, i+1));
      } else {
        this.state = state;

        this.emit('commit', this.state);
      };
    };

    requestAnimationFrame(handle.bind(this));
  };
};

export default new Router({});
