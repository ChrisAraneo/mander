<script setup lang="ts">
import { computed, ref } from 'vue';
import { LEVELS_PER_SEED } from '@mander/generator';
import { useGame } from '../game/use-game';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../game/render';
import ChestModal from './ChestModal.vue';
import HudBar from './HudBar.vue';

const props = defineProps<{ seed: string }>();
defineEmits<{ exit: [] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const { state, dispatch, nextLevel } = useGame(props.seed, canvas);

const isRunFinished = computed(
  () =>
    state.value.status === 'complete' &&
    state.value.levelIndex >= LEVELS_PER_SEED - 1,
);

const hint = computed(() => {
  if (state.value.status !== 'playing') return null;
  if (state.value.isNearChest) {
    return state.value.hasKey
      ? 'Press E to open the chest'
      : 'The chest is locked — find the key!';
  }
  if (state.value.isNearPortal) return 'Press E to enter the portal';
  return null;
});
</script>

<template>
  <div class="game-view">
    <HudBar :state="state" :seed="seed" @exit="$emit('exit')" />

    <div class="stage">
      <canvas ref="canvas" :width="VIEW_WIDTH" :height="VIEW_HEIGHT"></canvas>

      <p v-if="hint" class="hint">{{ hint }}</p>

      <ChestModal
        v-if="state.status === 'chest'"
        :items="state.level.chestItems"
        @choose="(index) => dispatch({ type: 'CHOOSE_ITEM', index })"
        @close="dispatch({ type: 'CLOSE' })" />

      <div v-if="state.status === 'complete'" class="overlay">
        <div v-if="isRunFinished" class="panel">
          <h2>Run complete!</h2>
          <p>
            All {{ LEVELS_PER_SEED }} levels of “{{ seed }}” are behind you.
          </p>
          <button class="primary" @click="$emit('exit')">
            Back to the start
          </button>
        </div>
        <div v-else class="panel">
          <h2>Level {{ state.levelIndex + 1 }} complete!</h2>
          <p>The portal hums and pulls you onward.</p>
          <button class="primary" @click="nextLevel">
            Enter level {{ state.levelIndex + 2 }}
          </button>
        </div>
      </div>
    </div>

    <p class="controls">
      A / D or ◀ ▶ move · W / Space jump · E interact · Esc close · R respawn
    </p>
  </div>
</template>

<style scoped>
.game-view {
  width: min(960px, 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stage {
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  border: 1px solid #33445a;
  background: #1b2033;
}

.hint {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  margin: 0;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(12, 16, 26, 0.82);
  border: 1px solid #ffd166;
  color: #ffd166;
  font-size: 14px;
  pointer-events: none;
}

.controls {
  margin: 0;
  text-align: center;
  color: #64758a;
  font-size: 13px;
}
</style>
