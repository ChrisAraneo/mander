<script setup lang="ts">
import { tap } from 'lodash-es';
import { ref } from 'vue';
import ArchiveView from './components/ArchiveView.vue';
import GameView from './components/GameView.vue';
import StartScreen from './components/StartScreen.vue';
import { patchRef } from './game/canvas';
import type { RunRecord } from './game/storage';

const activeDay = ref<string | null>(null);
const activeStructure = ref<string | null>(null);
const watched = ref<RunRecord | null>(null);

const handleStart = (
  day: string,
  structureName: string | null,
): string | null =>
  tap(patchRef(activeDay, day), () => patchRef(activeStructure, structureName));

const handleWatch = (run: RunRecord): RunRecord | null =>
  patchRef(watched, run);

const handleGameExit = (): string | null =>
  tap(patchRef(activeDay, null), () => patchRef(activeStructure, null));

const handleArchiveExit = (): RunRecord | null => patchRef(watched, null);
</script>

<template>
  <main class="app">
    <ArchiveView
      v-if="watched"
      :key="watched.id"
      :run="watched"
      @exit="handleArchiveExit" />
    <GameView
      v-else-if="activeDay !== null"
      :key="`${activeDay}:${activeStructure ?? ''}`"
      :day="activeDay"
      :structure-name="activeStructure"
      @exit="handleGameExit" />
    <StartScreen v-else @start="handleStart" @watch="handleWatch" />
  </main>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}
</style>
