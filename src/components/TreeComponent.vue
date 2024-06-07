<template>
  <v-container>
    <template>
      <v-treeview :items="itemsTree"></v-treeview>
    </template>


    <v-btn
      class="mb-2"
      color="primary"
      @click="openDialog(null)"
    >
      Nuevo Archivo/Directorio
    </v-btn>
    <v-treeview
      :items="treeItems"
      activatable
      item-key="id"
      open-on-click
      :open="open"
      @update:active="handleActiveChange"
      @update:open="handleOpenChange"
    >
      <template v-slot:prepend="{ item }">
        <v-icon v-if="item.isDirectory">mdi-folder</v-icon>
        <v-icon v-else>mdi-file</v-icon>
      </template>
      <template v-slot:label="{ item }">
        <v-text-field
          v-if="editId === item.id"
          v-model="editName"
          @keydown.enter="updateItem"
          @keydown.esc="cancelEdit"
          dense
        ></v-text-field>
        <span v-else @dblclick="editItem(item)">
          {{ item.name }}
        </span>
      </template>
      <template v-slot:append="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          small
          @click="openUploadDialog(item)"
        >
          mdi-upload
        </v-icon>
      </template>
    </v-treeview>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Nombre del archivo/directorio"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.parentId"
                  label="ID del padre"
                ></v-text-field>
              </v-col>              
              <v-col cols="12">
                <v-file-input
                  v-model="file"
                  label="Selecciona un archivo"
                  accept=".pdf"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-checkbox
                  v-model="formData.isDirectory"
                  label="Es un directorio"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveItem">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '@/services/api';

export default {
  props: {
    treeItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      itemsTree: [
        {
          id: 1,
          title: 'Applications :',
          children: [
            { id: 2, title: 'Calendar : app' },
            { id: 3, title: 'Chrome : app' },
            { id: 4, title: 'Webstorm : app' },
          ],
        },
        {
          id: 5,
          title: 'Documents :',
          children: [
            {
              id: 6,
              title: 'vuetify :',
              children: [
                {
                  id: 7,
                  title: 'src :',
                  children: [
                    { id: 8, title: 'index : ts' },
                    { id: 9, title: 'bootstrap : ts' },
                  ],
                },
              ],
            },
            {
              id: 10,
              title: 'material2 :',
              children: [
                {
                  id: 11,
                  title: 'src :',
                  children: [
                    { id: 12, title: 'v-btn : ts' },
                    { id: 13, title: 'v-card : ts' },
                    { id: 14, title: 'v-window : ts' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 15,
          title: 'Downloads :',
          children: [
            { id: 16, title: 'October : pdf' },
            { id: 17, title: 'November : pdf' },
            { id: 18, title: 'Tutorial : html' },
          ],
        },
        {
          id: 19,
          title: 'Videos :',
          children: [
            {
              id: 20,
              title: 'Tutorials :',
              children: [
                { id: 21, title: 'Basic layouts : mp4' },
                { id: 22, title: 'Advanced techniques : mp4' },
                { id: 23, title: 'All about app : dir' },
              ],
            },
            { id: 24, title: 'Intro : mov' },
            { id: 25, title: 'Conference introduction : avi' },
          ],
        },
      ],
      open: [],
      dialog: false,
      formData: {
        id: 0,
        name: '',
        parentId: '',
        isDirectory: false,
        children: []
      },
      editId: null,
      editName: '',
    };
  },
  computed: {
    dialogTitle() {
      return this.formData.id ? 'Editar Archivo/Directorio' : 'Crear Archivo/Directorio';
    }
  },
  methods: {
    openDialog(item) {
      if (item) {
        this.formData = { ...item };
      } else {
        this.formData = {
          id: 0,
          name: '',
          parentId: '',
          isDirectory: false,
          children: []
        };
      }
      this.dialog = true;
    },
    openUploadDialog(item) {
      this.$refs.uploadFileDialog.parentId = item ? item.id : '';
      this.$refs.uploadFileDialog.open();
    },
    async saveItem() {
      try {
        console.log(`🚀 ~ saveItem ~ this.formData:`, this.formData)
        if (this.formData.id) {
          await api.updateFile(this.formData.id, this.formData);
        } else {
          const response = await api.createFile(this.formData);
          this.formData.id = response.data.id;
          if (this.formData.parentId) {
            const parent = this.findItem(this.treeItems, this.formData.parentId);
            if (parent) {
              parent.children.push(this.formData);
            }
          } else {
            this.$emit('update:treeItems', [...this.treeItems, this.formData]);
          }
        }
        this.dialog = false;
      } catch (error) {
        console.error('Error guardando el archivo:', error);
      }
    },
    async deleteItem(item) {
      try {
        await api.deleteFile(item.id);
        this.removeItem(this.treeItems, item.id);
      } catch (error) {
        console.error('Error eliminando el item:', error);
      }
    },
    removeItem(items, id) {
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items.splice(index, 1);
      } else {
        items.forEach(item => {
          if (item.children) {
            this.removeItem(item.children, id);
          }
        });
      }
    },
    editItem(item) {
      this.editId = item.id;
      this.editName = item.name;
    },
    async updateItem() {
      try {
        await api.updateFile(this.editId, { name: this.editName });
        const item = this.findItem(this.treeItems, this.editId);
        if (item) {
          item.name = this.editName;
        }
        this.editId = null;
        this.editName = '';
      } catch (error) {
        console.error('Error actualizando el item:', error);
      }
    },
    cancelEdit() {
      this.editId = null;
      this.editName = '';
    },
    findItem(items, id) {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }
        if (item.children) {
          const found = this.findItem(item.children, id);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    handleActiveChange(active) {
      // Manejar cambios en elementos activos
    },
    handleOpenChange(open) {
      this.open = open;
    },
    closeDialog() {
      this.dialog = false;
      this.formData = {
        id: null,
        name: '',
        parentId: '',
        isDirectory: false,
        children: []
      };
    }
  }
};
</script>

<style scoped>
</style>