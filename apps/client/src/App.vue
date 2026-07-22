<script setup lang="ts">
import { ref } from 'vue';
import StartScreen from './components/StartScreen.vue';
import GameView from './components/GameView.vue';

const activeSeed = ref<string | null>(null);
</script>

<template>
  <main class="app">
    <StartScreen v-if="activeSeed === null" @start="activeSeed = $event" />
    <GameView
      v-else
      :key="activeSeed"
      :seed="activeSeed"
      @exit="activeSeed = null" />
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
