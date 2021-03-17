/* eslint-disable */

const mutations = {
  purchaseOrders(state, payload) {
    payload.event.context.purchaseOrders = payload.response.data.orders;
  },
  onError(state, payload) {
    state.alertState = { show: true, message: payload.error.response.data.message, type: 'error' };
  },
};

export default mutations;
