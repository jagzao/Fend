import axios from 'axios';

const API_URL = 'https://localhost:7257/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'X-Api-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmciLCJqdGkiOiI2OGE3NDA5OC0xOTEyLTRhZWQtYjkxOS0xYzM5YjczNDcxMWQiLCJleHAiOjE3MTc2ODM4MzB9._2b7qr8dwzu7MePVGtRihQ9yIxdyCjDy5DZmTah8zUU'
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
  createFile(data) {
    return api.post('/Files', data);
  },
  updateFile(data) {
    return api.put(`/Files`, data);
  },
  deleteFile(id) {
    return api.delete(`/Files/${id}`);
  }
};