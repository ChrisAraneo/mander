<script setup lang="ts">
import { TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { onMounted, ref, watch } from 'vue';

import { drawStructure, fitCanvas, setRef } from '../editor';

const { nullish } = P;

const props = defineProps<{ value: number }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

const repaint = (): void =>
  match(context.value)
    .with(nullish, noop)
    .otherwise((target) => drawStructure(target, [[props.value]]));

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

watch(() => props.value, repaint);
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
