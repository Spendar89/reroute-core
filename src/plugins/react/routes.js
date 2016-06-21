export default {
  clickedTestButton: [
    (state, ctx) => {
      ctx.changed = true;

      return {
        msgs: [
          ...state.msgs,
          {
            subject: 'lets get lunch',
            body: 'yo dude wanna get lunch later?'
          }
        ]
      };
    },

    async (state, ctx) => {
      const { ms } = ctx.payload;

      await new Promise(r => setTimeout(r, ms));

      return { changed: true, test: 'hey' };
    },

    (state, ctx) => {
      console.log(ctx, state);

      return ctx.payload;
    }
  ],

  removedTestButton: [
    ({ msgs }, { payload }) => {
      const { index } = payload;

      const _msgs = msgs.reduce((curr, m, i) => {
        if (i !== index) curr.push(m);
        return curr;
      }, []);

      return { msgs: _msgs };
    }
  ],

  clickedRemoveAllButton: [
    (state, { payload }) => {
      state.msgs.splice(1, state.msgs.length - 1);
      return state;
    }
  ]
};

