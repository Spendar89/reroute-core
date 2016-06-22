import expect from 'expect';
import Router from './../src/router';
import { store, plugins, events } from './lib/mocks';
import { fromJS } from 'immutable';
import { createTestPlugin } from './lib/helpers';

describe('Router', () => {
  const router = new Router({ 
    store, 
    plugins 
  });

  describe('constructor', () => {
    it ('has an immutable state', () => {
      const { state } = router;

      expect(state).toExist();
      expect(state).toEqual(fromJS(store));
    });

    it ('registers the provided plugins', () => {
      const plugins = router.registerPlugins();

      for(let plugin in plugins) {
        const { register } = plugins[plugin];

        expect(register.calls.length).toEqual(1);
      };
    });

    it ('does not expose a plugins property', () => {
      expect(router.plugins).toNotExist();
    });
  });

  describe('registerPlugins', () => {
    const { registerPlugins } = router;

    context ('with no arguments', () => {
      const newPlugins = registerPlugins();

      it ('returns the registered plugins', () => {
        expect(newPlugins).toEqual(plugins);
      });
    });

    context ('with a new plugin argument', () => {
      const newPlugin = createTestPlugin('c');
      const { a, b, c } = registerPlugins(newPlugin);

      it ('doesnt overwrite existing plugins', () => {
        expect([ a, b ]).toEqual([ plugins.a, plugins.b ]);
      });

      it ('adds the new plugin', () => {
        expect(c).toExist(); 
        expect(c).toEqual(newPlugin.c);
      })
    })
  });


  describe('route', (done) => {
    global.requestAnimationFrame = setTimeout;

    const { controller } = router.registerPlugins().a;

    it('should support array handlers', (done) => {
      const unsubscribe = router.subscribe(() => {
        for (let route of controller.a) {
          expect(route.calls.length).toEqual(1);
        };

        unsubscribe();

        done();
      });

      router.route(events.a);
    });

    it('should support function handlers', (done) => {
      const unsubscribe = router.subscribe(_ => {
        expect(controller.b.calls.length).toEqual(1);

        unsubscribe();

        done();
      });

      router.route(events.b);
    });
  });
});
