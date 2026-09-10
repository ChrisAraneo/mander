<script setup lang="ts">
import { type Layers, TILE_AIR, TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { onMounted, ref, watch } from 'vue';

import type { BrushLayer } from '../editor';
import { drawStructure, fitCanvas, setRef } from '../editor';

const { nullish } = P;

const props = defineProps<{ value: number; layer: BrushLayer }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

// a background brush is shown the way the game draws it: behind the level
const swatch = (): Layers =>
  match(props.layer)
    .with('back', (): Layers => ({
      tiles: [[TILE_AIR]],
      backTiles: [[props.value]],
    }))
    .otherwise((): Layers => ({
      tiles: [[props.value]],
      backTiles: [[TILE_AIR]],
    }));

const repaint = (): void =>
  match(context.value)
    .with(nullish, noop)
    .otherwise((target) => drawStructure(target, swatch()));

onMounted(() =>
  chain(canvas.value)
    .thru((element) =>
      match(element)
        .with(nullish, noop)
        .otherwise(
          (target) =>
            void setRef(context, fitCanvas(target, TILE_SIZE, TILE_SIZE)),
        ),
    )
    .thru(() => repaint())
    .value(),
);

watch(() => [props.value, props.layer], repaint);
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
