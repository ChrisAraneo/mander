<script setup lang="ts">
import { SECTOR_WIDTH, type Structure } from '@mander/generator';
import { range } from 'lodash-es';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { cellClass } from '../editor';

const props = defineProps<{
  grid: Structure;
  brush: number;
  eraseValue: number;
}>();

const emit = defineEmits<{
  strokeStart: [];
  paint: [row: number, column: number, value: number];
}>();

const isPainting = ref(false);
const strokeValue = ref(props.brush);

const columns = range(SECTOR_WIDTH);

function start(row: number, column: number, isErase: boolean): void {
  strokeValue.value = isErase ? props.eraseValue : props.brush;
  isPainting.value = true;
  emit('strokeStart');
  emit('paint', row, column, strokeValue.value);
}

function extend(row: number, column: number): void {
  if (!isPainting.value) return;
  emit('paint', row, column, strokeValue.value);
}

function stop(): void {
  isPainting.value = false;
}

onMounted(() => window.addEventListener('pointerup', stop));
onBeforeUnmount(() => window.removeEventListener('pointerup', stop));
</script>

<template>
  <div class="grid-wrap">
    <div class="ruler">
      <span class="corner" />
      <span v-for="column in columns" :key="column" class="tick">
        {{ column }}
      </span>
    </div>

    <div
      v-for="(row, rowIndex) in props.grid"
      :key="rowIndex"
      class="row"
      @contextmenu.prevent>
      <span class="tick row-tick">{{ rowIndex }}</span>
      <button
        v-for="(cell, columnIndex) in row"
        :key="columnIndex"
        type="button"
        class="cell"
        :class="cellClass(cell)"
        :title="`row ${rowIndex}, column ${columnIndex} — value ${cell}`"
        @pointerdown="start(rowIndex, columnIndex, $event.button === 2)"
        @pointerenter="extend(rowIndex, columnIndex)" />
    </div>
  </div>
</template>

<style scoped>
.grid-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  user-select: none;
  touch-action: none;
  width: max-content;
}

.ruler,
.row {
  display: flex;
  gap: 2px;
  align-items: center;
}

.tick {
  width: 28px;
  text-align: center;
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 10px;
  color: #64758a;
}

.corner,
.row-tick {
  width: 22px;
  flex: none;
}

.cell {
  width: 28px;
  height: 28px;
  flex: none;
  padding: 0;
  border: 1px solid #222c3c;
  border-radius: 3px;
  transition: outline-color 0.08s ease;
  outline: 1px solid transparent;
}

.cell:hover {
  outline-color: #f4762c;
}
</style>
