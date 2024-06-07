<template>
  <v-container>
    <v-form @submit.prevent="generateReport">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="startDate"
            label="Fecha de inicio"
            type="date"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="endDate"
            label="Fecha de fin"
            type="date"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn type="submit" color="primary">Generar Reporte</v-btn>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="reportData"
    ></v-data-table>
    <v-btn @click="downloadReport" color="secondary">Descargar Reporte</v-btn>
  </v-container>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      reportData: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'Fecha', value: 'date' },
        { text: 'Cantidad', value: 'amount' }
      ]
    };
  },
  methods: {
    async generateReport() {
      try {
        const response = await api.generateReport(this.startDate, this.endDate);
        this.reportData = response.data;
      } catch (error) {
        console.error('Error generando el reporte:', error);
      }
    },
    async downloadReport() {
      try {
        const response = await api.downloadReport(this.startDate, this.endDate);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporte.csv'); // o reporte.xlsx
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error descargando el reporte:', error);
      }
    }
  }
};
</script>

<style scoped>
</style>