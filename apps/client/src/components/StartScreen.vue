<script setup lang="ts">
import { computed, ref } from 'vue';
import { match } from 'ts-pattern';
import { computeWorldName } from '@mander/generator';
import { clearSave, loadSave } from '../game/storage';
import { dailyDate } from '../game/use-game';

const emit = defineEmits<{ start: [day: string] }>();

const date = dailyDate();
/** What the generator will name today's world, read straight off the date. */
const worldName = computeWorldName(new Date(date));

const save = ref(loadSave());
const isContinuing = computed(() => save.value.lastSeed === date);

const startLabel = computed(() =>
  match(isContinuing.value)
    .with(true, () => "Continue today's run")
    .otherwise(() => "Start today's run"),
);

const pluralSuffix = (count: number): string =>
  match(count)
    .with(1, () => '')
    .otherwise(() => 's');

function resetSave(): void {
  clearSave();
  save.value = loadSave();
}
</script>

<template>
  <div class="start">
    <h1>MANDER</h1>

    <div class="daily-card">
      <span class="label">Today's world</span>
      <span class="world">World {{ worldName }}</span>
      <span class="hash">{{ date }}</span>
      <button class="primary" @click="emit('start', date)">
        {{ startLabel }}
      </button>
    </div>

    <div
      v-if="save.completedLevels.length || save.inventory.length"
      class="save-info">
      <p>
        {{ save.completedLevels.length }} level{{
          pluralSuffix(save.completedLevels.length)
        }}
        completed ·
        {{ save.inventory.length }} item{{
          pluralSuffix(save.inventory.length)
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

.world {
  font-size: 28px;
  font-weight: 700;
  color: #e8eef6;
  /* The name is a hash, so it has to be able to break rather than overflow. */
  overflow-wrap: anywhere;
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
