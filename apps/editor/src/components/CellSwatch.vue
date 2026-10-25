<script setup lang="ts">
import { type Layers, TILE_AIR, TILE_SIZE } from '@mander/model';
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { onMounted, ref, watch } from 'vue';
import type { BrushLayer } from '../editor';
import { drawStructure, patchCanvas, patchRef } from '../editor';

const { nullish } = P;

const props = defineProps<{ value: number; layer: BrushLayer }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

const createSwatch = (): Layers =>
  match(props.layer)
    .with('back', (): Layers => ({
      tiles: [[TILE_AIR]],
      backTiles: [[props.value]],
    }))
    .otherwise((): Layers => ({
      tiles: [[props.value]],
      backTiles: [[TILE_AIR]],
    }));

const drawSwatch = (): CanvasRenderingContext2D | void =>
  match(context.value)
    .with(nullish, noop)
    .otherwise((target) => drawStructure(target, createSwatch()));

const patchContext = (
  element: HTMLCanvasElement | null,
): CanvasRenderingContext2D | null | void =>
  match(element)
    .with(nullish, noop)
    .otherwise((target) =>
      patchRef(
        context,
        patchCanvas(target, TILE_SIZE, TILE_SIZE, window.devicePixelRatio || 1),
      ),
    );

const handleMount = (): CanvasRenderingContext2D | void =>
  pipe(canvas.value, patchContext, () => drawSwatch());

onMounted(handleMount);

watch(() => [props.value, props.layer], drawSwatch);
</script>

<template>
  <canvas ref="canvas" class="swatch" />
</template>

<style scoped>
.swatch {
  display: block;
  flex: none;
  box-sizing: content-box;
  outline: 1px solid #222c3c;
  background: #0b0f17;
}
</style>
