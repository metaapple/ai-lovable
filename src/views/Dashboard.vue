<script setup>
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '../stores/transactionStore.js';
import StatCard from '../components/StatCard.vue';
import PieChart from '../components/PieChart.vue';
import TrendChart from '../components/TrendChart.vue';
import TransactionForm from '../components/TransactionForm.vue';
import TransactionFilter from '../components/TransactionFilter.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const store = useTransactionStore();
const {
  totalIncome, totalExpense, balance,
  expenseByCategory, monthlyTrend,
  monthlySummary, filteredItems, loading
} = storeToRefs(store);

onMounted(() => store.fetchAll());

const fmt = (n) => new Intl.NumberFormat('ko-KR').format(n || 0);

// 수정 상태
const editing = ref(null);
const startEdit = (t) => {
  editing.value = { ...t };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const onSaved = () => { editing.value = null; };
const onCancel = () => { editing.value = null; };

// 삭제 확인 모달
const pendingDelete = ref(null);
const askDelete = (t) => { pendingDelete.value = t; };
const confirmDelete = async () => {
  if (!pendingDelete.value) return;
  const id = pendingDelete.value.id;
  await store.removeTransaction(id);
  if (editing.value && editing.value.id === id) editing.value = null;
  pendingDelete.value = null;
};
const cancelDelete = () => { pendingDelete.value = null; };

const monthHint = computed(() =>
  `${monthlySummary.value.month} · ${monthlySummary.value.count}건`
);
</script>

<template>
  <div class="dashboard-wrap">
    <!-- Hero header -->
    <div class="hero-card p-4 p-md-4 mb-4">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <div class="badge bg-white bg-opacity-25 text-white mb-2">
            <i class="fa-solid fa-calendar-day me-1"></i>{{ monthlySummary.month }}
          </div>
          <h3 class="fw-bold mb-1 text-white">대시보드</h3>
          <p class="mb-0 text-white-50">이번 달 가계 흐름을 한눈에 확인하세요.</p>
        </div>
        <div class="text-white text-end">
          <div class="small text-white-50">이번 달 잔액</div>
          <div class="display-6 fw-bold">{{ fmt(monthlySummary.balance) }}<span class="fs-5 ms-1">원</span></div>
          <div class="small">
            <span class="me-2"><i class="fa-solid fa-arrow-down me-1"></i>{{ fmt(monthlySummary.income) }}</span>
            <span><i class="fa-solid fa-arrow-up me-1"></i>{{ fmt(monthlySummary.expense) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <StatCard label="총 수입" :value="totalIncome" icon="fa-solid fa-arrow-down" variant="income"
                  :hint="`이번 달 ${fmt(monthlySummary.income)}원`" />
      </div>
      <div class="col-md-4">
        <StatCard label="총 지출" :value="totalExpense" icon="fa-solid fa-arrow-up" variant="expense"
                  :hint="`이번 달 ${fmt(monthlySummary.expense)}원`" />
      </div>
      <div class="col-md-4">
        <StatCard label="잔액" :value="balance" icon="fa-solid fa-coins" variant="brand"
                  :hint="monthHint" />
      </div>
    </div>

    <!-- 거래 추가 / 수정 폼 -->
    <div class="mb-4">
      <TransactionForm :editing="editing" @saved="onSaved" @cancel="onCancel" />
    </div>

    <!-- 차트 -->
    <div class="row g-3 mb-4">
      <div class="col-lg-5">
        <PieChart :data="expenseByCategory" title="카테고리별 지출" />
      </div>
      <div class="col-lg-7">
        <TrendChart :data="monthlyTrend" title="월별 수입/지출" />
      </div>
    </div>

    <!-- 필터 -->
    <div class="mb-3">
      <TransactionFilter />
    </div>

    <!-- 거래 목록 -->
    <div class="card chart-card p-3">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h6 class="fw-bold mb-0">
          <i class="fa-solid fa-clock-rotate-left me-2 text-primary"></i>거래 내역
        </h6>
        <span v-if="loading" class="small text-muted">
          <i class="fa-solid fa-spinner fa-spin me-1"></i>동기화 중...
        </span>
      </div>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="text-muted small">
            <tr>
              <th>날짜</th><th>유형</th><th>카테고리</th><th>메모</th>
              <th class="text-end">금액</th><th class="text-end">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filteredItems" :key="t.id"
                :class="['txn-row', editing && editing.id === t.id && 'table-warning']">
              <td class="text-nowrap">{{ t.date }}</td>
              <td>
                <span :class="['badge', t.type === 'income' ? 'badge-income' : 'badge-expense']">
                  <i :class="t.type === 'income' ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up'"></i>
                  {{ t.type === 'income' ? '수입' : '지출' }}
                </span>
              </td>
              <td>{{ t.category }}</td>
              <td class="text-muted">{{ t.memo }}</td>
              <td :class="['text-end', 'fw-semibold', t.type === 'income' ? 'text-success' : 'text-danger']">
                {{ t.type === 'income' ? '+' : '-' }}{{ fmt(t.amount) }}원
              </td>
              <td class="text-end text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-1" @click="startEdit(t)" title="수정">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="askDelete(t)" title="삭제">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="6" class="text-center text-muted py-5">
                <i class="fa-solid fa-inbox fs-3 d-block mb-2 opacity-50"></i>
                조건에 맞는 거래가 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <ConfirmModal
      :show="!!pendingDelete"
      title="거래를 삭제할까요?"
      :message="pendingDelete
        ? `${pendingDelete.date} · ${pendingDelete.category} · ${fmt(pendingDelete.amount)}원 항목을 삭제합니다. 이 작업은 되돌릴 수 없습니다.`
        : ''"
      confirm-text="삭제"
      cancel-text="취소"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
.hero-card {
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  color: #fff;
  box-shadow: 0 18px 40px -18px rgba(99, 102, 241, .55);
  position: relative;
  overflow: hidden;
}
.hero-card::after {
  content: '';
  position: absolute; right: -60px; top: -60px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(255,255,255,.25), transparent 70%);
}
</style>
