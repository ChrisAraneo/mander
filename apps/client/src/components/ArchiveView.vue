<script setup lang="ts">
import type { PackedReplay } from '@mander/engine';
import { onMounted, onUnmounted, ref } from 'vue';
import { match } from 'ts-pattern';
import { useArchive } from '../game/use-archive';
import ReplayBar from './ReplayBar.vue';

const props = defineProps<{
  worldName: string;
  day: string;
  replay: PackedReplay;
}>();
const emit = defineEmits<{ exit: [] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const replay = useArchive({ day: props.day, replay: props.replay }, canvas);

const {
  isPaused,
  isFinished,
  speed,
  progress,
  elapsedSeconds,
  durationSeconds,
} = replay;

const onKeyDown = (event: KeyboardEvent): void =>
  match({ repeat: event.repeat, code: event.code })
    .with({ repeat: false, code: 'Space' }, () => replay.togglePause())
    .with({ repeat: false, code: 'Escape' }, () => emit('exit'))
    .otherwise(() => undefined);

onMounted(() => window.addEventListener('keydown', onKeyDown));
onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div class="archive-view">
    <canvas ref="canvas" class="stage" />

    <ReplayBar
      :world-name="worldName"
      :is-paused="isPaused"
      :is-finished="isFinished"
      :speed="speed"
      :progress="progress"
      :elapsed-seconds="elapsedSeconds"
      :duration-seconds="durationSeconds"
      @toggle="replay.togglePause()"
      @speed="replay.cycleSpeed()"
      @restart="replay.play()"
      @close="emit('exit')" />
  </div>
</template>

<style scoped>
.archive-view {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.stage {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: #1b2033;
}
</style>
