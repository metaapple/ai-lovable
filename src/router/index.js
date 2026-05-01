import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';

const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/transactions', name: 'transactions', component: Transactions }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
