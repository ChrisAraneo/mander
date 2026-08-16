<script setup lang="ts">
import type { Item } from '@mander/model';
import { drawItem } from '@mander/render';
import { chain, withEffect } from '@mander/utils';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { onMounted, ref, watch } from 'vue';

const { nullish } = P;

const props = withDefaults(defineProps<{ item: Item; size?: number }>(), {
  size: 64,
});

const canvas = ref<HTMLCanvasElement | null>(null);

const paintInto = (
  element: HTMLCanvasElement,
  item: Item,
  size: number,
): void =>
  chain(window.devicePixelRatio || 1)
    .thru((ratio) =>
      withEffect(ratio, () =>
        Object.assign(element, { width: size * ratio, height: size * ratio }),
      ),
    )
    .thru((ratio) => ({ ratio, context: element.getContext('2d') }))
    .thru(({ ratio, context }) =>
      match(context)
        .with(nullish, noop)
        .otherwise((target) =>
          chain(target)
            .thru((ready) =>
              withEffect(ready, () =>
                ready.setTransform(ratio, 0, 0, ratio, 0, 0),
              ),
            )
            .thru((ready) =>
              withEffect(ready, () => ready.clearRect(0, 0, size, size)),
            )
            .thru((ready) => drawItem(ready, item, size))
            .value(),
        ),
    )
    .value();

const paint = (): void =>
  match(canvas.value)
    .with(nullish, noop)
    .otherwise((element) => paintInto(element, props.item, props.size));

onMounted(paint);
watch(() => [props.item, props.size], paint);
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
