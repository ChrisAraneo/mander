<script setup lang="ts">
import { noop } from 'lodash-es';
import { match } from 'ts-pattern';
import { onMounted, onUnmounted, ref } from 'vue';
import { formatRunLabel } from '../game/format';
import type { RunRecord } from '../game/storage';
import { useArchive } from '../game/use-archive';
import {
  handleReplayToggle,
  patchReplaySpeed,
  startReplay,
  type ReplaySession,
} from '../game/use-replay';
import ReplayBar from './ReplayBar.vue';

const props = defineProps<{ run: RunRecord }>();
const emit = defineEmits<{ exit: [] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const replay = useArchive(
  { id: props.run.id, day: props.run.day, replay: props.run.replay },
  canvas,
);

const {
  isPaused,
  isFinished,
  speed,
  progress,
  elapsedSeconds,
  durationSeconds,
} = replay;

const handleToggle = (): ReplaySession => handleReplayToggle(replay);

const handleSpeed = (): ReplaySession => patchReplaySpeed(replay);

const handleRestart = (): ReplaySession => startReplay(replay);

const handleKeyDown = (event: KeyboardEvent): ReplaySession | void =>
  match({ repeat: event.repeat, code: event.code })
    .with({ repeat: false, code: 'Space' }, () => handleReplayToggle(replay))
    .with({ repeat: false, code: 'Escape' }, () => emit('exit'))
    .otherwise(noop);

const watchKeys = (): void => window.addEventListener('keydown', handleKeyDown);

const unwatchKeys = (): void =>
  window.removeEventListener('keydown', handleKeyDown);

onMounted(watchKeys);
onUnmounted(unwatchKeys);
</script>

<template>
  <div class="archive-view">
    <canvas ref="canvas" class="stage" />

    <ReplayBar
      :world-name="run.name"
      :label="formatRunLabel(run)"
      :is-paused="isPaused"
      :is-finished="isFinished"
      :speed="speed"
      :progress="progress"
      :elapsed-seconds="elapsedSeconds"
      :duration-seconds="durationSeconds"
      @toggle="handleToggle"
      @speed="handleSpeed"
      @restart="handleRestart"
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
