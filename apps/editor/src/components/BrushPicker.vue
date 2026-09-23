<script setup lang="ts">
import type { Brush } from '../editor';
import { BRUSH_ROWS } from '../editor';
import CellSwatch from './CellSwatch.vue';

defineProps<{ brush: Brush }>();

const emit = defineEmits<{ pick: [brush: Brush] }>();
</script>

<template>
  <div class="rows">
    <div v-for="row in BRUSH_ROWS" :key="row[0].name" class="row">
      <div v-for="group in row" :key="group.name" class="group">
        <h3>{{ group.name }}</h3>
        <button
          v-for="option in group.brushes"
          :key="`${option.layer}-${option.value}`"
          type="button"
          class="brush"
          :class="{ active: option === brush }"
          @click="emit('pick', option)">
          <CellSwatch :value="option.value" :layer="option.layer" />
          <span class="label">{{ option.label }}</span>
          <kbd>{{ option.shortcut }}</kbd>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 0;
  min-width: 0;
}

h3 {
  margin: 0 0 2px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #4c5a6e;
  font-weight: 600;
}

.brush {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 9px;
  border: 1px solid #33445a;
  background: transparent;
  color: #9fb0c3;
  text-align: left;
}

.brush:hover {
  border-color: #9fb0c3;
  color: #e8eef6;
}

.brush.active {
  border-color: #f4762c;
  color: #e8eef6;
  background: rgba(244, 118, 44, 0.1);
}

.label {
  flex: 1;
  min-width: 0;
  font-size: 13px;
}

kbd {
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 11px;
  color: #64758a;
  border: 1px solid #33445a;
  border-radius: 4px;
  padding: 1px 5px;
}
</style>
