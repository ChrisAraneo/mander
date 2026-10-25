<script setup lang="ts">
import { type Layers, TILE_AIR, TILE_SIZE } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { assign, floor, map, noop, range, size, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Brush, BrushLayer, Cell } from '../editor';
import { drawStructure, patchCanvas, patchRef } from '../editor';

const { nonNullable, nullish } = P;

const props = defineProps<{
  sketch: Layers;
  brush: Brush;
}>();

const emit = defineEmits<{
  strokeStart: [];
  paint: [row: number, column: number, value: number, layer: BrushLayer];
}>();

const WIDTH = STRUCTURE_WIDTH * TILE_SIZE;

const tall = computed(() => size(props.sketch.tiles));
const height = computed(() => tall.value * TILE_SIZE);

const GRID_LINE = 'rgba(159, 176, 195, 0.13)';
const HOVER_LINE = '#f4762c';

const RIGHT_BUTTON = 2;

const columns = range(STRUCTURE_WIDTH);
const rows = computed(() => range(tall.value));

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const hover = ref<Cell | null>(null);
const isPainting = ref(false);
const strokeValue = ref(props.brush.value);
const strokeLayer = ref<BrushLayer>(props.brush.layer);

const drawLine = (
  target: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): void =>
  pipe(
    target,
    (ready) => tap(ready, () => ready.beginPath()),
    (ready) => tap(ready, () => ready.moveTo(fromX, fromY)),
    (ready) => tap(ready, () => ready.lineTo(toX, toY)),
    (ready) => ready.stroke(),
  );

const drawGridLines = (
  target: CanvasRenderingContext2D,
): CanvasRenderingContext2D =>
  pipe(
    target,
    (ready) => assign(ready, { strokeStyle: GRID_LINE, lineWidth: 1 }),
    (ready) =>
      tap(ready, () =>
        map(range(STRUCTURE_WIDTH + 1), (column) =>
          drawLine(
            ready,
            column * TILE_SIZE + 0.5,
            0,
            column * TILE_SIZE + 0.5,
            height.value,
          ),
        ),
      ),
    (ready) =>
      tap(ready, () =>
        map(range(tall.value + 1), (row) =>
          drawLine(
            ready,
            0,
            row * TILE_SIZE + 0.5,
            WIDTH,
            row * TILE_SIZE + 0.5,
          ),
        ),
      ),
  );

const drawHover = (target: CanvasRenderingContext2D): void =>
  match(hover.value)
    .with(nullish, noop)
    .otherwise((cell) =>
      pipe(
        target,
        (ready) => assign(ready, { strokeStyle: HOVER_LINE, lineWidth: 2 }),
        (ready) =>
          ready.strokeRect(
            cell.column * TILE_SIZE + 1,
            cell.row * TILE_SIZE + 1,
            TILE_SIZE - 2,
            TILE_SIZE - 2,
          ),
      ),
    );

const drawStructureGrid = (): void =>
  match(context.value)
    .with(nullish, noop)
    .otherwise((target) =>
      pipe(
        target,
        (ready) => drawStructure(ready, props.sketch),
        drawGridLines,
        drawHover,
      ),
    );

const findCellIn = (
  element: HTMLCanvasElement,
  event: PointerEvent,
): Cell | null =>
  pipe(
    element.getBoundingClientRect(),
    (box): Cell => ({
      row: floor(((event.clientY - box.top) / box.height) * tall.value),
      column: floor(((event.clientX - box.left) / box.width) * STRUCTURE_WIDTH),
    }),
    (cell) =>
      match(
        cell.column >= 0 &&
          cell.column < STRUCTURE_WIDTH &&
          cell.row >= 0 &&
          cell.row < tall.value,
      )
        .with(true, (): Cell | null => cell)
        .otherwise((): Cell | null => null),
  );

const findCellAt = (event: PointerEvent): Cell | null =>
  match(canvas.value)
    .with(nullish, (): Cell | null => null)
    .otherwise((element) => findCellIn(element, event));

const startStroke = (event: PointerEvent): void =>
  match(findCellAt(event))
    .with(nullish, noop)
    .otherwise((cell) =>
      pipe(
        match(event.button)
          .with(RIGHT_BUTTON, () => TILE_AIR)
          .otherwise(() => props.brush.value),
        (value) => patchRef(strokeValue, value),
        (value) => tap(value, () => patchRef(strokeLayer, props.brush.layer)),
        (value) => tap(value, () => patchRef(isPainting, true)),
        (value) => tap(value, () => emit('strokeStart')),
        (value) =>
          emit('paint', cell.row, cell.column, value, strokeLayer.value),
      ),
    );

const patchStrokeCell = (cell: Cell | null): void =>
  match({ painting: isPainting.value, cell })
    .with({ painting: true, cell: nonNullable }, ({ cell: target }) =>
      emit(
        'paint',
        target.row,
        target.column,
        strokeValue.value,
        strokeLayer.value,
      ),
    )
    .otherwise(noop);

const handlePointerMove = (event: PointerEvent): void =>
  pipe(event, findCellAt, (cell) => patchRef(hover, cell), patchStrokeCell);

const clearHover = (): Cell | null => patchRef<Cell | null>(hover, null);

const finishStroke = (): boolean => patchRef(isPainting, false);

const patchContext = (
  element: HTMLCanvasElement | null,
): CanvasRenderingContext2D | null | void =>
  match(element)
    .with(nullish, noop)
    .otherwise((target) =>
      patchRef(
        context,
        patchCanvas(target, WIDTH, height.value, window.devicePixelRatio || 1),
      ),
    );

const redrawStructureGrid = (): void =>
  pipe(canvas.value, patchContext, () => drawStructureGrid());

const handleMount = (): void =>
  pipe(
    canvas.value,
    patchContext,
    () => drawStructureGrid(),
    () => window.addEventListener('pointerup', finishStroke),
  );

const handleUnmount = (): void =>
  window.removeEventListener('pointerup', finishStroke);

onMounted(handleMount);

onBeforeUnmount(handleUnmount);

watch(() => props.sketch, drawStructureGrid, { deep: true });
watch(tall, redrawStructureGrid);
watch(hover, drawStructureGrid);
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
        @pointerdown="startStroke"
        @pointermove="handlePointerMove"
        @pointerleave="clearHover" />
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
  box-sizing: content-box;
  outline: 1px solid #222c3c;
  background: #0b0f17;
  cursor: crosshair;
}
</style>
