<template>
  <v-container>
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
        <span @dblclick="editItem(item)">
          {{ item.title }}
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
                <v-select
                  :items="parentOptions"
                  v-model="formData.parentId"
                  item-title="name"
                  item-value="id"
                  label="ID del padre"
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="!formData.isDirectory">
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
      open: [],
      dialog: false,
      formData: {
        id: 0,
        name: '',
        parentId: 0,
        isDirectory: false,
        children: [],
        fileSize: 0,
      },
      file: null,
      editId: null,
      editName: '',
      parentOptions: [],
    };
  },
  computed: {
    dialogTitle() {
      return this.formData.id ? 'Editar Archivo/Directorio' : 'Crear Archivo/Directorio';
    }
  },
  watch: {
    treeItems: {
      handler(newTreeItems) {
        this.parentOptions = this.generateParentOptions(newTreeItems);
      },
      immediate: true
    }
  },
  methods: {
    openDialog(item) {
      if (item) {
        this.formData = { ...item };
        this.formData.name = item.title;
        this.formData.parentId = item.parentId || '';
      } else {
        this.formData = {
          id: 0,
          fileSize: 0,
          name: '',
          parentId: 0,
          isDirectory: false,
          children: []
        };
      }
      this.dialog = true;
    },
    async saveItem() {
      try {
        const formData = new FormData();
        formData.append('name', this.formData.name);
        formData.append('parentId', this.formData.parentId);
        formData.append('isDirectory', this.formData.isDirectory);
        formData.append('children', this.formData.children);

        if (!this.formData.isDirectory && this.file) {
          formData.append('File', this.file);
        }

        if (this.formData.id) {
          await api.updateFile(formData);
        } else {
          const response = await api.createFile(formData);
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
        this.$emit('fetchTreeData');
      } catch (error) {
        console.error('Error guardando el archivo:', error);
      }
    },
    async deleteItem(item) {
      try {
        await api.deleteFile(item.id);
        this.removeItem(this.treeItems, item.id);
        this.$emit('fetchTreeData');
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
      this.openDialog(item);
    },
    handleOpenChange(open) {
      this.open = open;
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
        this.$emit('tree-updated');
      } catch (error) {
        console.error('Error actualizando el item:', error);
      }
    },
    closeDialog() {
      this.dialog = false;
      this.formData = {
        id: null,
        name: '',
        parentId: 0,
        isDirectory: false,
        children: []
      };
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
    generateParentOptions(items) {
      const options = [];
      const traverse = (items) => {
        for (const item of items) {
          options.push({ id: item.id, name: item.title });
          if (item.children && item.children.length) {
            traverse(item.children);
          }
        }
      };
      traverse(items);
      return options;
    }
  }
};
</script>

<style scoped>
</style>