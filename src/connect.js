import React from 'react';

export default function connect (mapStateToProps, mapRouteToProps) {
  return function (WrappedComponent) {
    return class Connect extends React.Component {
      constructor (props, context) {
        super(props, context);

        const { router } = props;
        const { state, subscribe, route } = router;

        this.router = router;
        this.subscribe = subscribe.bind(router);
        this.route = route.bind(router);
        this.state = this.mapState();
      };

      mapState () {
        return mapStateToProps(
          this.router.state,
          this.props
        );
      };

      componentWillMount () {
        this.unsubscribe = this.subscribe(
          _ => this.setState(this.mapState)
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
        return React.createElement(WrappedComponent, {
          ...this.props,
          ...this.state,
          ...mapRouteToProps(this.route)
        });
      };
    };
  };
};
