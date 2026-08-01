<script setup lang="ts">
import { BRUSH_GROUPS } from '../editor';
import CellSwatch from './CellSwatch.vue';

defineProps<{ brush: number }>();

const emit = defineEmits<{ pick: [value: number] }>();
</script>

<template>
  <div class="groups">
    <div v-for="group in BRUSH_GROUPS" :key="group.name" class="group">
      <h3>{{ group.name }}</h3>
      <button
        v-for="option in group.brushes"
        :key="option.value"
        type="button"
        class="brush"
        :class="{ active: option.value === brush }"
        @click="emit('pick', option.value)">
        <CellSwatch :value="option.value" />
        <span class="label">{{ option.label }}</span>
        <kbd>{{ option.shortcut }}</kbd>
      </button>
    </div>
  </div>
</template>

<style scoped>
.groups {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  gap: 10px;
  padding: 6px 10px;
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
