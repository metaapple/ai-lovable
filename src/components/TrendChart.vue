<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

const props = defineProps({ data: Array, title: String });
const chartEl = ref(null);
let chart = null;
let resizeObs = null;
let loaded = false;

const draw = () => {
  if (!window.google?.visualization || !chartEl.value) return;
  const arr = props.data || [];
  if (!arr.length) {
    chartEl.value.innerHTML =
      '<div class="text-center text-muted py-5"><i class="fa-solid fa-circle-info me-1"></i>표시할 월별 데이터가 없습니다.</div>';
    return;
  }
  const rows = [['월', '수입', '지출'], ...arr.map((d) => [d.month, d.income, d.expense])];
  const dataTable = window.google.visualization.arrayToDataTable(rows);
  const options = {
    legend: { position: 'top', alignment: 'end', textStyle: { color: '#475569' } },
    colors: ['#10b981', '#ef4444'],
    chartArea: { width: '88%', height: '70%' },
    backgroundColor: 'transparent',
    bar: { groupWidth: '55%' },
    hAxis: { textStyle: { color: '#64748b' } },
    vAxis: { format: 'short', textStyle: { color: '#64748b' }, gridlines: { color: '#e2e8f0' } },
    animation: { startup: true, duration: 600, easing: 'out' }
  };
  if (!chart) chart = new window.google.visualization.ColumnChart(chartEl.value);
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
      <i class="fa-solid fa-chart-column me-2 text-primary"></i>{{ title }}
    </h6>
    <div ref="chartEl" class="chart-host"></div>
  </div>
</template>

<style scoped>
.chart-host { width: 100%; min-height: 320px; height: clamp(280px, 38vw, 380px); }
</style>
