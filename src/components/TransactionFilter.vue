<script setup>
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '../stores/transactionStore.js';

const store = useTransactionStore();
const { filterMonth, filterType, filterCategory, filterKeyword, allCategories, availableMonths, filteredItems } =
  storeToRefs(store);
</script>

<template>
  <div class="card chart-card p-3">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h6 class="fw-bold mb-0">
        <i class="fa-solid fa-filter me-2 text-primary"></i>거래 필터
      </h6>
      <span class="badge bg-primary-subtle text-primary-emphasis">
        {{ filteredItems.length }}건
      </span>
    </div>
    <div class="row g-2">
      <div class="col-md-3">
        <select class="form-select form-select-sm" v-model="filterMonth">
          <option value="">전체 월</option>
          <option v-for="m in availableMonths" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-select form-select-sm" v-model="filterType">
          <option value="all">전체 유형</option>
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select form-select-sm" v-model="filterCategory">
          <option value="all">전체 카테고리</option>
          <option v-for="c in allCategories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <div class="input-group input-group-sm">
          <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" class="form-control" placeholder="메모/카테고리 검색" v-model="filterKeyword" />
        </div>
      </div>
      <div class="col-md-1 d-grid">
        <button class="btn btn-sm btn-outline-secondary" @click="store.resetFilters()" title="초기화">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
  </div>
</template>
