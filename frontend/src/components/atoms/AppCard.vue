<script setup lang="ts">
</script>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  @apply bg-card border border-border rounded-2xl;
}
</style>
