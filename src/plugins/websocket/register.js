import routes from './routes';

export default function register (router) {
    for (let key in routes) {
      this.socket.on(key, payload => {
        router.route({
          key,
          payload
        });
      });
    }
};
