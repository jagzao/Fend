import { createRouter, createWebHistory } from 'vue-router';
import TableView from '../views/TableView.vue';
import TreeView from '../views/TreeView.vue';
import ReportView from '../views/ReportView.vue';

const routes = [
  { path: '/', redirect: '/table' },
  { path: '/table', component: TableView },
  { path: '/tree', component: TreeView },
  { path: '/report', component: ReportView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;