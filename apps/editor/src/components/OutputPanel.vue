<script setup lang="ts">
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { computed, ref } from 'vue';
import { patchRef } from '../editor';

const COPIED_MS = 1400;

const props = defineProps<{ text: string }>();

const isCopied = ref(false);
const hasFailed = ref(false);
const isShown = ref(false);

const label = computed(() =>
  match(isCopied.value)
    .with(true, () => 'Copied')
    .otherwise(() => 'Copy'),
);

const toggleLabel = computed(() =>
  match(isShown.value)
    .with(true, () => 'Hide')
    .otherwise(() => 'Show'),
);

const patchShown = (): boolean => patchRef(isShown, !isShown.value);

const patchBlocked = (): boolean =>
  pipe(
    true,
    (failed) => patchRef(hasFailed, failed),
    (shown) => patchRef(isShown, shown),
  );

const clearCopied = (): boolean => patchRef(isCopied, false);

const patchCopied = (): number =>
  pipe(
    true,
    (copied) => patchRef(isCopied, copied),
    () => window.setTimeout(clearCopied, COPIED_MS),
  );

const writeClipboard = (): Promise<void> =>
  pipe(
    false,
    (failed) => patchRef(hasFailed, failed),
    () => navigator.clipboard.writeText(props.text),
    (writing) => writing.then(patchCopied, patchBlocked),
    (settled) => settled.then(noop),
  );
</script>

<template>
  <section class="output">
    <header>
      <h2>Structure source</h2>
      <div class="buttons">
        <button class="ghost" type="button" @click="writeClipboard">
          {{ label }}
        </button>
        <button class="ghost" type="button" @click="patchShown">
          {{ toggleLabel }}
        </button>
      </div>
    </header>
    <p v-if="hasFailed" class="failed">
      Clipboard blocked — select the text below and copy manually.
    </p>
    <pre v-if="isShown">{{ text }}</pre>
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

.buttons {
  display: flex;
  gap: 8px;
  flex: none;
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
  padding: 10px;
  border-radius: 8px;
  background: #0b0f17;
  color: #c8d3e3;
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 11px;
  line-height: 1.45;
  overflow-x: auto;
  user-select: all;
}
</style>
