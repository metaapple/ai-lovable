<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const localError = ref('');

onMounted(() => {
  authStore.clearError();
});

const handleRegister = async () => {
  localError.value = '';
  if (!name.value || !email.value || !password.value || !passwordConfirm.value) {
    localError.value = '모든 항목을 입력해주세요.';
    return;
  }
  if (password.value.length < 4) {
    localError.value = '비밀번호는 4자 이상이어야 합니다.';
    return;
  }
  if (password.value !== passwordConfirm.value) {
    localError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  const success = await authStore.register(name.value, email.value, password.value);
  if (success) {
    router.push('/');
  }
};

const goLogin = () => {
  authStore.clearError();
  router.push('/login');
};

const displayError = () => localError.value || authStore.error;
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
          <i class="fa-solid fa-user-plus"></i>
        </div>
        <h2 class="fw-bold mb-1" style="color:#0f172a;">회원가입</h2>
        <p class="text-muted small">새 계정을 만들어 가계부를 시작하세요</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="displayError()" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-3" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span class="small">{{ displayError() }}</span>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleRegister" novalidate>
        <!-- 이름 -->
        <div class="mb-3">
          <label class="form-label fw-semibold small text-secondary">이름</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="fa-solid fa-user text-muted"></i>
            </span>
            <input
              v-model="name"
              type="text"
              class="form-control border-start-0 ps-0"
              placeholder="홍길동"
              autocomplete="name"
              required
            />
          </div>
        </div>

        <!-- 이메일 -->
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

        <!-- 비밀번호 -->
        <div class="mb-3">
          <label class="form-label fw-semibold small text-secondary">비밀번호</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control border-start-0 border-end-0 ps-0"
              placeholder="4자 이상 입력"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="input-group-text bg-white border-start-0"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-muted"></i>
            </button>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="mb-4">
          <label class="form-label fw-semibold small text-secondary">비밀번호 확인</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="form-control border-start-0 border-end-0 ps-0"
              :class="passwordConfirm && password !== passwordConfirm ? 'is-invalid' : ''"
              placeholder="비밀번호 재입력"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="input-group-text bg-white border-start-0"
              @click="showPasswordConfirm = !showPasswordConfirm"
              tabindex="-1"
            >
              <i :class="showPasswordConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-muted"></i>
            </button>
          </div>
          <div v-if="passwordConfirm && password !== passwordConfirm" class="invalid-feedback d-block small">
            <i class="fa-solid fa-triangle-exclamation me-1"></i>비밀번호가 일치하지 않습니다.
          </div>
          <div v-if="passwordConfirm && password === passwordConfirm" class="text-success small mt-1">
            <i class="fa-solid fa-circle-check me-1"></i>비밀번호가 일치합니다.
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-gradient w-100 py-2 mb-3"
          :disabled="authStore.loading || !name || !email || !password || !passwordConfirm"
        >
          <span v-if="authStore.loading">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>처리 중…
          </span>
          <span v-else>
            <i class="fa-solid fa-user-plus me-2"></i>회원가입
          </span>
        </button>
      </form>

      <!-- 로그인 링크 -->
      <p class="text-center small text-muted mb-0">
        이미 계정이 있으신가요?
        <button type="button" class="btn btn-link btn-sm p-0 text-primary fw-semibold" @click="goLogin">
          로그인
        </button>
      </p>
    </div>
  </div>
</template>
