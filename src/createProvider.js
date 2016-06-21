import React from 'react';
import Router from './Router';

export default function createProvider (opts) {
  const router = new Router(opts);
  const { url } = router.registerPlugins();

  return class Provider extends React.Component {
    static childContextTypes = {
      route: React.PropTypes.func,
      subscribe: React.PropTypes.func,
      state: React.PropTypes.object,
      goToUrl: React.PropTypes.func
    };

    getChildContext () {
      return {
        state: router.state,
        route: router.route.bind(router),
        subscribe: router.subscribe.bind(router),
        goToUrl: router.connectMiddleware(url.middleware)      };
    };

    render () {
      return (
        <div>
          { this.props.children }
        </div>
      );
    };
  };
};
