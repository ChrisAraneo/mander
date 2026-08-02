<script setup lang="ts">
import { ref } from 'vue';
import StartScreen from './components/StartScreen.vue';
import GameView from './components/GameView.vue';

const activeDay = ref<string | null>(null);
</script>

<template>
  <main class="app">
    <StartScreen v-if="activeDay === null" @start="activeDay = $event" />
    <GameView
      v-else
      :key="activeDay"
      :day="activeDay"
      @exit="activeDay = null" />
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
