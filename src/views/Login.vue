<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

onMounted(() => {
  authStore.clearError();
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    return;
  }
  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push('/');
  }
};

const goRegister = () => {
  authStore.clearError();
  router.push('/register');
};
</script>

<template>
  <div class="auth-bg d-flex align-items-center justify-content-center min-vh-100">
    <!-- 배경 장식 -->
    <div class="auth-blob auth-blob--1"></div>
    <div class="auth-blob auth-blob--2"></div>

    <div class="auth-card">
      <!-- 로고 영역 -->
      <div class="text-center mb-4">
        <div class="auth-logo mx-auto mb-3">
          <i class="fa-solid fa-wallet"></i>
        </div>
        <h2 class="fw-bold mb-1" style="color:#0f172a;">가계부 대시보드</h2>
        <p class="text-muted small">계정에 로그인하여 시작하세요</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="authStore.error" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-3" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span class="small">{{ authStore.error }}</span>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label class="form-label fw-semibold small text-secondary">이메일</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="fa-solid fa-envelope text-muted"></i>
            </span>
            <input
              v-model="email"
              type="email"
              class="form-control border-start-0 ps-0"
              placeholder="example@email.com"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label fw-semibold small text-secondary">비밀번호</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control border-start-0 border-end-0 ps-0"
              placeholder="비밀번호 입력"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="input-group-text bg-white border-start-0 cursor-pointer"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-muted"></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-gradient w-100 py-2 mb-3"
          :disabled="authStore.loading || !email || !password"
        >
          <span v-if="authStore.loading">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>로그인 중…
          </span>
          <span v-else>
            <i class="fa-solid fa-right-to-bracket me-2"></i>로그인
          </span>
        </button>
      </form>

      <!-- 데모 계정 안내 -->
      <div class="demo-box mb-3">
        <p class="small text-muted mb-1"><i class="fa-solid fa-circle-info me-1"></i>데모 계정</p>
        <p class="small mb-0">
          이메일: <code class="text-primary">demo@example.com</code><br>
          비밀번호: <code class="text-primary">1234</code>
        </p>
      </div>

      <!-- 회원가입 링크 -->
      <p class="text-center small text-muted mb-0">
        아직 계정이 없으신가요?
        <button type="button" class="btn btn-link btn-sm p-0 text-primary fw-semibold" @click="goRegister">
          회원가입
        </button>
      </p>
    </div>
  </div>
</template>
