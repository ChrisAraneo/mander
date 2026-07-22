<script setup lang="ts">
import type { Item } from '@mander/generator';

defineProps<{ items: Item[] }>();
defineEmits<{ choose: [index: number]; close: [] }>();
</script>

<template>
  <div class="overlay">
    <div class="panel chest-panel">
      <h2>The chest creaks open…</h2>
      <p>Choose one treasure to keep.</p>

      <div class="cards">
        <button
          v-for="(item, index) in items"
          :key="index"
          class="card"
          :class="item.rarity"
          @click="$emit('choose', index)"
        >
          <span class="rarity">{{ item.rarity }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="description">{{ item.description }}</span>
        </button>
      </div>

      <button class="ghost" @click="$emit('close')">Leave it for now (Esc)</button>
    </div>
  </div>
</template>

<style scoped>
.chest-panel {
  max-width: 860px;
}

.cards {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 18px 0;
}

.card {
  width: 150px;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 12px;
  border-radius: 12px;
  background: #141a28;
  border: 1px solid #33445a;
  color: inherit;
  text-align: center;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-4px);
}

.card.common:hover,
.card.common:focus-visible {
  border-color: #6faf8f;
  box-shadow: 0 8px 24px rgba(111, 175, 143, 0.25);
}

.card.rare {
  border-color: #2e5f88;
}

.card.rare:hover,
.card.rare:focus-visible {
  border-color: #7fc3ff;
  box-shadow: 0 8px 24px rgba(127, 195, 255, 0.25);
}

.card.epic {
  border-color: #6a4a9e;
}

.card.epic:hover,
.card.epic:focus-visible {
  border-color: #c9a2ff;
  box-shadow: 0 8px 24px rgba(201, 162, 255, 0.3);
}

.rarity {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #9fb0c3;
}

.card.rare .rarity {
  color: #7fc3ff;
}

.card.epic .rarity {
  color: #c9a2ff;
}

.name {
  font-weight: 700;
  color: #e8eef6;
}

.description {
  font-size: 12.5px;
  line-height: 1.45;
  color: #9fb0c3;
}
</style>
