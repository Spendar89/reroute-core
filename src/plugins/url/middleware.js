export default function middleware (route) {
  return (key, payload) => {
    if (window.location.pathname !== key) {
      window.history.pushState(payload, '', key);
    }; 

    route({ 
      key,
      payload, 
      type: 'url' 
    });
  };
};
