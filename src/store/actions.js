import store from '.';
import { http } from '../main';

const actions = {
  getOrders({ commit }, payload) {
    const url = 'v2/orders';
    const options = {
      emulateJSON: false,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    http.defaults.headers.common.Authorization = `Bearer ${store.state.token}`;
    http.get(url, {}, options)
      .then(
        (response) => {
          commit('purchaseOrders', { event: payload.event, response });
        },
      )
      .catch(
        (error) => {
          commit('onError', { event: payload.event, error });
        },
      );
  },
};

export default actions;
