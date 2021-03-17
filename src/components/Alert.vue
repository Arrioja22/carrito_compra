<template>
  <v-snackbar
    id="Alert"
    app
    bottom
    right
    :color="colorType(alert.type)"
    v-model="alert.show"
    transition="slide-y-transition"
  >
    <span class="font-weight-bold">
      {{alert.message && alert.message.message ? alert.message.message : alert.message}}
    </span>
    <span v-if="errors" v-html="errors"/>
    <template v-slot:action="{ attrs }">
      <v-btn
        dark
        icon
        small
        v-bind="attrs"
        @click="close()"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  name: 'Alert',
  methods: {
    colorType(type) {
      switch (type) {
        case 'success':
          return 'success';
        case 'error':
          return 'error';
        default:
          return 'primary';
      }
    },
    close() {
      this.$store.state.alertState.show = false;
    },
  },
  computed: {
    alert() {
      if (this.$store.state.alertState.errors) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.errors = this.$store.state.alertState.errors;
        return this.$store.state.alertState;
      }
      return this.$store.state.alertState;
    },
  },
};
</script>
