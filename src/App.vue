<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore.js';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <!-- 로그인/회원가입 페이지: 사이드바 없이 전체화면 -->
  <RouterView v-if="!authStore.isLoggedIn" />

  <!-- 로그인 후: 사이드바 + 메인 레이아웃 -->
  <div v-else class="container-fluid">
    <div class="row">
      <aside class="col-lg-2 col-md-3 sidebar p-3 d-flex flex-column">
        <!-- 로고 -->
        <h4 class="mb-4 fw-bold text-primary">
          <i class="fa-solid fa-wallet me-2"></i>가계부
        </h4>

        <!-- 내비게이션 -->
        <nav class="nav flex-column flex-grow-1">
          <RouterLink to="/" class="nav-link">
            <i class="fa-solid fa-chart-pie me-2"></i>대시보드
          </RouterLink>
          <RouterLink to="/transactions" class="nav-link">
            <i class="fa-solid fa-receipt me-2"></i>거래내역
          </RouterLink>
        </nav>

        <!-- 유저 정보 + 로그아웃 -->
        <div class="sidebar-user mt-auto pt-3">
          <div class="user-info d-flex align-items-center gap-2 mb-2">
            <div class="user-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="overflow-hidden">
              <div class="fw-semibold small text-truncate" style="color:#0f172a;">
                {{ authStore.user?.name }}
              </div>
              <div class="text-muted" style="font-size:.7rem; line-height:1.2;">
                {{ authStore.user?.email }}
              </div>
            </div>
          </div>
          <button class="btn btn-logout w-100" @click="handleLogout">
            <i class="fa-solid fa-right-from-bracket me-2"></i>로그아웃
          </button>
        </div>
      </aside>

      <main class="col-lg-10 col-md-9 p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
