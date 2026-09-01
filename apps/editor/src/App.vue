<script setup lang="ts">
import { STRUCTURE_WIDTH, STRUCTURE_HEIGHT } from '@mander/structures';
import { chain, withEffect } from '@mander/utils';
import { filter, find, noop, size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import BrushPicker from './components/BrushPicker.vue';
import IssuePanel from './components/IssuePanel.vue';
import OutputPanel from './components/OutputPanel.vue';
import StructureGrid from './components/StructureGrid.vue';
import type { Pool } from './editor';
import { BRUSHES, poolOf, nextStructureName, setRef } from './editor';
import { useEditor, useLibrary } from './editor';

const { nullish } = P;

const UNDO_KEY = 'z';

const library = useLibrary();

const loaded = ref('');
const pool = ref<Pool>('normal');
const name = ref('');

const savedTo = computed(() => poolOf(name.value));

const editor = useEditor(savedTo);

const normalEntries = computed(() =>
  filter(library.entries.value, { pool: 'normal' }),
);
const hardEntries = computed(() =>
  filter(library.entries.value, { pool: 'hard' }),
);
const verticalEntries = computed(() =>
  filter(library.entries.value, { pool: 'vertical' }),
);

const target = computed(() => `${savedTo.value}.ts`);

const canSave = computed(
  () => library.isReady.value && editor.isValid.value && size(name.value) > 0,
);

const suggestName = (): void =>
  void setRef(name, nextStructureName(library.entries.value, pool.value));

const loadStructure = (structure: string): void =>
  void match(find(library.entries.value, { name: structure }))
    .with(nullish, noop)
    .otherwise((entry) =>
      chain(entry)
        .thru((found) => withEffect(found, () => editor.replace(found.grid)))
        .thru((found) => withEffect(found, () => setRef(pool, found.pool)))
        .thru((found) => setRef(name, found.name))
        .value(),
    );

const save = (): void => void library.save(name.value, editor.grid.value);

const undoShortcut = (event: KeyboardEvent): void =>
  match(event.key === UNDO_KEY && (event.ctrlKey || event.metaKey))
    .with(true, () =>
      chain(event)
        .thru((pressed) => withEffect(pressed, () => pressed.preventDefault()))
        .thru(() => editor.undo())
        .value(),
    )
    .otherwise(noop);

const onKeydown = (event: KeyboardEvent): void =>
  match(document.activeElement?.tagName)
    .with('INPUT', noop)
    .otherwise(() =>
      match(find(BRUSHES, { shortcut: event.key }))
        .with(nullish, () => undoShortcut(event))
        .otherwise((brush) => void setRef(editor.brush, brush.value)),
    );

onMounted(() =>
  chain(window.addEventListener('keydown', onKeydown))
    .thru(() => library.load())
    .thru((loading) => loading.then(suggestName))
    .value(),
);

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <main class="app">
    <header class="masthead">
      <h1>Structure Editor</h1>
      <p>
        {{ STRUCTURE_WIDTH }} × {{ STRUCTURE_HEIGHT }} sector · left-click
        paints, right-click erases · block material is part of the section, so
        what you paint is what the generator builds
      </p>
    </header>

    <div class="layout">
      <aside class="tools">
        <div class="group">
          <h2>Brush</h2>
          <BrushPicker
            :brush="editor.brush.value"
            @pick="editor.brush.value = $event" />
        </div>

        <div class="group">
          <h2>Start from</h2>
          <select v-model="loaded" @change="loadStructure(loaded)">
            <option value="">Blank grid</option>
            <optgroup label="Normal">
              <option
                v-for="entry in normalEntries"
                :key="entry.name"
                :value="entry.name">
                {{ entry.name }}
              </option>
            </optgroup>
            <optgroup label="Hard">
              <option
                v-for="entry in hardEntries"
                :key="entry.name"
                :value="entry.name">
                {{ entry.name }}
              </option>
            </optgroup>
            <optgroup label="Vertical">
              <option
                v-for="entry in verticalEntries"
                :key="entry.name"
                :value="entry.name">
                {{ entry.name }}
              </option>
            </optgroup>
          </select>
        </div>

        <div class="group">
          <h2>Save to library</h2>
          <select v-model="pool" @change="suggestName()">
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
            <option value="vertical">Vertical</option>
          </select>
          <input
            v-model="name"
            class="name"
            spellcheck="false"
            placeholder="NORMAL_001" />
          <button
            class="primary"
            type="button"
            :disabled="!canSave"
            @click="save()">
            Write to {{ target }}
          </button>
          <p v-if="library.status.value" class="status">
            {{ library.status.value }}
          </p>
          <p v-else-if="!editor.isValid.value" class="status">
            Settle the issues before writing to the library.
          </p>
        </div>

        <div class="group actions">
          <button
            class="ghost"
            type="button"
            :disabled="!editor.canUndo.value"
            @click="editor.undo()">
            Undo
          </button>
          <button class="ghost" type="button" @click="editor.clear()">
            Clear
          </button>
        </div>
      </aside>

      <section class="canvas">
        <StructureGrid
          :grid="editor.grid.value"
          :brush="editor.brush.value"
          :erase-value="editor.eraseValue"
          @stroke-start="editor.remember()"
          @paint="editor.paint" />
      </section>

      <aside class="side">
        <IssuePanel
          :issues="editor.issues.value"
          :is-valid="editor.isValid.value" />
        <OutputPanel :text="editor.output.value" />
      </aside>
    </div>
  </main>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 28px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.masthead h1 {
  margin: 0;
  font-size: 30px;
  letter-spacing: 5px;
  color: #f4762c;
}

.masthead p {
  margin: 6px 0 0;
  color: #9fb0c3;
  font-size: 14px;
}

.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
}

.tools {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 200px;
  flex: none;
}

.group h2 {
  margin: 0 0 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #64758a;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.actions button {
  flex: 1;
}

.actions button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

select,
.name {
  width: 100%;
  font: inherit;
  padding: 8px 10px;
  border-radius: 9px;
  border: 1px solid #33445a;
  background: #141a28;
  color: #e8eef6;
  outline: none;
  box-sizing: border-box;
}

select:focus,
.name:focus {
  border-color: #f4762c;
}

.group select + .name,
.group .name + button,
.group select + button {
  margin-top: 8px;
}

.group .primary {
  width: 100%;
}

.group .primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.status {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #9fb0c3;
}

.canvas {
  padding: 16px;
  border: 1px solid #33445a;
  border-radius: 14px;
  background: #10151f;
  overflow-x: auto;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-width: 320px;
}
</style>
