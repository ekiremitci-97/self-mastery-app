<script setup lang="ts">
import { GuruChat } from '@/components/organisms';
</script>

<template>
  <div class="guru-view">
    <GuruChat />
  </div>
</template>

<style scoped>
.guru-view {
  @apply w-full flex flex-col;
  flex: 1;
  min-height: 0;
}
</style>

<style>
/* Override scoped MainLayout styles — !important needed to beat [data-v-*] specificity */
.main-layout:has(.guru-view) {
  padding-top: 0 !important;
}

.main-layout__content:has(.guru-view) {
  overflow: hidden !important;
}

.main-layout__inner:has(.guru-view) {
  flex: 1 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  min-height: 0 !important;
  align-items: stretch !important;
}
</style>
