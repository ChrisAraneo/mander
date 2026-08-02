<script setup lang="ts">
import { TILE_SIZE } from '@mander/model';
import { STRUCTURE_WIDTH, STRUCTURE_HEIGHT } from '@mander/structures';
import { forEach, range } from 'lodash-es';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { drawStructure, fitCanvas } from '../editor';

const props = defineProps<{
  grid: number[][];
  brush: number;
  eraseValue: number;
}>();

const emit = defineEmits<{
  strokeStart: [];
  paint: [row: number, column: number, value: number];
}>();

const WIDTH = STRUCTURE_WIDTH * TILE_SIZE;
const HEIGHT = STRUCTURE_HEIGHT * TILE_SIZE;

const GRID_LINE = 'rgba(159, 176, 195, 0.13)';
const HOVER_LINE = '#f4762c';

const columns = range(STRUCTURE_WIDTH);
const rows = range(STRUCTURE_HEIGHT);

interface Cell {
  row: number;
  column: number;
}

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const hover = ref<Cell | null>(null);
const isPainting = ref(false);
const strokeValue = ref(props.brush);

/** Editor chrome, drawn over the game graphics rather than baked into them. */
function drawGridLines(target: CanvasRenderingContext2D): void {
  target.strokeStyle = GRID_LINE;
  target.lineWidth = 1;
  forEach(range(STRUCTURE_WIDTH + 1), (column) => {
    target.beginPath();
    target.moveTo(column * TILE_SIZE + 0.5, 0);
    target.lineTo(column * TILE_SIZE + 0.5, HEIGHT);
    target.stroke();
  });
  forEach(range(STRUCTURE_HEIGHT + 1), (row) => {
    target.beginPath();
    target.moveTo(0, row * TILE_SIZE + 0.5);
    target.lineTo(WIDTH, row * TILE_SIZE + 0.5);
    target.stroke();
  });
}

function drawHover(target: CanvasRenderingContext2D): void {
  const cell = hover.value;
  if (cell === null) return;
  target.strokeStyle = HOVER_LINE;
  target.lineWidth = 2;
  target.strokeRect(
    cell.column * TILE_SIZE + 1,
    cell.row * TILE_SIZE + 1,
    TILE_SIZE - 2,
    TILE_SIZE - 2,
  );
}

function repaint(): void {
  const target = context.value;
  if (target === null) return;
  drawStructure(target, props.grid);
  drawGridLines(target);
  drawHover(target);
}

/** Reads through the element's box, so a scaled canvas still maps correctly. */
function cellAt(event: PointerEvent): Cell | null {
  const element = canvas.value;
  if (element === null) return null;
  const box = element.getBoundingClientRect();
  const column = Math.floor(
    ((event.clientX - box.left) / box.width) * STRUCTURE_WIDTH,
  );
  const row = Math.floor(
    ((event.clientY - box.top) / box.height) * STRUCTURE_HEIGHT,
  );
  const isInside =
    column >= 0 &&
    column < STRUCTURE_WIDTH &&
    row >= 0 &&
    row < STRUCTURE_HEIGHT;
  return isInside ? { row, column } : null;
}

function start(event: PointerEvent): void {
  const cell = cellAt(event);
  if (cell === null) return;
  strokeValue.value = event.button === 2 ? props.eraseValue : props.brush;
  isPainting.value = true;
  emit('strokeStart');
  emit('paint', cell.row, cell.column, strokeValue.value);
}

function move(event: PointerEvent): void {
  const cell = cellAt(event);
  hover.value = cell;
  if (!isPainting.value || cell === null) return;
  emit('paint', cell.row, cell.column, strokeValue.value);
}

function leave(): void {
  hover.value = null;
}

function stop(): void {
  isPainting.value = false;
}

onMounted(() => {
  const element = canvas.value;
  if (element !== null) context.value = fitCanvas(element, WIDTH, HEIGHT);
  repaint();
  window.addEventListener('pointerup', stop);
});

onBeforeUnmount(() => window.removeEventListener('pointerup', stop));

watch(() => props.grid, repaint, { deep: true });
watch(hover, repaint);
</script>

<template>
  <div class="grid-wrap">
    <div class="ruler">
      <span class="corner" />
      <span v-for="column in columns" :key="column" class="tick">
        {{ column }}
      </span>
    </div>

    <div class="body">
      <div class="rail">
        <span v-for="row in rows" :key="row" class="tick row-tick">
          {{ row }}
        </span>
      </div>

      <canvas
        ref="canvas"
        class="stage"
        @contextmenu.prevent
        @pointerdown="start"
        @pointermove="move"
        @pointerleave="leave" />
    </div>
  </div>
</template>

<style scoped>
.grid-wrap {
  display: flex;
  flex-direction: column;
  user-select: none;
  touch-action: none;
  width: max-content;
}

.ruler,
.body {
  display: flex;
  align-items: flex-start;
}

.rail {
  display: flex;
  flex-direction: column;
}

.tick {
  width: 32px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 10px;
  color: #64758a;
  flex: none;
}

.corner,
.row-tick {
  width: 22px;
  height: 32px;
  line-height: 32px;
}

.stage {
  display: block;
  /*
   * A tile has to land on exactly TILE_SIZE screen pixels, or the textures are
   * resampled off the pixel grid and the preview stops being honest. Two
   * things would spoil that, so the frame is an outline rather than a border:
   * the page sets border-box globally, which would shrink the drawing surface
   * by the border, and a border would also push the canvas a pixel clear of
   * the rulers. An outline is painted outside the box and costs no layout.
   */
  box-sizing: content-box;
  outline: 1px solid #222c3c;
  background: #0b0f17;
  cursor: crosshair;
}
</style>
