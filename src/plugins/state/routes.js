export default {
  'test': (state, { key, payload }) => {
    console.log(key + ' state', payload);

    return {
      test: 'sdg',
      user: {
        name: {
          first: 'lala',
          last: ['cool']
        }
      }
    };
  },

  'user.name': (state, { key, payload }) => {
    console.log(key + ' state', payload);

    return {
      test: 'sdg',
      user: {
        name: {
          first: 'lala',
          last: ['cool', 'dude']
        }
      }
    };
  },

  'user.name.last.1': (state, { key, payload }) => {
    console.log(key + ' state', payload);

    return state;
  }
};
