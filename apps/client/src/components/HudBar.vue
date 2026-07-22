<script setup lang="ts">
import { computed } from 'vue';
import { floor, padStart } from 'lodash-es';
import { LEVELS_PER_SEED } from '@mander/generator';
import type { GameState } from '@mander/engine';

const props = defineProps<{ state: GameState; seed: string }>();
defineEmits<{ exit: [] }>();

const time = computed(() => {
  const total = floor(props.state.time);
  const minutes = floor(total / 60);
  const seconds = padStart(String(total % 60), 2, '0');
  return `${minutes}:${seconds}`;
});
</script>

<template>
  <header class="hud">
    <div class="group">
      <span class="logo">MANDER</span>
      <span class="chip" :title="`Seed: ${seed}`">{{ seed }}</span>
      <span class="chip">Level {{ state.levelIndex + 1 }}/{{ LEVELS_PER_SEED }}</span>
      <span class="chip">{{ time }}</span>
      <span v-if="state.deaths > 0" class="chip deaths">✕ {{ state.deaths }}</span>
      <span class="chip key" :class="{ found: state.hasKey }">
        {{ state.hasKey ? '🔑 Key found' : '🔒 No key' }}
      </span>
    </div>

    <div class="group">
      <span v-if="state.inventory.length === 0" class="empty">No items yet</span>
      <span
        v-for="(item, index) in state.inventory"
        :key="index"
        class="item"
        :class="item.rarity"
        :title="item.description"
      >
        {{ item.name }}
      </span>
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

.empty {
  color: #64758a;
  font-size: 13px;
}

.item {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid;
}

.item.common {
  color: #a9c2b8;
  border-color: #3d5a4e;
}

.item.rare {
  color: #7fc3ff;
  border-color: #2e5f88;
}

.item.epic {
  color: #c9a2ff;
  border-color: #6a4a9e;
}
</style>
