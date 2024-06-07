<template>
  <div>
    <h1>Tree View</h1>
    <v-container>
      <TreeComponent :treeItems="treeItems" @fetchTreeData="fetchTreeData"></TreeComponent>
    </v-container>
  </div>
</template>

<script>
import TreeComponent from '@/components/TreeComponent.vue';
import api from '@/services/api';
import axios from 'axios';

export default {
  components: {
    TreeComponent
  },
  data() {
    return {
      treeItems: []
    };
  },
  created() {
    this.fetchTreeData();
  },
  methods: {
    async fetchTreeData() {
      try {
        let response = await api.getTree();
        if (response.data && response.data.length) {
          this.treeItems = this.mapTreeItems(response.data);
        } else {
          response = await axios.get('/treeData.json');
          this.treeItems = this.mapTreeItems(response.data);
        }
      } catch (error) {
        console.error("Error obteniendo el árbol:", error);
      }
    },
    mapTreeItems(items) {
      return items.map(item => {
        const mappedItem = {
          id: item.id,
          title: item.name,
          parentId: item.parentId,
          isDirectory: item.isDirectory,
          children: item.children ? this.mapTreeItems(item.children) : undefined
        };
        return mappedItem;
      });
    }
  }
};
</script>

<style scoped>
</style>