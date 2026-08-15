<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Item } from '@mander/model';
import { drawItem } from '@mander/render';

const props = withDefaults(defineProps<{ item: Item; size?: number }>(), {
  size: 64,
});

const canvas = ref<HTMLCanvasElement | null>(null);

const paint = (): void => {
  const element = canvas.value;
  if (element === null) return;

  const pixelRatio = window.devicePixelRatio || 1;
  element.width = props.size * pixelRatio;
  element.height = props.size * pixelRatio;

  const context = element.getContext('2d');
  if (context === null) return;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, props.size, props.size);
  drawItem(context, props.item, props.size);
};

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
