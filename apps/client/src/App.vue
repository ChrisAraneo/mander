<script setup lang="ts">
import { ref } from 'vue';
import type { CompletedWorld } from './game/storage';
import StartScreen from './components/StartScreen.vue';
import GameView from './components/GameView.vue';
import ArchiveView from './components/ArchiveView.vue';

const activeDay = ref<string | null>(null);
const watched = ref<CompletedWorld | null>(null);
</script>

<template>
  <main class="app">
    <ArchiveView
      v-if="watched?.replay"
      :key="`${watched.name}-replay`"
      :world-name="watched.name"
      :day="watched.day"
      :replay="watched.replay"
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
