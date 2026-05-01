<script setup>
import { ref, watch, computed } from 'vue';
import { useTransactionStore } from '../stores/transactionStore.js';

const props = defineProps({
  editing: { type: Object, default: null }
});
const emit = defineEmits(['saved', 'cancel']);

const store = useTransactionStore();
const today = () => new Date().toISOString().slice(0, 10);

const blank = () => ({
  type: 'expense',
  category: '식비',
  amount: null,
  date: today(),
  memo: ''
});

const form = ref(blank());
const errors = ref({});
const submitting = ref(false);
const serverError = ref('');

const isEdit = computed(() => !!props.editing);

const categories = computed(() =>
  form.value.type === 'income'
    ? ['급여', '용돈', '이자', '투자수익', '기타수입']
    : ['식비', '교통', '쇼핑', '주거', '여가', '의료', '교육', '통신', '기타']
);

// 수정 시 프리필드 — 깊은 복사로 원본 보호, 수정 모드 진입 시 모든 값 채움
watch(
  () => props.editing,
  (val) => {
    if (val) {
      form.value = {
        type: val.type || 'expense',
        category: val.category || categories.value[0],
        amount: Number(val.amount) || 0,
        date: val.date || today(),
        memo: val.memo || ''
      };
      errors.value = {};
      serverError.value = '';
    } else {
      form.value = blank();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => form.value.type,
  () => {
    if (!categories.value.includes(form.value.category)) {
      form.value.category = categories.value[0];
    }
  }
);

// ── 유효성 검사 강화 ─────────────────────────
const validate = () => {
  const e = {};
  // 금액
  const amt = Number(form.value.amount);
  if (form.value.amount === null || form.value.amount === '' || Number.isNaN(amt)) {
    e.amount = '금액을 입력하세요.';
  } else if (amt <= 0) {
    e.amount = '금액은 0보다 커야 합니다.';
  } else if (amt > 1_000_000_000) {
    e.amount = '금액이 너무 큽니다 (최대 10억).';
  } else if (!Number.isInteger(amt)) {
    e.amount = '금액은 정수여야 합니다.';
  }
  // 날짜
  if (!form.value.date) {
    e.date = '날짜를 선택하세요.';
  } else {
    const d = new Date(form.value.date);
    if (Number.isNaN(d.getTime())) e.date = '유효한 날짜가 아닙니다.';
    else if (d > new Date(today())) e.date = '미래 날짜는 입력할 수 없습니다.';
  }
  // 카테고리
  if (!form.value.category || !form.value.category.trim()) {
    e.category = '카테고리를 선택하세요.';
  }
  // 메모
  if ((form.value.memo || '').length > 100) {
    e.memo = '메모는 100자 이내로 입력하세요.';
  }
  errors.value = e;
  return Object.keys(e).length === 0;
};

const submit = async () => {
  serverError.value = '';
  if (!validate()) return;
  submitting.value = true;
  try {
    const payload = {
      type: form.value.type,
      category: form.value.category.trim(),
      amount: Number(form.value.amount),
      date: form.value.date,
      memo: (form.value.memo || '').trim()
    };
    if (isEdit.value) await store.updateTransaction(props.editing.id, payload);
    else await store.addTransaction(payload);
    form.value = blank();
    emit('saved');
  } catch (err) {
    serverError.value = err.message || '저장에 실패했습니다.';
  } finally {
    submitting.value = false;
  }
};

const cancel = () => {
  form.value = blank();
  errors.value = {};
  emit('cancel');
};
</script>

<template>
  <div class="card chart-card form-card p-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h6 class="fw-bold mb-0">
        <i :class="[isEdit ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-circle-plus', 'me-2 text-primary']"></i>
        {{ isEdit ? '거래 수정' : '거래 추가' }}
      </h6>
      <span v-if="isEdit" class="badge bg-warning-subtle text-warning-emphasis">
        <i class="fa-solid fa-pen me-1"></i>수정 모드
      </span>
    </div>

    <form @submit.prevent="submit" class="row g-3" novalidate>
      <div class="col-12">
        <div class="btn-group w-100 type-toggle" role="group">
          <input type="radio" class="btn-check" id="type-expense" value="expense" v-model="form.type" />
          <label class="btn btn-outline-danger" for="type-expense">
            <i class="fa-solid fa-arrow-up me-1"></i>지출
          </label>
          <input type="radio" class="btn-check" id="type-income" value="income" v-model="form.type" />
          <label class="btn btn-outline-success" for="type-income">
            <i class="fa-solid fa-arrow-down me-1"></i>수입
          </label>
        </div>
      </div>

      <div class="col-md-4">
        <label class="form-label small text-muted">날짜</label>
        <input type="date" :class="['form-control', errors.date && 'is-invalid']"
               :max="new Date().toISOString().slice(0,10)" v-model="form.date" />
        <div class="invalid-feedback">{{ errors.date }}</div>
      </div>

      <div class="col-md-4">
        <label class="form-label small text-muted">카테고리</label>
        <select :class="['form-select', errors.category && 'is-invalid']" v-model="form.category">
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <div class="invalid-feedback">{{ errors.category }}</div>
      </div>

      <div class="col-md-4">
        <label class="form-label small text-muted">금액 (원)</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fa-solid fa-won-sign"></i></span>
          <input type="number" min="1" step="1"
                 :class="['form-control', errors.amount && 'is-invalid']"
                 v-model.number="form.amount" placeholder="0" />
          <div class="invalid-feedback">{{ errors.amount }}</div>
        </div>
      </div>

      <div class="col-12">
        <label class="form-label small text-muted">
          메모 <span class="text-muted">({{ (form.memo || '').length }}/100)</span>
        </label>
        <input type="text" maxlength="100"
               :class="['form-control', errors.memo && 'is-invalid']"
               v-model="form.memo" placeholder="간단한 메모" />
        <div class="invalid-feedback">{{ errors.memo }}</div>
      </div>

      <div v-if="serverError" class="col-12">
        <div class="alert alert-danger py-2 mb-0 small">
          <i class="fa-solid fa-circle-exclamation me-1"></i>{{ serverError }}
        </div>
      </div>

      <div class="col-12 d-flex gap-2 justify-content-end">
        <button v-if="isEdit" type="button" class="btn btn-outline-secondary"
                @click="cancel" :disabled="submitting">
          취소
        </button>
        <button type="submit" class="btn btn-gradient" :disabled="submitting">
          <i v-if="submitting" class="fa-solid fa-spinner fa-spin me-1"></i>
          <i v-else :class="[isEdit ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus', 'me-1']"></i>
          {{ isEdit ? '수정 저장' : '추가하기' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card { border-radius: 1rem; }
.type-toggle .btn { font-weight: 600; }
</style>
