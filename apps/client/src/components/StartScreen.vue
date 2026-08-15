<script setup lang="ts">
import { computed, ref } from 'vue';
import { orderBy } from 'lodash-es';
import { match } from 'ts-pattern';
import { computeWorldName } from '@mander/generator';
import { formatClock } from '../game/format';
import { clearSave, type CompletedWorld, loadSave } from '../game/storage';
import { useBackdrop } from '../game/use-backdrop';
import { dailyDate } from '../game/use-game';

const emit = defineEmits<{
  start: [day: string];
  watch: [world: CompletedWorld];
}>();

const date = dailyDate();
const worldName = computeWorldName(new Date(date));

const canvas = ref<HTMLCanvasElement | null>(null);

useBackdrop(date, canvas);

const save = ref(loadSave());

const finishedToday = computed(() =>
  save.value.completedWorlds.find((world) => world.name === worldName),
);

const finishedWorlds = computed(() =>
  orderBy(save.value.completedWorlds, ['day', 'name'], ['desc', 'asc']),
);

const pluralSuffix = (count: number): string =>
  match(count)
    .with(1, () => '')
    .otherwise(() => 's');

const formatScore = (score: number): string => score.toLocaleString('en-US');

const formatDay = (day: string): string =>
  match(day)
    .with('', () => 'day unknown')
    .otherwise((known) => known);

function resetSave(): void {
  clearSave();
  save.value = loadSave();
}
</script>

<template>
  <canvas ref="canvas" class="backdrop" aria-hidden="true" />

  <div class="overlay veil">
    <div class="start">
      <h1>MANDER</h1>

      <div class="daily-card">
        <span class="label">Today's world</span>
        <span class="world">World {{ worldName }}</span>
        <span class="hash">{{ date }}</span>
        <span v-if="finishedToday" class="finished"
          >✓ Finished · ★ {{ formatScore(finishedToday.score) }}</span
        >
        <button class="primary" @click="emit('start', date)">
          Start today's run
        </button>
      </div>

      <div v-if="finishedWorlds.length" class="save-info">
        <header class="save-head">
          <p>
            {{ finishedWorlds.length }} world{{
              pluralSuffix(finishedWorlds.length)
            }}
            finished
          </p>
          <button class="ghost" @click="resetSave">Reset save</button>
        </header>

        <ul class="world-list">
          <li v-for="world in finishedWorlds" :key="world.name" class="row">
            <span class="row-name" :title="world.name">{{ world.name }}</span>
            <span class="row-day">{{ formatDay(world.day) }}</span>
            <span class="row-score">★ {{ formatScore(world.score) }}</span>
            <span class="row-time">⏱ {{ formatClock(world.seconds) }}</span>
            <button
              v-if="world.replay"
              class="ghost row-watch"
              @click="emit('watch', world)">
              ▶ Replay
            </button>
            <span v-else class="row-watch none">no replay</span>
          </li>
        </ul>
      </div>

      <p class="controls">
        A / D move · W jump · E interact · Space star · X shoot · Esc close · R
        respawn
      </p>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: #1b2033;
}

.veil {
  position: fixed;
  overflow: auto;
  background: rgba(10, 13, 20, 0.45);
  backdrop-filter: blur(10px) saturate(1.15) brightness(1.25);
  -webkit-backdrop-filter: blur(10px) saturate(1.15) brightness(1.25);
}

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
  overflow-wrap: anywhere;
}

.hash {
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 13px;
  color: #64758a;
}

.finished {
  font-size: 13px;
  color: #ffd166;
}

.daily-card .primary {
  margin-top: 10px;
}

.save-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #33445a;
  border-radius: 10px;
  background: rgba(16, 21, 31, 0.72);
  color: #9fb0c3;
  font-size: 14px;
}

.save-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.save-info p {
  margin: 0;
}

.world-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 4px 10px;
  padding: 8px 10px;
  border: 1px solid #2a3648;
  border-radius: 8px;
  background: #10151f;
  text-align: left;
  font-size: 13px;
}

.row-name {
  grid-column: 1 / -1;
  color: #e8eef6;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.row-day {
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 12px;
  color: #64758a;
}

.row-score {
  color: #ffd166;
}

.row-time {
  font-family: 'Cascadia Mono', Consolas, monospace;
  color: #9fb0c3;
}

.row-watch {
  justify-self: end;
  padding: 4px 10px;
  font-size: 12px;
}

.row-watch.none {
  color: #4a5567;
  font-size: 12px;
}

.controls {
  color: #64758a;
  font-size: 13px;
  margin: 0;
}
</style>
