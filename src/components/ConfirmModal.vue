<script setup>
import { watch, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  show: Boolean,
  title: { type: String, default: '확인' },
  message: { type: String, default: '진행하시겠습니까?' },
  confirmText: { type: String, default: '삭제' },
  cancelText: { type: String, default: '취소' },
  variant: { type: String, default: 'danger' }
});
const emit = defineEmits(['confirm', 'cancel']);

const dialogEl = ref(null);
const onKey = (e) => { if (e.key === 'Escape' && props.show) emit('cancel'); };
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

watch(() => props.show, (v) => {
  document.body.style.overflow = v ? 'hidden' : '';
});
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="confirm-backdrop" @click.self="$emit('cancel')">
      <div ref="dialogEl" class="confirm-dialog card shadow-lg" role="dialog" aria-modal="true">
        <div class="p-4">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div :class="['confirm-icon', `bg-${variant}-soft`]">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h5 class="fw-bold mb-0">{{ title }}</h5>
          </div>
          <p class="text-muted mb-4">{{ message }}</p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-outline-secondary" @click="$emit('cancel')">{{ cancelText }}</button>
            <button :class="['btn', `btn-${variant}`]" @click="$emit('confirm')">
              <i class="fa-solid fa-trash me-1" v-if="variant === 'danger'"></i>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.confirm-backdrop {
  position: fixed; inset: 0; z-index: 1080;
  background: rgba(15, 23, 42, .55);
  backdrop-filter: blur(4px);
  display: grid; place-items: center; padding: 1rem;
}
.confirm-dialog {
  width: 100%; max-width: 420px; border: none; border-radius: 1rem;
  animation: pop .18s ease-out;
}
.confirm-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center; font-size: 1.1rem;
}
.bg-danger-soft { background: #fef2f2; color: #ef4444; }
.bg-warning-soft { background: #fffbeb; color: #f59e0b; }
.bg-primary-soft { background: #eef2ff; color: #4f46e5; }
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes pop { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
