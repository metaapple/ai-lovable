<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

const props = defineProps({ data: Object, title: String });
const chartEl = ref(null);
let chart = null;
let resizeObs = null;
let loaded = false;

const draw = () => {
  if (!window.google?.visualization || !chartEl.value) return;
  const entries = Object.entries(props.data || {});
  if (!entries.length) {
    chartEl.value.innerHTML =
      '<div class="text-center text-muted py-5"><i class="fa-solid fa-circle-info me-1"></i>표시할 지출 데이터가 없습니다.</div>';
    return;
  }
  const rows = [['카테고리', '금액'], ...entries];
  const dataTable = window.google.visualization.arrayToDataTable(rows);
  const options = {
    pieHole: 0.55,
    legend: { position: 'right', textStyle: { fontSize: 13, color: '#475569' } },
    chartArea: { width: '92%', height: '88%' },
    backgroundColor: 'transparent',
    pieSliceBorderColor: 'transparent',
    pieSliceTextStyle: { color: '#fff', fontSize: 12, bold: true },
    colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
    tooltip: { textStyle: { fontSize: 13 } }
  };
  if (!chart) chart = new window.google.visualization.PieChart(chartEl.value);
  chart.draw(dataTable, options);
};

const ensureLoadedAndDraw = () => {
  if (loaded) return draw();
  window.google.charts.load('current', { packages: ['corechart'] });
  window.google.charts.setOnLoadCallback(() => { loaded = true; draw(); });
};

onMounted(() => {
  ensureLoadedAndDraw();
  resizeObs = new ResizeObserver(() => draw());
  resizeObs.observe(chartEl.value);
  window.addEventListener('resize', draw);
});
onBeforeUnmount(() => {
  resizeObs?.disconnect();
  window.removeEventListener('resize', draw);
});
watch(() => props.data, () => nextTick(draw), { deep: true });
</script>

<template>
  <div class="card chart-card chart-card--gradient p-3 h-100">
    <h6 class="fw-bold mb-3">
      <i class="fa-solid fa-chart-pie me-2 text-primary"></i>{{ title }}
    </h6>
    <div ref="chartEl" class="chart-host"></div>
  </div>
</template>

<style scoped>
.chart-host { width: 100%; min-height: 320px; height: clamp(280px, 38vw, 380px); }
</style>
