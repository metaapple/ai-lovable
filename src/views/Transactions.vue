<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '../stores/transactionStore.js';
import TransactionForm from '../components/TransactionForm.vue';
import TransactionFilter from '../components/TransactionFilter.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const store = useTransactionStore();
const { filteredItems, loading } = storeToRefs(store);

onMounted(() => store.fetchAll());

const fmt = (n) => new Intl.NumberFormat('ko-KR').format(n || 0);

const editing = ref(null);
const startEdit = (t) => {
  editing.value = { ...t };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const onSaved = () => { editing.value = null; };
const onCancel = () => { editing.value = null; };

const pendingDelete = ref(null);
const confirmDelete = async () => {
  const id = pendingDelete.value?.id;
  if (!id) return;
  await store.removeTransaction(id);
  if (editing.value?.id === id) editing.value = null;
  pendingDelete.value = null;
};
</script>

<template>
  <div>
    <h3 class="fw-bold mb-4">거래내역</h3>

    <div class="mb-4">
      <TransactionForm :editing="editing" @saved="onSaved" @cancel="onCancel" />
    </div>

    <div class="mb-3">
      <TransactionFilter />
    </div>

    <div class="card chart-card p-3">
      <div v-if="loading" class="text-center py-4 text-muted">
        <i class="fa-solid fa-spinner fa-spin me-2"></i>불러오는 중...
      </div>
      <div class="table-responsive" v-else>
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
                <button class="btn btn-sm btn-outline-danger" @click="pendingDelete = t" title="삭제">
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

    <ConfirmModal
      :show="!!pendingDelete"
      title="거래를 삭제할까요?"
      :message="pendingDelete
        ? `${pendingDelete.date} · ${pendingDelete.category} · ${fmt(pendingDelete.amount)}원 항목을 삭제합니다.`
        : ''"
      confirm-text="삭제"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
