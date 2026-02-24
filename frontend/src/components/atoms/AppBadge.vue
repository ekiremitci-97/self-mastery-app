<template>
  <span class="badge">
    <slot name="icon" />
    <slot />
  </span>
</template>

<style scoped>
.badge {
  @apply inline-flex items-center gap-1.5 px-4 py-2 rounded-pill
         bg-card-hover text-text-primary text-sm font-medium;
}
</style>
