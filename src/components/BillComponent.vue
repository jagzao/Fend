<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="editedItem.name" label="Nombre emisor"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="editedItem.company" label="Compañia"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    editedItem: Object
  },
  data() {
    return {
      item: this.editedItem || {}
    }
  },
  watch: {
    editedItem(newVal) {
      this.item = { ...newVal };
    }
  },
  methods: {
    save() {
      this.$emit('save', this.item);
    }
  }
}
</script>

<style scoped>
</style>