<script setup lang="ts">
import { type Layers, TILE_AIR, TILE_SIZE } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { chain, withEffect } from '@mander/utils';
import { forEach, noop, range, size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { Brush, BrushLayer } from '../editor';
import { drawStructure, fitCanvas, setRef } from '../editor';

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

interface Cell {
  row: number;
  column: number;
}

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const hover = ref<Cell | null>(null);
const isPainting = ref(false);
const strokeValue = ref(props.brush.value);
const strokeLayer = ref<BrushLayer>(props.brush.layer);

const strokeLine = (
  target: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): void =>
  chain(target)
    .thru((ready) => withEffect(ready, () => ready.beginPath()))
    .thru((ready) => withEffect(ready, () => ready.moveTo(fromX, fromY)))
    .thru((ready) => withEffect(ready, () => ready.lineTo(toX, toY)))
    .thru((ready) => ready.stroke())
    .value();

const drawGridLines = (target: CanvasRenderingContext2D): void =>
  void chain(target)
    .thru((ready) =>
      withEffect(ready, () =>
        Object.assign(ready, { strokeStyle: GRID_LINE, lineWidth: 1 }),
      ),
    )
    .thru((ready) =>
      withEffect(ready, () =>
        forEach(range(STRUCTURE_WIDTH + 1), (column) =>
          strokeLine(
            ready,
            column * TILE_SIZE + 0.5,
            0,
            column * TILE_SIZE + 0.5,
            height.value,
          ),
        ),
      ),
    )
    .thru((ready) =>
      forEach(range(tall.value + 1), (row) =>
        strokeLine(
          ready,
          0,
          row * TILE_SIZE + 0.5,
          WIDTH,
          row * TILE_SIZE + 0.5,
        ),
      ),
    )
    .value();

const drawHover = (target: CanvasRenderingContext2D): void =>
  match(hover.value)
    .with(nullish, noop)
    .otherwise((cell) =>
      chain(target)
        .thru((ready) =>
          withEffect(ready, () =>
            Object.assign(ready, { strokeStyle: HOVER_LINE, lineWidth: 2 }),
          ),
        )
        .thru((ready) =>
          ready.strokeRect(
            cell.column * TILE_SIZE + 1,
            cell.row * TILE_SIZE + 1,
            TILE_SIZE - 2,
            TILE_SIZE - 2,
          ),
        )
        .value(),
    );

const repaint = (): void =>
  match(context.value)
    .with(nullish, noop)
    .otherwise((target) =>
      chain(target)
        .thru((ready) =>
          withEffect(ready, () => drawStructure(ready, props.sketch)),
        )
        .thru((ready) => withEffect(ready, () => drawGridLines(ready)))
        .thru((ready) => drawHover(ready))
        .value(),
    );

const cellIn = (element: HTMLCanvasElement, event: PointerEvent): Cell | null =>
  chain(element.getBoundingClientRect())
    .thru((box) => ({
      column: Math.floor(
        ((event.clientX - box.left) / box.width) * STRUCTURE_WIDTH,
      ),
      row: Math.floor(((event.clientY - box.top) / box.height) * tall.value),
    }))
    .thru(({ row, column }) =>
      match(
        column >= 0 && column < STRUCTURE_WIDTH && row >= 0 && row < tall.value,
      )
        .with(true, (): Cell | null => ({ row, column }))
        .otherwise((): Cell | null => null),
    )
    .value();

const cellAt = (event: PointerEvent): Cell | null =>
  match(canvas.value)
    .with(nullish, (): Cell | null => null)
    .otherwise((element) => cellIn(element, event));

// the right button erases the layer the brush belongs to, so a background
// brush rubs out background and leaves the level in front of it alone
const start = (event: PointerEvent): void =>
  match(cellAt(event))
    .with(nullish, noop)
    .otherwise((cell) =>
      chain(
        match(event.button)
          .with(RIGHT_BUTTON, () => TILE_AIR)
          .otherwise(() => props.brush.value),
      )
        .thru((value) => setRef(strokeValue, value))
        .thru((value) =>
          withEffect(value, () => setRef(strokeLayer, props.brush.layer)),
        )
        .thru((value) => withEffect(value, () => setRef(isPainting, true)))
        .thru((value) => withEffect(value, () => emit('strokeStart')))
        .thru((value) =>
          emit('paint', cell.row, cell.column, value, strokeLayer.value),
        )
        .value(),
    );

const move = (event: PointerEvent): void =>
  chain(setRef(hover, cellAt(event)))
    .thru((cell) =>
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
        .otherwise(noop),
    )
    .value();

const leave = (): void => void setRef(hover, null);

const stop = (): void => void setRef(isPainting, false);

const refit = (): void =>
  match(canvas.value)
    .with(nullish, noop)
    .otherwise(
      (target) => void setRef(context, fitCanvas(target, WIDTH, height.value)),
    );

onMounted(() =>
  chain(refit())
    .thru(() => repaint())
    .thru(() => window.addEventListener('pointerup', stop))
    .value(),
);

onBeforeUnmount(() => window.removeEventListener('pointerup', stop));

watch(() => props.sketch, repaint, { deep: true });
watch(tall, () =>
  chain(refit())
    .thru(() => repaint())
    .value(),
);
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
  box-sizing: content-box;
  outline: 1px solid #222c3c;
  background: #0b0f17;
  cursor: crosshair;
}
</style>
