<script setup lang="ts">
import { ref } from 'vue';
import ArchiveView from './components/ArchiveView.vue';
import GameView from './components/GameView.vue';
import StartScreen from './components/StartScreen.vue';
import { patchRef } from './game/canvas';
import type { RunRecord } from './game/storage';

const activeDay = ref<string | null>(null);
const watched = ref<RunRecord | null>(null);

const handleStart = (day: string): string | null => patchRef(activeDay, day);

const handleWatch = (run: RunRecord): RunRecord | null =>
  patchRef(watched, run);

const handleGameExit = (): string | null => patchRef(activeDay, null);

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
      :key="activeDay"
      :day="activeDay"
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
