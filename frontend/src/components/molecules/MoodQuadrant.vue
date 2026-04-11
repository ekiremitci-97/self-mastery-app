<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QuadrantId } from '@self-mastery/shared';

const emit = defineEmits<{
  select: [quadrantId: QuadrantId];
}>();

const { t } = useI18n();

const hoveredZone = ref<QuadrantId | null>(null);

const zones: { id: QuadrantId; labelKey: string; position: string }[] = [
  { id: 'high-unpleasant', labelKey: 'quadrants.highUnpleasant', position: 'top-left' },
  { id: 'high-pleasant', labelKey: 'quadrants.highPleasant', position: 'top-right' },
  { id: 'low-unpleasant', labelKey: 'quadrants.lowUnpleasant', position: 'bottom-left' },
  { id: 'low-pleasant', labelKey: 'quadrants.lowPleasant', position: 'bottom-right' },
];

function handleSelect(id: QuadrantId) {
  emit('select', id);
}
</script>

<template>
  <div class="landscape">
    <div class="landscape__canvas">
      <!-- Bloom overlays — each zone's color intensifies when hovered -->
      <div :class="['bloom bloom--hu', { 'bloom--active': hoveredZone === 'high-unpleasant' }]" />
      <div :class="['bloom bloom--hp', { 'bloom--active': hoveredZone === 'high-pleasant' }]" />
      <div :class="['bloom bloom--lu', { 'bloom--active': hoveredZone === 'low-unpleasant' }]" />
      <div :class="['bloom bloom--lp', { 'bloom--active': hoveredZone === 'low-pleasant' }]" />

      <!-- Axis labels -->
      <span class="landscape__axis landscape__axis--top">{{ t('mood.axisHighEnergy') }}</span>
      <span class="landscape__axis landscape__axis--bottom">{{ t('mood.axisLowEnergy') }}</span>
      <span class="landscape__axis landscape__axis--left">{{ t('mood.axisUnpleasant') }}</span>
      <span class="landscape__axis landscape__axis--right">{{ t('mood.axisPleasant') }}</span>

      <!-- Tap zones -->
      <div class="landscape__zones">
        <button
          v-for="zone in zones"
          :key="zone.id"
          :class="[
            'landscape__zone',
            `landscape__zone--${zone.position}`,
          ]"
          @mouseenter="hoveredZone = zone.id"
          @mouseleave="hoveredZone = null"
          @touchstart.passive="hoveredZone = zone.id"
          @touchend="hoveredZone = null"
          @click="handleSelect(zone.id)"
        >
          <span
            :class="[
              'landscape__zone-label',
              { 'landscape__zone-label--visible': hoveredZone === zone.id },
            ]"
          >{{ t(zone.labelKey) }}</span>
        </button>
      </div>

      <!-- Center dot -->
      <div class="landscape__center">
        <div class="landscape__center-dot" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.landscape {
  @apply flex flex-col items-center w-full;
}

.landscape__canvas {
  @apply relative w-full overflow-hidden;
  aspect-ratio: 1;
  max-width: 340px;
  border-radius: 32px;

  /* Base mesh gradient — all zones at resting intensity */
  background:
    radial-gradient(ellipse at 15% 15%, rgba(232, 101, 90, 0.65), transparent 58%),
    radial-gradient(ellipse at 85% 15%, rgba(232, 169, 72, 0.65), transparent 58%),
    radial-gradient(ellipse at 15% 85%, rgba(139, 159, 212, 0.55), transparent 58%),
    radial-gradient(ellipse at 85% 85%, rgba(93, 196, 168, 0.60), transparent 58%),
    linear-gradient(135deg, #EAD8C8 0%, #E2DAD0 50%, #D6CFC2 100%);

  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.08),
    inset 0 0 60px rgba(255, 255, 255, 0.12);
}

/*
  Bloom layers — positioned at each quadrant's color origin.
  On hover, the layer fades in: that color intensifies + spreads,
  and a soft vignette darkens the other zones slightly.
*/
.bloom {
  @apply absolute pointer-events-none;
  width: 110%;
  height: 110%;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.45s ease;
}

.bloom--active {
  opacity: 1;
}

.bloom--hu {
  top: -30%;
  left: -30%;
  background:
    radial-gradient(ellipse at 40% 40%, rgba(232, 101, 90, 0.40), transparent 55%),
    radial-gradient(ellipse at 70% 70%, rgba(45, 45, 45, 0.06), transparent 70%);
}

.bloom--hp {
  top: -30%;
  right: -30%;
  left: auto;
  background:
    radial-gradient(ellipse at 60% 40%, rgba(232, 169, 72, 0.40), transparent 55%),
    radial-gradient(ellipse at 30% 70%, rgba(45, 45, 45, 0.06), transparent 70%);
}

.bloom--lu {
  bottom: -30%;
  left: -30%;
  top: auto;
  background:
    radial-gradient(ellipse at 40% 60%, rgba(139, 159, 212, 0.38), transparent 55%),
    radial-gradient(ellipse at 70% 30%, rgba(45, 45, 45, 0.06), transparent 70%);
}

.bloom--lp {
  bottom: -30%;
  right: -30%;
  top: auto;
  left: auto;
  background:
    radial-gradient(ellipse at 60% 60%, rgba(93, 196, 168, 0.38), transparent 55%),
    radial-gradient(ellipse at 30% 30%, rgba(45, 45, 45, 0.06), transparent 70%);
}

/* Axis labels */
.landscape__axis {
  @apply absolute text-[9px] font-medium uppercase tracking-[0.12em] pointer-events-none z-10;
  color: rgba(45, 45, 45, 0.35);
}

.landscape__axis--top {
  @apply top-3 left-1/2 -translate-x-1/2;
}

.landscape__axis--bottom {
  @apply bottom-3 left-1/2 -translate-x-1/2;
}

.landscape__axis--left {
  @apply left-3 top-1/2;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center;
}

.landscape__axis--right {
  @apply right-3 top-1/2;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
}

/* 2x2 tap grid */
.landscape__zones {
  @apply absolute inset-0 z-20;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.landscape__zone {
  @apply flex items-center justify-center cursor-pointer;
  background: transparent;
  border: none;
}

.landscape__zone--top-left { border-radius: 32px 0 0 0; }
.landscape__zone--top-right { border-radius: 0 32px 0 0; }
.landscape__zone--bottom-left { border-radius: 0 0 0 32px; }
.landscape__zone--bottom-right { border-radius: 0 0 32px 0; }

.landscape__zone:active {
  transform: scale(0.97);
}

/* Labels fade in from transparent + scale up slightly */
.landscape__zone-label {
  @apply text-xs font-semibold text-center leading-tight px-3;
  color: rgba(45, 45, 45, 0.0);
  white-space: pre-line;
  transition: color 0.35s ease, transform 0.35s ease;
  transform: scale(0.90);
}

.landscape__zone-label--visible {
  color: rgba(45, 45, 45, 0.82);
  transform: scale(1);
}

/* Center dot */
.landscape__center {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10;
}

.landscape__center-dot {
  @apply w-1.5 h-1.5 rounded-full;
  background: rgba(45, 45, 45, 0.10);
}
</style>
