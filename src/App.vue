<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>
    <v-main>
      <TableOrders />
    </v-main>
  </v-app>
</template>

<script>
import TableOrders from './components/TableOrders';

export default {
  name: 'App',

  components: {
    TableOrders,
  },

  data: () => ({
    //
  }),
};
</script>
