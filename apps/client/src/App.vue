<script setup lang="ts">
import { ref } from 'vue';
import type { RunRecord } from './game/storage';
import StartScreen from './components/StartScreen.vue';
import GameView from './components/GameView.vue';
import ArchiveView from './components/ArchiveView.vue';

const activeDay = ref<string | null>(null);
const watched = ref<RunRecord | null>(null);
</script>

<template>
  <main class="app">
    <ArchiveView
      v-if="watched"
      :key="watched.id"
      :run="watched"
      @exit="watched = null" />
    <GameView
      v-else-if="activeDay !== null"
      :key="activeDay"
      :day="activeDay"
      @exit="activeDay = null" />
    <StartScreen v-else @start="activeDay = $event" @watch="watched = $event" />
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
