<script setup lang="ts">
import { computed, ref } from 'vue';
import { LEVELS_PER_SEED } from '@mander/generator';
import { match } from 'ts-pattern';
import { useGame } from '../game/use-game';
import ChestModal from './ChestModal.vue';
import HudBar from './HudBar.vue';

const props = defineProps<{ seed: string }>();
defineEmits<{ exit: [] }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const { state, dispatch, nextLevel } = useGame(props.seed, canvas);

const isRunFinished = computed(
  () =>
    state.value.status === 'COMPLETE' &&
    state.value.levelIndex >= LEVELS_PER_SEED - 1,
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
</script>

<template>
  <div class="game-view">
    <canvas ref="canvas" class="stage" />

    <div class="hud-layer">
      <HudBar :state="state" :seed="seed" @exit="$emit('exit')" />

      <div class="foot">
        <p v-if="hint" class="hint">
          {{ hint }}
        </p>

        <p class="controls">
          A / D or ◀ ▶ move · W / Space jump · E interact · Esc close · R
          respawn
        </p>
      </div>
    </div>

    <ChestModal
      v-if="state.status === 'CHEST'"
      :items="state.level.chestItems"
      @choose="(index) => dispatch({ type: 'CHOOSE_ITEM', index })"
      @close="dispatch({ type: 'CLOSE' })" />

    <div v-if="state.status === 'COMPLETE'" class="overlay">
      <div v-if="isRunFinished" class="panel">
        <h2>Run complete!</h2>
        <p>All {{ LEVELS_PER_SEED }} levels of “{{ seed }}” are behind you.</p>
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
