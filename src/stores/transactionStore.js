import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios.js';

// json-server 연결 store - axios로 모든 CRUD 후 서버 재조회 → 차트/요약 자동 반영
export const useTransactionStore = defineStore('transactions', () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 필터 상태 (거래 목록 필터)
  const filterMonth = ref(''); // 'YYYY-MM' or '' = 전체
  const filterType = ref('all'); // 'all' | 'income' | 'expense'
  const filterCategory = ref('all');
  const filterKeyword = ref('');

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get('/transactions');
      items.value = data;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (payload) => {
    await api.post('/transactions', payload);
    await fetchAll(); // 자동 재로드
  };
  const updateTransaction = async (id, payload) => {
    await api.put(`/transactions/${id}`, payload);
    await fetchAll();
  };
  const removeTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    await fetchAll();
  };

  // ── 파생 상태 ───────────────────────────────
  const totalIncome = computed(() =>
    items.value.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  );
  const totalExpense = computed(() =>
    items.value.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  );
  const balance = computed(() => totalIncome.value - totalExpense.value);

  const expenseByCategory = computed(() => {
    const map = {};
    items.value
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });
    return map;
  });

  const monthlyTrend = computed(() => {
    const map = {};
    items.value.forEach((t) => {
      const m = (t.date || '').slice(0, 7);
      if (!m) return;
      if (!map[m]) map[m] = { income: 0, expense: 0 };
      map[m][t.type] += Number(t.amount);
    });
    return Object.keys(map).sort().map((k) => ({ month: k, ...map[k] }));
  });

  // 이번 달 자동 요약
  const currentMonth = computed(() => new Date().toISOString().slice(0, 7));
  const monthlySummary = computed(() => {
    const m = currentMonth.value;
    const monthItems = items.value.filter((t) => (t.date || '').startsWith(m));
    const income = monthItems.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expense = monthItems.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { month: m, income, expense, balance: income - expense, count: monthItems.length };
  });

  const allCategories = computed(() => {
    const set = new Set(items.value.map((t) => t.category).filter(Boolean));
    return Array.from(set).sort();
  });

  const availableMonths = computed(() => {
    const set = new Set(items.value.map((t) => (t.date || '').slice(0, 7)).filter(Boolean));
    return Array.from(set).sort().reverse();
  });

  // 필터링된 목록
  const filteredItems = computed(() => {
    const kw = filterKeyword.value.trim().toLowerCase();
    return items.value
      .filter((t) => (filterMonth.value ? (t.date || '').startsWith(filterMonth.value) : true))
      .filter((t) => (filterType.value === 'all' ? true : t.type === filterType.value))
      .filter((t) => (filterCategory.value === 'all' ? true : t.category === filterCategory.value))
      .filter((t) => (kw ? (t.memo || '').toLowerCase().includes(kw) || (t.category || '').toLowerCase().includes(kw) : true))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  });

  const resetFilters = () => {
    filterMonth.value = '';
    filterType.value = 'all';
    filterCategory.value = 'all';
    filterKeyword.value = '';
  };

  return {
    items, loading, error,
    filterMonth, filterType, filterCategory, filterKeyword,
    fetchAll, addTransaction, removeTransaction, updateTransaction,
    totalIncome, totalExpense, balance, expenseByCategory, monthlyTrend,
    monthlySummary, allCategories, availableMonths, filteredItems, resetFilters
  };
});
