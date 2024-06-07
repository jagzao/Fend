<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Bills</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Bill
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.amount" label="Amount"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'ID', align: 'start', sortable: false, value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        amount: 0
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
      return this.editedIndex === -1 ? 'New Bill' : 'Edit Bill';
    }
  },
  methods: {
    async fetchBills() {
      try {
        const response = await api.getAllBills();
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteItem(item) {
      const index = this.items.indexOf(item);
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await api.deleteBill(item.id);
          this.items.splice(index, 1);
        } catch (error) {
          console.error('Error deleting bill:', error);
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
          await api.updateBill(this.editedItem.id, this.editedItem);
          Object.assign(this.items[this.editedIndex], this.editedItem);
        } catch (error) {
          console.error('Error updating bill:', error);
        }
      } else {
        try {
          const response = await api.createBill(this.editedItem);
          this.editedItem.id = response.data.id;
          this.items.push(this.editedItem);
        } catch (error) {
          console.error('Error creating bill:', error);
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
