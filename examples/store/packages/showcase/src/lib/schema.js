import { Api } from 'react-microfrontend';
export default {
  name: 'showcase',
  interface: {
    filterBy: {
      initialState: {},
    },
    filterByTag: {
      type: Api.TYPE.FUNCTION,
    },
  },
};
