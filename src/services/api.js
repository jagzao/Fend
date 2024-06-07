import axios from 'axios';

const API_URL = 'https://localhost:7257/api/';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmciLCJqdGkiOiI2OGE3NDA5OC0xOTEyLTRhZWQtYjkxOS0xYzM5YjczNDcxMWQiLCJleHAiOjE3MTc2ODM4MzB9._2b7qr8dwzu7MePVGtRihQ9yIxdyCjDy5DZmTah8zUU'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'X-Api-Key': API_KEY
  }
});

export default {
  getAllBills() {
    return api.get('Bill/');
  },
  getBillById(id) {
    return api.get(`Bill/${id}`);
  },
  createBill(bill) {
    return api.post('Bill/', bill);
  },
  updateBill(bill) {
    return api.put(`Bill/`, bill);
  },
  deleteBill(id) {
    return api.delete(`Bill/${id}`);
  },

  getTree() {
    return api.get('/Files');
  },
  createFile(formData) {
    return api.post('Files/upload-stream', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Api-Key': API_KEY
      }
    });
  },
  updateFile(formData) {
    return api.put(`Files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Api-Key': API_KEY
      }
    });
  },
  deleteFile(id) {
    return api.delete(`Files/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Api-Key': API_KEY
      }
    });
  },

  generateReport(startDate, endDate) {
    return api.get('Report/generate', { params: { startDate, endDate } });
  },
  downloadReport(startDate, endDate) {
    return api.get('Report/download', { params: { startDate, endDate }, responseType: 'blob' });
  }
};