<script setup lang="ts">
import { chain } from '@mander/utils';
import { noop } from 'lodash-es';
import { match } from 'ts-pattern';
import { computed, ref } from 'vue';

import { setRef } from '../editor';

const COPIED_MS = 1400;

const props = defineProps<{ text: string }>();

const copied = ref(false);
const failed = ref(false);
const isShown = ref(false);

const label = computed(() =>
  match(copied.value)
    .with(true, () => 'Copied')
    .otherwise(() => 'Copy'),
);

const toggleLabel = computed(() =>
  match(isShown.value)
    .with(true, () => 'Hide')
    .otherwise(() => 'Show'),
);

const toggle = (): void => void setRef(isShown, !isShown.value);

// a blocked clipboard leaves the source as the only way out, so it is opened
const blocked = (): void =>
  void chain(setRef(failed, true))
    .thru(() => setRef(isShown, true))
    .value();

const copy = (): Promise<void> =>
  chain(setRef(failed, false))
    .thru(() =>
      navigator.clipboard.writeText(props.text).then(
        () =>
          chain(setRef(copied, true))
            .thru(() =>
              window.setTimeout(() => setRef(copied, false), COPIED_MS),
            )
            .value(),
        () => blocked(),
      ),
    )
    .thru((settled) => settled.then(noop))
    .value();
</script>

<template>
  <section class="output">
    <header>
      <h2>Structure source</h2>
      <div class="buttons">
        <button class="ghost" type="button" @click="copy">
          {{ label }}
        </button>
        <button class="ghost" type="button" @click="toggle()">
          {{ toggleLabel }}
        </button>
      </div>
    </header>
    <p v-if="failed" class="failed">
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
