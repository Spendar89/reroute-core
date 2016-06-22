import expect from 'expect';

export default function createTestPlugin (key, controller={}, register=expect.createSpy()) {
  return {
    [key]: {
      controller: {

        a: [ expect.createSpy() ],
        b: expect.createSpy(),
          ...controller
      },
      register
    }
  };
};
