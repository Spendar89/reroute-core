import routes from './routes';

export default function register (router) {
  const valToJS = val => val && val.toJS
    ? val.toJS()
    : val;

  for (let key in routes) {
    // multiple paths are separated by commas
    const pathStrings = key.split(',');

    // register handler for each path
    for (let pathString of pathStrings) {
      // nested paths are separated by periods
      const path = pathString.split('.');

      router.on('commit', (prevStore) => {
        const previousValue = prevStore.getIn(path);
        const currentValue = router.state.getIn(path);

        // reference equality check works
        // because values are immutable
        if (previousValue !== currentValue) {
          router.route({
            key,
            type: 'state',
            payload: {
              previousValue: valToJS(previousValue),
              currentValue: valToJS(currentValue)
            }
          });
        };
      });
    };
  };
};
