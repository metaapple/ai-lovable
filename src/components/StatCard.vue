<script setup>
defineProps({
  label: String,
  value: Number,
  icon: String,
  variant: { type: String, default: 'brand' },
  hint: { type: String, default: '' }
});
const fmt = (n) => new Intl.NumberFormat('ko-KR').format(n || 0);
</script>

<template>
  <div :class="['card', 'stat-card', `stat-card--${variant}`, 'p-3', 'h-100']">
    <div class="d-flex align-items-center gap-3">
      <div :class="['icon', `bg-${variant}-soft`]">
        <i :class="icon"></i>
      </div>
      <div class="flex-grow-1">
        <div class="text-muted small">{{ label }}</div>
        <div class="fs-4 fw-bold lh-1">{{ fmt(value) }}<span class="fs-6 text-muted ms-1">원</span></div>
        <div v-if="hint" class="small text-muted mt-1">{{ hint }}</div>
      </div>
    </div>
    <div class="stat-glow" aria-hidden="true"></div>
  </div>
</template>
