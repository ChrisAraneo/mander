<script setup lang="ts">
import { computed, ref } from 'vue';
import { dailyDate, dailySeed } from '@mander/generator';
import { clearSave, loadSave } from '../game/storage';

const emit = defineEmits<{ start: [seed: string] }>();

const seed = dailySeed();
const date = dailyDate();

const save = ref(loadSave());
const isContinuing = computed(() => save.value.lastSeed === seed);

function resetSave(): void {
  clearSave();
  save.value = loadSave();
}
</script>

<template>
  <div class="start">
    <h1>MANDER</h1>
    <p class="tagline">
      One run a day. Eight levels, each harder than the last.
    </p>

    <div class="daily-card">
      <span class="label">Today's run</span>
      <span class="date">{{ date }}</span>
      <span class="hash" :title="`Run seed: ${seed}`">{{ seed }}</span>
      <button class="primary" @click="emit('start', seed)">
        {{ isContinuing ? "Continue today's run" : "Start today's run" }}
      </button>
    </div>

    <div
      v-if="save.completedLevels.length || save.inventory.length"
      class="save-info">
      <p>
        {{ save.completedLevels.length }} level{{
          save.completedLevels.length === 1 ? '' : 's'
        }}
        completed ·
        {{ save.inventory.length }} item{{
          save.inventory.length === 1 ? '' : 's'
        }}
        collected
      </p>
      <button class="ghost" @click="resetSave">Reset save</button>
    </div>

    <p class="controls">
      A / D move · Space jump · E interact · Esc close · R respawn
    </p>
  </div>
</template>

<style scoped>
.start {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: center;
}

h1 {
  font-size: 56px;
  letter-spacing: 14px;
  margin: 0;
  color: #f4762c;
  text-shadow: 0 4px 24px rgba(244, 118, 44, 0.35);
}

.tagline {
  margin: 0;
  color: #9fb0c3;
}

.daily-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 24px;
  border: 1px solid #33445a;
  border-radius: 14px;
  background: #10151f;
}

.label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #9fb0c3;
}

.date {
  font-size: 28px;
  font-weight: 700;
  color: #e8eef6;
}

.hash {
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 13px;
  color: #64758a;
}

.daily-card .primary {
  margin-top: 10px;
}

.save-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #33445a;
  border-radius: 10px;
  color: #9fb0c3;
  font-size: 14px;
}

.save-info p {
  margin: 0;
}

.controls {
  color: #64758a;
  font-size: 13px;
  margin: 0;
}
</style>
