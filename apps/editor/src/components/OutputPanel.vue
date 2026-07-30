<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ text: string }>();

const copied = ref(false);
const failed = ref(false);

async function copy(): Promise<void> {
  failed.value = false;
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1400);
  } catch {
    failed.value = true;
  }
}
</script>

<template>
  <section class="output">
    <header>
      <h2>Paste into library.ts</h2>
      <button class="ghost" type="button" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </header>
    <p v-if="failed" class="failed">
      Clipboard blocked — select the text below and copy manually.
    </p>
    <pre>{{ text }}</pre>
  </section>
</template>

<style scoped>
.output {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #33445a;
  border-radius: 12px;
  background: #10151f;
  min-width: 0;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

h2 {
  margin: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #9fb0c3;
}

.failed {
  margin: 0;
  color: #f4762c;
  font-size: 13px;
}

pre {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: #0b0f17;
  color: #c8d3e3;
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  user-select: all;
}
</style>
