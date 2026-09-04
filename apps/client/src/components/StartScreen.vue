<script setup lang="ts">
import { computed, ref } from 'vue';
import { isFinite, size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computeWorldName } from '@mander/generator';
import { formatClock, runLabel } from '../game/format';
import {
  loadSave,
  type PlayableWorld,
  playableWorlds,
  type RunRecord,
} from '../game/storage';
import { useBackdrop } from '../game/use-backdrop';
import { dailyDate } from '../game/use-game';

const { nonNullable, when } = P;

const emit = defineEmits<{
  start: [day: string];
  watch: [run: RunRecord];
}>();

const date = dailyDate();
const worldName = computeWorldName(new Date(date));

const canvas = ref<HTMLCanvasElement | null>(null);

useBackdrop(date, canvas);

const save = ref(loadSave());

const finishedToday = computed(() =>
  save.value.completedWorlds.find((world) => world.name === worldName),
);

const playedWorlds = computed(() => playableWorlds(save.value));

const opened = ref<string | null>(null);

const pluralSuffix = (count: number): string =>
  match(count)
    .with(1, () => '')
    .otherwise(() => 's');

const formatScore = (score: number): string => score.toLocaleString('en-US');

const formatDay = (day: string): string =>
  match(day)
    .with('', () => 'day unknown')
    .otherwise((known) => known);

const scoreOf = (world: PlayableWorld): string =>
  match(world.completed)
    .with(nonNullable, (run) => formatScore(run.score))
    .otherwise(() => '');

const clockOf = (world: PlayableWorld): string =>
  match(world.completed)
    .with(nonNullable, (run) => formatClock(run.seconds))
    .otherwise(() => '');

const isOpen = (world: PlayableWorld): boolean => opened.value === world.name;

const toggleRuns = (world: PlayableWorld): void => {
  opened.value = match(isOpen(world))
    .with(true, (): string | null => null)
    .otherwise(() => world.name);
};

const whenOf = (run: RunRecord): string =>
  match(new Date(run.playedAt).getTime())
    .with(when(isFinite), (time) =>
      new Date(time).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    )
    .otherwise(() => 'best run');
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

      <div v-if="playedWorlds.length" class="save-info">
        <header class="save-head">
          <p>
            {{ playedWorlds.length }} world{{
              pluralSuffix(playedWorlds.length)
            }}
            played
          </p>
        </header>

        <ul class="world-list">
          <li v-for="world in playedWorlds" :key="world.name" class="row">
            <span class="row-name" :title="world.name"
              >World {{ world.name }}</span
            >

            <div class="row-meta">
              <span class="row-day">{{ formatDay(world.day) }}</span>
              <template v-if="world.completed !== null">
                <span class="row-score">★ {{ scoreOf(world) }}</span>
                <span class="row-time">⏱ {{ clockOf(world) }}</span>
              </template>
              <span v-else class="row-open">unfinished</span>
              <span v-if="world.runs > 1" class="row-runs"
                >×{{ world.runs }}</span
              >
            </div>

            <div class="row-actions">
              <button
                v-if="world.day"
                class="ghost"
                @click="emit('start', world.day)">
                ▶ Play
              </button>
              <button
                v-if="world.replays.length"
                class="ghost"
                :aria-expanded="isOpen(world)"
                @click="toggleRuns(world)">
                ⟲ Replays ({{ size(world.replays) }})
              </button>
            </div>

            <ul v-if="isOpen(world)" class="run-list">
              <li v-for="run in world.replays" :key="run.id" class="run">
                <span class="run-outcome" :class="run.outcome.toLowerCase()">{{
                  runLabel(run)
                }}</span>

                <span class="run-meta">
                  <span class="run-score">★ {{ formatScore(run.score) }}</span>
                  <span class="run-time">⏱ {{ formatClock(run.seconds) }}</span>
                  <span class="run-when">{{ whenOf(run) }}</span>
                </span>

                <button class="ghost" @click="emit('watch', run)">
                  ▶ Watch
                </button>
              </li>
            </ul>
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
  max-height: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
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

.row-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 10px;
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

.row-open {
  color: #4a5567;
  font-size: 12px;
}

.row-runs {
  font-size: 12px;
  color: #64758a;
}

.row-actions {
  justify-self: end;
  display: flex;
  gap: 6px;
}

.row-actions .ghost {
  padding: 4px 10px;
  font-size: 12px;
}

.run-list {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 6px 0 0;
  padding: 8px 0 0;
  border-top: 1px solid #2a3648;
  list-style: none;
}

.run {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2px 10px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #161d2b;
}

.run-outcome {
  font-size: 12px;
  font-weight: 700;
  color: #9fb0c3;
}

.run-outcome.complete {
  color: #7ddf9a;
}

.run-outcome.game_over {
  color: #ff5470;
}

.run-meta {
  grid-column: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 10px;
  font-size: 12px;
}

.run-when {
  color: #64758a;
}

.run .ghost {
  grid-column: 2;
  grid-row: 1 / span 2;
  padding: 4px 10px;
  font-size: 12px;
}

.controls {
  color: #64758a;
  font-size: 13px;
  margin: 0;
}
</style>
