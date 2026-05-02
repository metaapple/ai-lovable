# 가계부 대시보드 (Vue3 + json-server)

<br>

<img width="1536" height="1024" alt="KakaoTalk_Photo_2026-05-02-10-43-41" src="https://github.com/user-attachments/assets/0169a13f-043f-4260-8f67-867923b81326" />


<br>

<img width="1392" height="985" alt="스크린샷 2026-05-01 22 32 25" src="https://github.com/user-attachments/assets/dc9dc907-560b-41c6-84dc-72ce1e08eb02" />


<br>

## 동영상 DEMO
<p align="center">
  <a href="https://youtu.be/u60fgGPOfDE">
    <img src="https://img.youtube.com/vi/u60fgGPOfDE/0.jpg" width="700">
  </a>
</p>


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
