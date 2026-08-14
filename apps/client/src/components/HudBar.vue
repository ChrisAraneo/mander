<script setup lang="ts">
import { computed } from 'vue';
import { range } from 'lodash-es';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';
import { type GameState, starCount } from '@mander/engine';
import { formatClock } from '../game/format';

const props = defineProps<{
  state: GameState;
  day: string;
  worldName: string;
  levelCount: number;
}>();
defineEmits<{ exit: [] }>();

const time = computed(() => formatClock(props.state.time));

const hearts = computed(() =>
  chain(Math.max(0, props.state.player.hearts.value))
    .thru((current) =>
      range(Math.max(current, 1)).map((index) => index < current),
    )
    .value(),
);

const stars = computed(() => starCount(props.state.inventory));

const shieldSeconds = computed(() => props.state.player.timers.invincibility);

const keyLabel = computed(() =>
  match(props.state.hasKey)
    .with(true, () => '🔑 Key found')
    .otherwise(() => '🔒 No key'),
);

const score = computed(() => props.state.score.toLocaleString('en-US'));
</script>

<template>
  <header class="hud">
    <div class="group">
      <span class="logo">MANDER</span>
      <span class="chip" :title="`${day} · level seed ${state.level.seed}`"
        >World {{ worldName }}</span
      >
      <span class="chip"
        >Level {{ state.levelIndex + 1 }}/{{ levelCount }}</span
      >
      <span class="chip">{{ time }}</span>
      <span class="chip score" title="Score">★ {{ score }}</span>
      <span class="chip hearts" title="Hearts">
        <span
          v-for="(filled, index) in hearts"
          :key="index"
          class="pip"
          :class="{ filled }"
          >♥</span
        >
      </span>
      <span
        v-if="stars > 0"
        class="chip stars"
        title="Press V to spend a star on 3s of invincibility"
        >★ {{ stars }} · V</span
      >
      <span
        v-if="shieldSeconds > 0"
        class="chip shield"
        title="Invincible right now"
        >🛡 {{ shieldSeconds.toFixed(1) }}s</span
      >
      <span v-if="state.deaths > 0" class="chip deaths"
        >✕ {{ state.deaths }}</span
      >
      <span class="chip key" :class="{ found: state.hasKey }">
        {{ keyLabel }}
      </span>
      <span class="" title="Update Time"
        >⏱ {{ (1000.0 / state.updateTime).toFixed(2) }} ms</span
      >
    </div>

    <div class="group">
      <button class="ghost" @click="$emit('exit')">Exit</button>
    </div>
  </header>
</template>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(51, 68, 90, 0.8);
  background: rgba(12, 16, 26, 0.72);
  backdrop-filter: blur(6px);
}

.group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.logo {
  font-weight: 700;
  letter-spacing: 4px;
  color: #f4762c;
}

.chip {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid #33445a;
  color: #9fb0c3;
  font-size: 13px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hearts {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 10px;
  border-color: #5a3344;
}

.pip {
  font-size: 14px;
  line-height: 1;
  color: #4a2f3a;
}

.pip.filled {
  color: #ff5470;
  text-shadow: 0 0 6px rgba(255, 84, 112, 0.5);
}

.score {
  color: #ffd166;
  border-color: #8a6d2f;
}

.stars {
  color: #ffc93c;
  border-color: #8a6d2f;
}

.shield {
  color: #7be8ff;
  border-color: #2e5f88;
}

.deaths {
  color: #ff8f8f;
  border-color: #5a3344;
}

.key {
  color: #8a7a55;
  border-color: #4a4232;
}

.key.found {
  color: #ffd166;
  border-color: #8a6d2f;
}
</style>
