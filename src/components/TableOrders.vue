<template>
  <v-container id='TablesOrders'>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>
            <h2>Purchase order</h2>
            <v-spacer/>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  class="white--text rounded-lg mr-2"
                  v-bind="attrs"
                  v-on="on"
                  :loading="loading"
                  :disabled="loading"
                  @click="pay"
                  depressed>
                  <v-icon>mdi-cash-usd-outline</v-icon>
                </v-btn>
              </template>
              <span>Pay Order</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  class="white--text rounded-lg"
                  depressed
                  v-bind="attrs"
                  v-on="on"
                  @click="openCreateModal()"
                >
                <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Add product</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :items="purchaseOrders"
              :headers="headers"
              >
              <template v-slot:item.price="{ item }">
                <p>$ {{item.price}}</p>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="primary"
                      size="30"
                      class="mx-1"
                      v-on="on"
                      @click="viewItem(item)">
                      mdi-eye
                      </v-icon>
                  </template>
                  <span>View product</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="formOrdenModal"
      persistent
      width="600px">
      <v-card class="rounded-lg pa-4">
        <v-card-title style="justify-content: space-between">
          <h4 v-if="dataItem.number" class="font-weight-bold">No. Order: {{dataItem.number}}</h4>
          <h4 v-else class="font-weight-bold">Agregar producto</h4>
          <v-icon @click="dataItem.number ? closeView() : close()">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            v-if="!dataItem.number">
              <v-row>
                <v-col cols="6">
                  <label class="font-weight-bold">SKU:</label>
                  <v-text-field
                    outlined
                    dense
                    color="smx-blue"
                    hide-details="auto"
                    :rules="InputRequired"
                    v-model="newOrder.items[0].sku"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <label class="font-weight-bold">Name:</label>
                  <v-text-field
                    outlined
                    dense
                    color="smx-blue"
                    hide-details="auto"
                    v-model="newOrder.items[0].name"
                    :rules="InputRequired"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <label class="font-weight-bold">Quantity:</label>
                  <v-text-field
                    outlined
                    dense
                    color="smx-blue"
                    hide-details="auto"
                    v-model="newOrder.items[0].quantity"
                    :rules="InputRequired"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <label class="font-weight-bold">Price:</label>
                  <v-text-field
                    outlined
                    dense
                    color="smx-blue"
                    hide-details="auto"
                    v-model="newOrder.items[0].price"
                    :rules="InputRequired"
                    required
                  />
                </v-col>
              </v-row>
          </v-form>
          <v-form v-else>
              <v-row>
                <v-col cols="6">
                  <h3 class="font-weight-bold">SKU:</h3>
                  <h4>{{dataItem.items[0].sku}}</h4>
                </v-col>
                <v-col cols="6">
                  <h3 class="font-weight-bold">Name:</h3>
                  <h4>{{dataItem.items[0].name}}</h4>
                </v-col>
                <v-col cols="6">
                  <h3 class="font-weight-bold">Quantity:</h3>
                  <h4>{{dataItem.items[0].quantity}}</h4>
                </v-col>
                <v-col cols="6">
                  <h3 class="font-weight-bold">Price:</h3>
                  <h4>{{dataItem.items[0].price}}</h4>
                </v-col>
              </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="justify-content: flex-end">
          <div v-if="!dataItem.number">
            <v-btn
              color="error"
              depressed
              dark
              outlined
              small
              class="rounded-lg text-capitalize"
              @click="dataItem.number ? closeView() : close()"
            >
            Cancelar
            </v-btn>
            <v-btn
              color="primary"
              depressed
              small
              class="rounded-lg text-capitalize white--text"
              :loading="loading"
              :disabled="loading"
              @click="validate"
            >
              Agregar
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AlertComponent/>
  </v-container>
</template>
<script>
import AlertComponent from './Alert';

export default {
  name: 'TablesOrders',
  components: {
    AlertComponent,
  },
  data: () => ({
    valid: true,
    loading: false,
    formOrdenModal: false,
    purchaseOrders: [],
    index: -1,
    newOrder: {
      items: [
        {
          sku: '',
          name: '',
          quantity: '',
          price: '',
        },
      ],
    },
    dataItem: {},
    defaultItem: {},
    defaultNew: {
      items: [
        {
          sku: '',
          name: '',
          quantity: '',
          price: '',
        },
      ],
    },
    InputRequired: [v => !!v || 'The field is required'],
  }),
  created() {
    this.getOrders();
  },
  computed: {
    headers() {
      return [
        {
          text: 'sku',
          value: 'items[0].sku',
        },
        {
          text: 'name',
          value: 'items[0].name',
        },
        {
          text: 'quantity',
          value: 'items[0].quantity',
        },
        {
          text: 'price',
          value: 'items[0].price',
        },
        {
          text: 'actions',
          value: 'actions',
          sortable: false,
        },
      ];
    },
  },
  methods: {
    close() {
      this.formOrdenModal = false;
      this.$refs.form.resetValidation();
      this.loading = false;
    },
    closeView() {
      this.formOrdenModal = false;
      this.dataItem = Object.assign({}, this.defaultItem);
    },
    openCreateModal() {
      this.formOrdenModal = true;
    },
    validate() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        this.save();
      } else {
        this.loading = false;
      }
    },
    save() {
      this.purchaseOrders.push(this.newOrder);
      this.newOrder = Object.assign({}, this.defaultNew);
      this.close();
      this.$store.state.alertState = { show: true, message: 'New product add', type: 'success' };
      return this.purchaseOrders;
    },
    pay() {
      this.$store.state.alertState = { show: true, message: 'Pay success', type: 'success' };
      this.loading = false;
    },
    getOrders() {
      this.$store.dispatch('getOrders', { event: { context: this } });
    },
    viewItem(item) {
      this.formOrdenModal = true;
      this.dataItem = Object.assign({}, item);
    },
  },
};
</script>
