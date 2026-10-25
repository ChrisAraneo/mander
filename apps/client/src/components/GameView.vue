<script setup lang="ts">
import {
  computeLevelScore,
  computeTotalTime,
  type GameState,
} from '@mander/engine';
import { last, noop, size, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { patchRef } from '../game/canvas';
import { formatClock, formatScore } from '../game/format';
import {
  addGameAction,
  startFirstLevel,
  startNextLevel,
  useGame,
} from '../game/use-game';
import {
  handleReplayToggle,
  patchReplaySpeed,
  startReplay,
  type ReplaySession,
  finishReplay,
} from '../game/use-replay';
import ChestModal from './ChestModal.vue';
import HudBar from './HudBar.vue';
import ReplayBar from './ReplayBar.vue';

const props = defineProps<{ day: string }>();
const emit = defineEmits<{ exit: [] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const game = useGame(props.day, canvas);
const { state, replay } = game;
const worldName = game.world.name;
const levelCount = size(game.world.levels);

const {
  isActive: isReplayActive,
  isPaused: isReplayPaused,
  isFinished: isReplayFinished,
  speed: replaySpeed,
  progress: replayProgress,
  elapsedSeconds: replayElapsed,
  durationSeconds: replayDuration,
} = replay;

const isRunFinished = computed(
  () =>
    state.value.status === 'COMPLETE' &&
    state.value.levelIndex >= levelCount - 1,
);

const score = computed(() => formatScore(state.value.score));

const levelSeconds = computed(() => last(state.value.levelTimes) ?? 0);

const levelClock = computed(() => formatClock(levelSeconds.value));

const levelGain = computed(() =>
  formatScore(computeLevelScore(levelSeconds.value)),
);

const runClock = computed(() =>
  formatClock(computeTotalTime(state.value.levelTimes)),
);

const hint = computed(() =>
  match(state.value.status)
    .with('PLAYING', () =>
      match(state.value.isNearChest)
        .with(true, () =>
          match(state.value.hasKey)
            .with(true, () => 'Press E to open the chest')
            .otherwise(() => 'The chest is locked — find the key!'),
        )
        .otherwise(() =>
          match(state.value.isNearPortal)
            .with(true, () => 'Press E to enter the portal')
            .otherwise(() => null),
        ),
    )
    .otherwise(() => null),
);

const handleCompleteConfirm = (): void =>
  match(isRunFinished.value)
    .with(true, () => emit('exit'))
    .otherwise(() => startNextLevel(game));

const handleConfirm = (): void =>
  match(state.value.status)
    .with('GAME_OVER', () => startFirstLevel(game))
    .otherwise(() => handleCompleteConfirm());

const handleChoose = (index: number): void =>
  addGameAction(game, { type: 'CHOOSE_ITEM', index });

const handleChestClose = (): void => addGameAction(game, { type: 'CLOSE' });

const handleNextLevel = (): void => startNextLevel(game);

const handleRestart = (): void => startFirstLevel(game);

const handleReplayPlay = (): ReplaySession => startReplay(replay);

const handleReplayStop = (): ReplaySession => finishReplay(replay);

const handleReplaySpeed = (): ReplaySession => patchReplaySpeed(replay);

const handleToggle = (): ReplaySession => handleReplayToggle(replay);

const isModalStatus = (status: GameState['status']): boolean =>
  status === 'COMPLETE' || status === 'GAME_OVER';

const isModalReady = ref(false);

const patchModalReady = (): boolean =>
  patchRef(isModalReady, isModalStatus(state.value.status));

const handleStatusChange = (status: GameState['status']): GameState['status'] =>
  pipe(
    status,
    (current) => tap(current, () => patchRef(isModalReady, false)),
    (current) =>
      match(isModalStatus(current))
        .with(true, () =>
          tap(current, () => requestAnimationFrame(patchModalReady)),
        )
        .otherwise(() => current),
  );

watch(() => state.value.status, handleStatusChange);

const handleModalKey = (event: KeyboardEvent): void =>
  match({
    active: isModalReady.value && isModalStatus(state.value.status),
    repeat: event.repeat,
    code: event.code,
  })
    .with({ active: true, repeat: false, code: 'Enter' }, () => handleConfirm())
    .with({ active: true, repeat: false, code: 'Escape' }, () => emit('exit'))
    .otherwise(noop);

const handleReplayKey = (event: KeyboardEvent): ReplaySession | void =>
  match({ repeat: event.repeat, code: event.code })
    .with({ repeat: false, code: 'Space' }, () => handleReplayToggle(replay))
    .with({ repeat: false, code: 'Escape' }, () => finishReplay(replay))
    .otherwise(noop);

const handleKeyDown = (event: KeyboardEvent): ReplaySession | void =>
  match(isReplayActive.value)
    .with(true, () => handleReplayKey(event))
    .otherwise(() => handleModalKey(event));

const watchKeys = (): void => window.addEventListener('keydown', handleKeyDown);

const unwatchKeys = (): void =>
  window.removeEventListener('keydown', handleKeyDown);

onMounted(watchKeys);
onUnmounted(unwatchKeys);
</script>

<template>
  <div class="game-view">
    <canvas ref="canvas" class="stage" />

    <div v-if="!isReplayActive" class="hud-layer">
      <HudBar
        :state="state"
        :day="day"
        :world-name="worldName"
        :level-count="levelCount"
        @exit="$emit('exit')" />

      <div class="foot">
        <p v-if="hint" class="hint">
          {{ hint }}
        </p>

        <p class="controls">
          A / D or ◀ ▶ move · W / ▲ jump · E interact · Space / Z / . star · X /
          / shoot · Enter confirm · Esc close · Backspace respawn
        </p>
      </div>
    </div>

    <ChestModal
      v-if="!isReplayActive && state.status === 'CHEST'"
      :items="state.level.chestItems"
      @choose="handleChoose"
      @close="handleChestClose" />

    <div v-if="!isReplayActive && state.status === 'COMPLETE'" class="overlay">
      <div v-if="isRunFinished" class="panel">
        <h2>Run complete!</h2>
        <p>
          All {{ levelCount }} levels of World {{ worldName }} are behind you.
        </p>
        <p class="score">★ {{ score }}</p>
        <p class="tally">Total time {{ runClock }}</p>
        <button class="primary" @click="$emit('exit')">
          Back to the start
        </button>
        <button class="ghost" @click="handleReplayPlay">▶ Watch replay</button>
      </div>
      <div v-else class="panel">
        <h2>Level {{ state.levelIndex + 1 }} complete!</h2>
        <p>The portal hums and pulls you onward.</p>
        <p class="score">★ {{ score }}</p>
        <p class="tally">
          Cleared in {{ levelClock }} · +{{ levelGain }} · run so far
          {{ runClock }}
        </p>
        <button class="primary" @click="handleNextLevel">
          Enter level {{ state.levelIndex + 2 }}
        </button>
      </div>
    </div>

    <div v-if="!isReplayActive && state.status === 'GAME_OVER'" class="overlay">
      <div class="panel">
        <h2>Out of hearts</h2>
        <p>
          World {{ worldName }} took the last of them on level
          {{ state.levelIndex + 1 }}. The run ends here.
        </p>
        <p class="score">★ {{ score }}</p>
        <button class="primary" @click="handleRestart">
          Start again from level 1
        </button>
        <button class="ghost" @click="handleReplayPlay">▶ Watch replay</button>
        <button class="ghost" @click="$emit('exit')">Back to the start</button>
      </div>
    </div>

    <ReplayBar
      v-if="isReplayActive"
      :world-name="worldName"
      :is-paused="isReplayPaused"
      :is-finished="isReplayFinished"
      :speed="replaySpeed"
      :progress="replayProgress"
      :elapsed-seconds="replayElapsed"
      :duration-seconds="replayDuration"
      @toggle="handleToggle"
      @speed="handleReplaySpeed"
      @restart="handleReplayPlay"
      @close="handleReplayStop" />
  </div>
</template>

<style scoped>
.game-view {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.stage {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: #1b2033;
}

.hud-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
  pointer-events: none;
}

.hud-layer > * {
  pointer-events: auto;
}

.foot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.hint {
  margin: 0;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(12, 16, 26, 0.82);
  border: 1px solid #ffd166;
  color: #ffd166;
  font-size: 14px;
}

.score {
  font-size: 24px;
  font-weight: 700;
  color: #ffd166;
}

.tally {
  margin-top: -8px;
  font-size: 13px;
  color: #9fb0c3;
}

.panel button + button {
  margin-left: 8px;
}

.controls {
  margin: 0;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(12, 16, 26, 0.6);
  text-align: center;
  color: #9fb0c3;
  font-size: 13px;
}
</style>
