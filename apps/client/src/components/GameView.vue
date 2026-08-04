<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { last } from 'lodash-es';
import { match } from 'ts-pattern';
import { type GameState, levelScore, totalTime } from '@mander/engine';
import { formatClock } from '../game/format';
import { useGame } from '../game/use-game';
import ChestModal from './ChestModal.vue';
import HudBar from './HudBar.vue';
import ReplayBar from './ReplayBar.vue';

const props = defineProps<{ day: string }>();
const emit = defineEmits<{ exit: [] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const { state, dispatch, nextLevel, restart, levelCount, worldName, replay } =
  useGame(props.day, canvas);

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

const score = computed(() => state.value.score.toLocaleString('en-US'));

const levelSeconds = computed(() => last(state.value.levelTimes) ?? 0);

const levelClock = computed(() => formatClock(levelSeconds.value));

const levelGain = computed(() =>
  levelScore(levelSeconds.value).toLocaleString('en-US'),
);

const runClock = computed(() => formatClock(totalTime(state.value.levelTimes)));

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

const confirmComplete = (): void =>
  match(isRunFinished.value)
    .with(true, () => emit('exit'))
    .otherwise(() => nextLevel());

const confirm = (): void =>
  match(state.value.status)
    .with('GAME_OVER', () => restart())
    .otherwise(() => confirmComplete());

const isModalStatus = (status: GameState['status']): boolean =>
  status === 'COMPLETE' || status === 'GAME_OVER';

const modalReady = ref(false);

watch(
  () => state.value.status,
  (status) => {
    modalReady.value = false;
    match(isModalStatus(status))
      .with(true, () =>
        requestAnimationFrame(() => {
          modalReady.value = isModalStatus(state.value.status);
        }),
      )
      .otherwise(() => undefined);
  },
);

const onModalKey = (event: KeyboardEvent): void =>
  match({
    active: modalReady.value && isModalStatus(state.value.status),
    repeat: event.repeat,
    code: event.code,
  })
    .with({ active: true, repeat: false, code: 'Enter' }, () => confirm())
    .with({ active: true, repeat: false, code: 'Escape' }, () => emit('exit'))
    .otherwise(() => undefined);

const onReplayKey = (event: KeyboardEvent): void =>
  match({ repeat: event.repeat, code: event.code })
    .with({ repeat: false, code: 'Space' }, () => replay.togglePause())
    .with({ repeat: false, code: 'Escape' }, () => replay.stop())
    .otherwise(() => undefined);

const onKeyDown = (event: KeyboardEvent): void =>
  match(isReplayActive.value)
    .with(true, () => onReplayKey(event))
    .otherwise(() => onModalKey(event));

onMounted(() => window.addEventListener('keydown', onKeyDown));
onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
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
          A / D or ◀ ▶ move · W / Space jump · E interact · Enter confirm · Esc
          close · R respawn
        </p>
      </div>
    </div>

    <ChestModal
      v-if="!isReplayActive && state.status === 'CHEST'"
      :items="state.level.chestItems"
      @choose="(index) => dispatch({ type: 'CHOOSE_ITEM', index })"
      @close="dispatch({ type: 'CLOSE' })" />

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
        <button class="ghost" @click="replay.play()">▶ Watch replay</button>
      </div>
      <div v-else class="panel">
        <h2>Level {{ state.levelIndex + 1 }} complete!</h2>
        <p>The portal hums and pulls you onward.</p>
        <p class="score">★ {{ score }}</p>
        <p class="tally">
          Cleared in {{ levelClock }} · +{{ levelGain }} · run so far
          {{ runClock }}
        </p>
        <button class="primary" @click="nextLevel">
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
        <button class="primary" @click="restart">
          Start again from level 1
        </button>
        <button class="ghost" @click="replay.play()">▶ Watch replay</button>
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
      @toggle="replay.togglePause()"
      @speed="replay.cycleSpeed()"
      @restart="replay.play()"
      @close="replay.stop()" />
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
