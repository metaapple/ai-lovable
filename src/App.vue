<script setup>
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-2 col-md-3 sidebar p-3">
        <h4 class="mb-4 fw-bold text-primary">
          <i class="fa-solid fa-wallet me-2"></i>가계부
        </h4>
        <nav class="nav flex-column">
          <RouterLink to="/" class="nav-link">
            <i class="fa-solid fa-chart-pie me-2"></i>대시보드
          </RouterLink>
          <RouterLink to="/transactions" class="nav-link">
            <i class="fa-solid fa-receipt me-2"></i>거래내역
          </RouterLink>
        </nav>
      </aside>
      <main class="col-lg-10 col-md-9 p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
