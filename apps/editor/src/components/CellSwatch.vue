<script setup lang="ts">
import { TILE_SIZE } from '@mander/model';
import { onMounted, ref, watch } from 'vue';

import { drawStructure, fitCanvas } from '../editor';

const props = defineProps<{ value: number }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

/**
 * A one-cell structure, drawn by the game's renderer. Nothing sits above it,
 * so a block shows its exposed cap — the same face it wears on a surface.
 */
function repaint(): void {
  const target = context.value;
  if (target === null) return;
  drawStructure(target, [[props.value]]);
}

onMounted(() => {
  const element = canvas.value;
  if (element !== null)
    context.value = fitCanvas(element, TILE_SIZE, TILE_SIZE);
  repaint();
});

watch(() => props.value, repaint);
</script>

<template>
  <canvas ref="canvas" class="swatch" />
</template>

<style scoped>
.swatch {
  display: block;
  flex: none;
  /* Framed like the grid, so the swatch is one tile at its true size. */
  box-sizing: content-box;
  outline: 1px solid #222c3c;
  background: #0b0f17;
}
</style>
