<script setup lang="ts">
import { computed } from 'vue';
import { match } from 'ts-pattern';
import { formatClock } from '../game/format';

const props = defineProps<{
  worldName: string;
  label?: string;
  isPaused: boolean;
  isFinished: boolean;
  speed: number;
  progress: number;
  elapsedSeconds: number;
  durationSeconds: number;
}>();

defineEmits<{ toggle: []; speed: []; restart: []; close: [] }>();

const elapsed = computed(() => formatClock(props.elapsedSeconds));
const duration = computed(() => formatClock(props.durationSeconds));
const percent = computed(() => `${props.progress * 100}%`);

const toggleLabel = computed(() =>
  match({ finished: props.isFinished, paused: props.isPaused })
    .with({ finished: true }, () => '↻ Play again')
    .with({ paused: true }, () => '▶ Resume')
    .otherwise(() => '❚❚ Pause'),
);
</script>

<template>
  <div class="replay-layer">
    <header class="replay-head">
      <span class="badge">● REPLAY</span>
      <span class="chip">World {{ worldName }}</span>
      <span v-if="label" class="chip run">{{ label }}</span>
      <span v-if="isFinished" class="chip done">Finished</span>
      <span v-else-if="isPaused" class="chip">Paused</span>
    </header>

    <footer class="replay-foot">
      <div class="track">
        <div class="fill" :style="{ width: percent }" />
      </div>

      <div class="controls">
        <span class="clock">{{ elapsed }} / {{ duration }}</span>
        <button class="ghost" @click="$emit('toggle')">
          {{ toggleLabel }}
        </button>
        <button class="ghost" @click="$emit('speed')">{{ speed }}×</button>
        <button class="ghost" @click="$emit('restart')">↺ Restart</button>
        <button class="primary" @click="$emit('close')">Close</button>
        <span class="keys">Space · Esc</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.replay-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 16px;
  pointer-events: none;
}

.replay-head,
.replay-foot {
  pointer-events: auto;
}

.replay-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(51, 68, 90, 0.8);
  background: rgba(12, 16, 26, 0.72);
  backdrop-filter: blur(6px);
}

.badge {
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 13px;
  color: #ff5470;
}

.chip {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid #33445a;
  color: #9fb0c3;
  font-size: 13px;
}

.chip.done {
  color: #ffd166;
  border-color: #8a6d2f;
}

.chip.run {
  color: #e8eef6;
}

.replay-foot {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  gap: 8px;
  max-width: 100%;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(51, 68, 90, 0.8);
  background: rgba(12, 16, 26, 0.78);
  backdrop-filter: blur(6px);
}

.track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: #23293a;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #f4762c;
  transition: width 0.08s linear;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.clock {
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 14px;
  color: #ffd166;
  min-width: 92px;
  text-align: center;
}

.keys {
  color: #64758a;
  font-size: 12px;
}
</style>
