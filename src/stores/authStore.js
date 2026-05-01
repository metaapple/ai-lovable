import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios.js';

export const useAuthStore = defineStore('auth', () => {
  // localStorage에서 초기 상태 복원
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'));
  const loading = ref(false);
  const error = ref(null);

  const isLoggedIn = computed(() => !!user.value);

  // 로그인
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get('/users', { params: { email, password } });
      if (data.length === 0) {
        error.value = '이메일 또는 비밀번호가 올바르지 않습니다.';
        return false;
      }
      user.value = data[0];
      localStorage.setItem('auth_user', JSON.stringify(data[0]));
      return true;
    } catch (e) {
      error.value = '로그인 중 오류가 발생했습니다.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 회원가입
  const register = async (name, email, password) => {
    loading.value = true;
    error.value = null;
    try {
      // 이메일 중복 확인
      const { data: existing } = await api.get('/users', { params: { email } });
      if (existing.length > 0) {
        error.value = '이미 사용 중인 이메일입니다.';
        return false;
      }
      const { data: newUser } = await api.post('/users', { name, email, password });
      user.value = newUser;
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return true;
    } catch (e) {
      error.value = '회원가입 중 오류가 발생했습니다.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 로그아웃
  const logout = () => {
    user.value = null;
    localStorage.removeItem('auth_user');
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user, loading, error, isLoggedIn,
    login, register, logout, clearError,
  };
});
