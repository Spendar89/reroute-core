import React from 'react';

export default function createProvider (router) {
  return class Provider extends React.Component {
    static childContextTypes = {
      route: React.PropTypes.func,
      subscribe: React.PropTypes.func,
      state: React.PropTypes.object
    };

    getChildContext () {
      return {
        state: router.state,
        route: router.route.bind(router),
        subscribe: router.subscribe.bind(router)
      };
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