<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="bills"
      >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Facturas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
              >
                Nueva Factura
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <BillComponent :editedItem="editedItem"></BillComponent>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Seguro que quieres eliminar la factura?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Ok</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>      
    </v-data-table>
  </v-container>
</template>

<script>
import api from '@/services/api';
import BillComponent from '@/components/BillComponent.vue'

export default {
  components: {
    BillComponent
  },
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'Id', align: 'start', sortable: false, value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Company', value: 'company' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      bills: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        company: ''
      },
      defaultItem: {
        id: 0,
        name: '',
        amount: 0
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva factura' : 'Editar Factura';
    }
  },
  methods: {
    async fetchBills() {
      try {
        const response = await api.getAllBills();
        console.log(`🚀 ~ fetchBills ~ response:`, response)
        this.bills = response.data.data;
      } catch (error) {
        console.log('Error fetchBills:', error);
      }
    },
    editItem(item) {
      this.editedIndex = this.bills.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      const index = this.bills.indexOf(item);
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await api.deleteBill(item.id);
          this.bills.splice(index, 1);
        } catch (error) {
          console.log('Error deleting bill:', error);
        }
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      if (this.editedIndex > -1) {
        try {
          console.log(`🚀 ~ save ~ this.editedItem:`, this.editedItem)
          await api.updateBill(this.editedItem);
          Object.assign(this.bills[this.editedIndex], this.editedItem);
        } catch (error) {
          console.log('Error en actualizacion:', error);
        }
      } else {
        try {
          const response = await api.createBill(this.editedItem);
          console.log(`🚀 ~ save ~ response:`, response)
          this.editedItem.id = response.data.id;
          this.bills.push(this.editedItem);
        } catch (error) {
          console.log('Error creando factura:', error);
        }
      }
      this.close();
    }
  },
  created() {
    this.fetchBills();
  }
};
</script>

<style scoped>
</style>
4:10 p. m.


