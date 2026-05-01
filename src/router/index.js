import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import { useAuthStore } from '../stores/authStore.js';

const routes = [
  { path: '/login',    name: 'login',    component: Login,    meta: { guest: true } },
  { path: '/register', name: 'register', component: Register, meta: { guest: true } },
  { path: '/',         name: 'dashboard',     component: Dashboard,     meta: { requiresAuth: true } },
  { path: '/transactions', name: 'transactions', component: Transactions, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // 로그인이 필요한 페이지 → 미로그인 시 /login 이동
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' };
  }

  // 이미 로그인된 상태에서 로그인/회원가입 접근 → 홈으로 이동
  if (to.meta.guest && authStore.isLoggedIn) {
    return { name: 'dashboard' };
  }
});

export default router;
