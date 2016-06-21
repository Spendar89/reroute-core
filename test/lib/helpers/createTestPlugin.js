import expect from 'expect';

export default function createTestPlugin (key, routes={}, register=expect.createSpy()) {
  return {
    [key]: {
      routes: {

        a: [ expect.createSpy() ],
        b: expect.createSpy(),
          ...routes
      },
      register
    }
  };
};
