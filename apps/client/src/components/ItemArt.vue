<script setup lang="ts">
import { type Item } from '@mander/model';
import { drawItem } from '@mander/render';
import { assign, noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { onMounted, ref, watch } from 'vue';

const { nullish } = P;

const props = withDefaults(defineProps<{ item: Item; size?: number }>(), {
  size: 64,
});

const canvas = ref<HTMLCanvasElement | null>(null);

const drawItemCanvas = (
  element: HTMLCanvasElement,
  item: Item,
  size: number,
): void =>
  pipe(
    window.devicePixelRatio || 1,
    (ratio) =>
      tap(ratio, () =>
        assign(element, { width: size * ratio, height: size * ratio }),
      ),
    (ratio) => ({ ratio, context: element.getContext('2d') }),
    ({ ratio, context }) =>
      match(context)
        .with(nullish, noop)
        .otherwise((target) =>
          pipe(
            target,
            (ready) =>
              tap(ready, () => ready.setTransform(ratio, 0, 0, ratio, 0, 0)),
            (ready) => tap(ready, () => ready.clearRect(0, 0, size, size)),
            (ready) => drawItem(ready, item, size),
          ),
        ),
  );

const drawArt = (): void =>
  match(canvas.value)
    .with(nullish, noop)
    .otherwise((element) => drawItemCanvas(element, props.item, props.size));

const getArtProps = (): [Item, number] => [props.item, props.size];

onMounted(drawArt);
watch(getArtProps, drawArt);
</script>

<template>
  <canvas
    ref="canvas"
    class="art"
    :style="{ width: `${size}px`, height: `${size}px` }" />
</template>

<style scoped>
.art {
  display: block;
  margin: 0 auto;
}
</style>
