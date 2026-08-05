<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { ItemArt } from '@mander/engine';
import { drawItem } from '@mander/render';

const ART_SIZE = 64;

const props = defineProps<{ art: ItemArt }>();

const canvas = ref<HTMLCanvasElement | null>(null);

const paint = (): void => {
  const element = canvas.value;
  if (element === null) return;

  const pixelRatio = window.devicePixelRatio || 1;
  element.width = ART_SIZE * pixelRatio;
  element.height = ART_SIZE * pixelRatio;

  const context = element.getContext('2d');
  if (context === null) return;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, ART_SIZE, ART_SIZE);
  drawItem(context, props.art, ART_SIZE);
};

onMounted(paint);
watch(() => props.art, paint);
</script>

<template>
  <canvas
    ref="canvas"
    class="art"
    :style="{ width: `${ART_SIZE}px`, height: `${ART_SIZE}px` }" />
</template>

<style scoped>
.art {
  display: block;
  margin: 0 auto;
}
</style>
