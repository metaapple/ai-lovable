# 가계부 대시보드 (Vue3 + json-server)

## 기술 스택
- Vue 3 (Composition API, `<script setup>`)
- Pinia (상태관리, `src/stores/transactionStore.js`)
- Vue Router 4
- Axios (`src/api/axios.js`)
- json-server (mock REST API)
- Bootstrap 5
- Google Charts (Pie, Column)
- Font Awesome 6 (CDN)

## 실행 방법
```bash
npm install
npm run dev
```
- 클라이언트: http://localhost:5173
- json-server: http://localhost:3001/transactions

## 폴더 구조
```
src/
├── api/axios.js              # axios 인스턴스 (baseURL: localhost:3001)
├── stores/transactionStore.js# Pinia - json-server CRUD 연결
├── router/index.js
├── components/
│   ├── StatCard.vue
│   ├── PieChart.vue          # Google Charts - 카테고리별 지출
│   └── TrendChart.vue        # Google Charts - 월별 추이
├── views/
│   ├── Dashboard.vue
│   └── Transactions.vue
├── App.vue
├── main.js
└── style.css
```
