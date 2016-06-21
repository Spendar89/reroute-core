// util that converts url search
// string to js object
const urlSearchToObj = (search) => {
  const str = search.split('?')[1];
  const obj = str && str
    .split('&')
    .reduce((curr, p) => {
      const [key, val] = p.split('=');

      curr[key] = val;

      return curr;
    }, {});

  return obj || {};
};

// url event-creator
const url = (key, payload={}) => ({
  key,
  payload,
  type:'url'
});

export default function register (router) {
  const onUrlChange = () => {
    const { pathname, search } = window.location;

    router.route(url(pathname, urlSearchToObj(search)));
  };

  // TODO: add payload to url by converting to search params
  // TODO: consider replacing event handler with custom route
  // function for handling pushState side-fx
  router.on('route', ({ type, key, payload }) => {
    if (type === 'url' && window.location.pathname !== key) {
      window.history.pushState({ payload }, '', key);
    };
  });

  // TODO: remove (for convenience only)
  window.__route = router.route.bind(router);

  // call on page load and when history changes
  window.onload = window.onpopstate = onUrlChange;
};
