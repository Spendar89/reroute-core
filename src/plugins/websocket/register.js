import controller from './controller';

export default function register (router) {
    for (let key in controller) {
      this.socket.on(key, payload => {
        router.route({
          key,
          payload
        });
      });
    }
};
