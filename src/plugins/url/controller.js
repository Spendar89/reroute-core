export default {
  '/': [
    (state, { key: pathname, payload, params }) => {
      const url = {
        pathname,
        params
      };

      return { url };
    },
    (state, ctx) => {
      console.log("current url state:", state.url);

      return { layout: 'application', page: 'index' };
    }
  ],
  '/messages/:messageId': (state, ctx) => {
    return { layout: 'messages' };
  },
  '/messages/:messageId/replies/:replyId': (state, { payload }) => {
    const { messageId } = payload;

    return { page: 'show', messageId };
  },
  '/test_route_1/:dude/bro': (state, ctx) => {
  }
};
