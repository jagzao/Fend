<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Administracion de facturas</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/table">
        <v-btn text>Facturas</v-btn>
      </router-link>
      <router-link to="/tree">
        <v-btn text>Archivos</v-btn>
      </router-link>
      <router-link to="/report">
        <v-btn text>Reporte</v-btn>
      </router-link>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
</style>