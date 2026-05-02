<script setup>
import { ref } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore.js';
import { useTransactionStore } from './stores/transactionStore.js';

const authStore = useAuthStore();
const txStore = useTransactionStore();
const router = useRouter();

const sidebarOpen = ref(false);

const openSidebar  = () => { sidebarOpen.value = true; };
const closeSidebar = () => { sidebarOpen.value = false; };

const handleLogout = () => {
  txStore.clearData();
  authStore.logout();
  closeSidebar();
  router.push('/login');
};

const navTo = (path) => {
  closeSidebar();
  router.push(path);
};
</script>

<template>
  <!-- 로그인/회원가입: 사이드바 없이 전체화면 -->
  <RouterView v-if="!authStore.isLoggedIn" />

  <!-- 로그인 후 레이아웃 -->
  <div v-else class="app-layout">

    <!-- ── 모바일 오버레이 ── -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>
    </transition>

    <!-- ── 사이드바 ── -->
    <aside :class="['sidebar', sidebarOpen && 'sidebar--open']">
      <!-- 닫기 버튼 (모바일) -->
      <button class="sidebar-close d-lg-none" @click="closeSidebar" aria-label="메뉴 닫기">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- 로고 -->
      <div class="sidebar-logo">
        <div class="logo-icon"><i class="fa-solid fa-wallet"></i></div>
        <span class="logo-text">가계부</span>
      </div>

      <!-- 내비게이션 -->
      <nav class="sidebar-nav flex-grow-1">
        <RouterLink to="/" class="nav-link" @click="closeSidebar">
          <i class="fa-solid fa-chart-pie"></i>
          <span>대시보드</span>
        </RouterLink>
        <RouterLink to="/transactions" class="nav-link" @click="closeSidebar">
          <i class="fa-solid fa-receipt"></i>
          <span>거래내역</span>
        </RouterLink>
      </nav>

      <!-- 사용자 정보 + 로그아웃 -->
      <div class="sidebar-footer">
        <div class="user-block">
          <div class="user-avatar">
            <span>{{ authStore.user?.name?.charAt(0) ?? '?' }}</span>
          </div>
          <div class="user-info">
            <div class="user-name">{{ authStore.user?.name }}</div>
            <div class="user-email">{{ authStore.user?.email }}</div>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>로그아웃</span>
        </button>
      </div>
    </aside>

    <!-- ── 메인 영역 ── -->
    <div class="main-wrap">
      <!-- 모바일 상단 헤더 -->
      <header class="mobile-header d-lg-none">
        <button class="hamburger" @click="openSidebar" aria-label="메뉴 열기">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="mobile-logo">
          <i class="fa-solid fa-wallet me-2"></i>가계부
        </div>
        <div class="mobile-avatar" @click="openSidebar">
          {{ authStore.user?.name?.charAt(0) ?? '?' }}
        </div>
      </header>

      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── 레이아웃 ───────────────────────────── */
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* ── 사이드바 ───────────────────────────── */
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #ffffffcc;
  backdrop-filter: blur(12px);
  border-right: 1px solid #eef0f4;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
  transition: transform 0.28s cubic-bezier(.4,0,.2,1);
  z-index: 200;
}

/* ── 로고 ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: .65rem;
  margin-bottom: 2rem;
  padding: 0 .5rem;
}
.logo-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: grid; place-items: center;
  color: #fff;
  font-size: 1rem;
  flex-shrink: 0;
}
.logo-text {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

/* ── 내비 ── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: .25rem;
}
.sidebar-nav .nav-link {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .65rem .9rem;
  border-radius: .65rem;
  color: #475569;
  font-weight: 500;
  font-size: .9rem;
  text-decoration: none;
  transition: all .15s ease;
}
.sidebar-nav .nav-link i {
  width: 18px;
  text-align: center;
  font-size: .95rem;
}
.sidebar-nav .nav-link:hover {
  background: #f1f5f9;
  color: #6366f1;
}
.sidebar-nav .nav-link.router-link-exact-active {
  background: linear-gradient(135deg, #eef2ff, #f5f3ff);
  color: #6366f1;
  font-weight: 600;
  box-shadow: inset 3px 0 0 #6366f1;
}

/* ── 사이드바 하단 ── */
.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eef0f4;
}
.user-block {
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: .5rem .25rem;
  margin-bottom: .6rem;
}
.user-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: grid; place-items: center;
  color: #fff;
  font-size: .85rem;
  font-weight: 700;
  flex-shrink: 0;
}
.user-info { overflow: hidden; }
.user-name {
  font-size: .85rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-email {
  font-size: .7rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-logout {
  display: flex;
  align-items: center;
  gap: .5rem;
  width: 100%;
  padding: .45rem .85rem;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: .65rem;
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s ease;
}
.btn-logout:hover {
  background: #fee2e2;
  color: #ef4444;
  border-color: #fecaca;
}

/* ── 사이드바 닫기 (모바일) ── */
.sidebar-close {
  position: absolute;
  top: 1rem; right: 1rem;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
}
.sidebar-close:hover { background: #e2e8f0; }

/* ── 오버레이 ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .45);
  backdrop-filter: blur(2px);
  z-index: 150;
}
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── 메인 ── */
.main-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding: 2rem 1.75rem;
}

/* ── 모바일 헤더 ── */
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  background: #ffffffee;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eef0f4;
}
.hamburger {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #475569;
  cursor: pointer;
  padding: .25rem .5rem;
  border-radius: 8px;
}
.hamburger:hover { background: #f1f5f9; }
.mobile-logo {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}
.mobile-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: grid; place-items: center;
  color: #fff;
  font-size: .8rem;
  font-weight: 700;
  cursor: pointer;
}

/* ── 반응형 ── */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    left: 0; top: 0;
    transform: translateX(-100%);
    width: 260px;
  }
  .sidebar--open {
    transform: translateX(0);
    box-shadow: 4px 0 32px rgba(15,23,42,.18);
  }
  .main-content {
    padding: 1.25rem 1rem;
  }
}
</style>
