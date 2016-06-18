import React from 'react';

export default function connect (mapStateToProps, mapRouteToProps) {
  return function (WrappedComponent) {
    return class Connect extends React.Component {
      static contextTypes = {
        route: React.PropTypes.func,
        subscribe: React.PropTypes.func,
        state: React.PropTypes.object
      };

      constructor (props, { state, subscribe, route }) {
        super();
        this.subscribe = subscribe;
        this.route = route;
        this.state = mapStateToProps(
          state, 
          props
        );
      };

      componentWillMount () {
        this.unsubscribe = this.subscribe(
          state => this.setState(
            mapStateToProps(
              state, 
              this.props
            )
          )
        );
      };

      componentWillUnmount () {
        this.unsubscribe();
      };

      shouldComponentUpdate (_, nextState) {
        const combinedState = { 
          ...this.state, 
          ...nextState 
        };

        for (let k in combinedState) {
          if (nextState[k] !== this.state[k]) {
            return true;
          };
        };

        return false;
      };

      render () {
        const props = {
          ...this.props,
          ...this.state
        };

        const routeToProps = mapRouteToProps(
          this.route, 
          props
        );

        return React.createElement(
          WrappedComponent, {
            ...props,
            ...routeToProps
          }
        );
      };
    };
  };
};
