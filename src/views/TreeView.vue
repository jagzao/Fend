<template>
  <div>
    <h1>Tree View</h1>
    <v-container>
      <TreeComponent :treeItems="treeItems"></TreeComponent>
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
          this.treeItems = response.data;
        } else {
          response = await axios.get('/treeData.json');
          this.treeItems = response.data;
          console.log(`🚀 ~ fetchTreeData ~ this.treeItems:`, this.treeItems.length)
        }
      } catch (error) {
        console.error("Error obteniendo el árbol:", error);
      }
    }
  }
};
</script>

<style scoped>
</style>