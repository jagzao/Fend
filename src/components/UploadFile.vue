<template>
  <v-file-input v-model="file" label="Upload PDF" accept=".pdf" @change="uploadFile"></v-file-input>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      file: null
    }
  },
  methods: {
    async uploadFile() {
      const formData = new FormData()
      formData.append('file', this.file)
      try {
        await api.post('/upload', formData)
        this.$emit('fileUploaded')
      } catch (error) {
        console.error('Error uploading file', error)
      }
    }
  }
}
</script>