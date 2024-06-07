<template>
  <v-btn @click="generateReport">Generate Report</v-btn>
</template>

<script>
import { generateReport } from '@/services/reportService'

export default {
  methods: {
    async generateReport() {
      const data = await this.fetchData()
      generateReport(data)
    },
    fetchData() {
      // Fetch data from API
    }
  }
}
</script>