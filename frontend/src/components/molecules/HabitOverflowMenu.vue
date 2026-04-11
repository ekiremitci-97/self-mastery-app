<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  streak: number;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [];
  delete: [];
  close: [];
}>();

const { t } = useI18n();

const handleClickOutside = (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.overflow-menu')) {
    emit('close');
  }
};

onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside, true);
  }, 0);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
</script>

<template>
  <div class="overflow-menu">
    <div v-if="streak > 0" class="overflow-menu__streak">
      <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
        <path d="M12 2c.5 3.5 4 6 4 10a4 4 0 1 1-8 0c0-4 3.5-6.5 4-10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ t('stats.streak', { count: streak }) }}
    </div>
    <button class="overflow-menu__item" @click="emit('edit')">
      <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
        <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 5l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      {{ t('habits.edit') }}
    </button>
    <button class="overflow-menu__item overflow-menu__item--danger" @click="emit('delete')">
      <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ t('habits.delete') }}
    </button>
  </div>
</template>

<style scoped>
.overflow-menu {
  @apply absolute right-0 top-full mt-1 z-20
         bg-card border border-border rounded-xl shadow-lg
         flex flex-col min-w-[140px] py-1;
}

.overflow-menu__streak {
  @apply flex items-center gap-1.5 px-3 py-1.5
         text-[11px] font-mono font-medium border-b border-border;
  color: #C4A96A;
}

.overflow-menu__item {
  @apply flex items-center gap-2 px-3 py-2 text-xs font-medium
         text-text-primary hover:bg-card-hover transition-colors cursor-pointer;
}

.overflow-menu__item--danger:hover {
  color: #E57373;
}
</style>
