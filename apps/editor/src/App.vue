<script setup lang="ts">
import type { Layers } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { filter, find, noop, size, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BrushPicker from './components/BrushPicker.vue';
import IssuePanel from './components/IssuePanel.vue';
import OutputPanel from './components/OutputPanel.vue';
import StructureGrid from './components/StructureGrid.vue';
import {
  addEditorHistory,
  type Brush,
  type BrushLayer,
  BRUSHES,
  clearEditor,
  createNextStructureName,
  fetchLibraryEntries,
  getHeight,
  getPool,
  patchEditorCell,
  patchEditorSketch,
  patchPreviousSketch,
  patchRef,
  type Pool,
  useEditor,
  useLibrary,
  writeLibraryStructure,
} from './editor';

const { nullish } = P;

const UNDO_KEY = 'z';

const library = useLibrary();

const loaded = ref('');
const pool = ref<Pool>('normal');
const name = ref('');

const savedTo = computed(() => getPool(name.value));

const editor = useEditor(savedTo);

const normalEntries = computed(() =>
  filter(library.entries.value, (entry) => entry.pool === 'normal'),
);
const hardEntries = computed(() =>
  filter(library.entries.value, (entry) => entry.pool === 'hard'),
);
const verticalEntries = computed(() =>
  filter(library.entries.value, (entry) => entry.pool === 'vertical'),
);

const target = computed(() => `${savedTo.value}.ts`);

const tall = computed(() => getHeight(savedTo.value));

const canSave = computed(
  () => library.isReady.value && editor.isValid.value && size(name.value) > 0,
);

const fetchResponse = (input: string, init?: RequestInit): Promise<Response> =>
  fetch(input, init);

const patchNextName = (): string =>
  patchRef(name, createNextStructureName(library.entries.value, pool.value));

const patchStartingStructure = (): string | void =>
  match(find(library.entries.value, (entry) => entry.name === loaded.value))
    .with(nullish, noop)
    .otherwise((entry) =>
      pipe(
        entry,
        (found) => tap(found, () => patchEditorSketch(editor, found.sketch)),
        (found) => tap(found, () => patchRef(pool, found.pool)),
        (found) => patchRef(name, found.name),
      ),
    );

const writeNamedStructure = (): Promise<void> =>
  writeLibraryStructure(
    library,
    name.value,
    editor.sketch.value,
    fetchResponse,
  );

const patchBrush = (brush: Brush): Brush => patchRef(editor.brush, brush);

const addHistory = (): Layers[] => addEditorHistory(editor);

const patchCell = (
  row: number,
  column: number,
  value: number,
  layer: BrushLayer,
): Layers | void => patchEditorCell(editor, row, column, value, layer);

const patchPrevious = (): Layers[] | void => patchPreviousSketch(editor);

const clearSketch = (): Layers => clearEditor(editor);

const handleUndoShortcut = (event: KeyboardEvent): Layers[] | void =>
  match(event.key === UNDO_KEY && (event.ctrlKey || event.metaKey))
    .with(true, () =>
      pipe(
        event,
        (pressed) => tap(pressed, () => pressed.preventDefault()),
        () => patchPreviousSketch(editor),
      ),
    )
    .otherwise(noop);

const handleKeydown = (event: KeyboardEvent): Brush | Layers[] | void =>
  match(document.activeElement?.tagName)
    .with('INPUT', noop)
    .otherwise(() =>
      match(find(BRUSHES, (brush) => brush.shortcut === event.key))
        .with(nullish, () => handleUndoShortcut(event))
        .otherwise((brush) => patchRef(editor.brush, brush)),
    );

const handleMount = (): Promise<string> =>
  pipe(
    window,
    (page) => tap(page, () => page.addEventListener('keydown', handleKeydown)),
    () => fetchLibraryEntries(library, fetchResponse),
    (loading) => loading.then(patchNextName),
  );

const handleUnmount = (): void =>
  window.removeEventListener('keydown', handleKeydown);

onMounted(handleMount);

onBeforeUnmount(handleUnmount);
</script>

<template>
  <main class="app">
    <header class="masthead">
      <h1>Structure Editor</h1>
      <p>
        {{ STRUCTURE_WIDTH }} × {{ tall }} sector · left-click paints,
        right-click erases · block material is part of the section, so what you
        paint is what the generator builds · a Background brush paints the layer
        behind the level, which a hazard can stand in front of
      </p>
    </header>

    <div class="layout">
      <aside class="tools">
        <div class="group">
          <h2>Brush</h2>
          <BrushPicker :brush="editor.brush.value" @pick="patchBrush" />
        </div>
      </aside>

      <section class="canvas">
        <StructureGrid
          :sketch="editor.sketch.value"
          :brush="editor.brush.value"
          @stroke-start="addHistory"
          @paint="patchCell" />
      </section>

      <aside class="side">
        <IssuePanel
          :issues="editor.issues.value"
          :is-valid="editor.isValid.value" />
        <OutputPanel :text="editor.output.value" />

        <section class="library">
          <div class="group">
            <h2>Start from</h2>
            <select v-model="loaded" @change="patchStartingStructure">
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
            <select v-model="pool" @change="patchNextName">
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
              @click="writeNamedStructure">
              Write to {{ target }}
            </button>
            <p v-if="library.status.value" class="status">
              {{ library.status.value }}
            </p>
            <p v-else-if="!editor.isValid.value" class="status">
              Settle the issues before writing to the library.
            </p>
          </div>

          <div class="actions">
            <button
              class="ghost"
              type="button"
              :disabled="!editor.canUndo.value"
              @click="patchPrevious">
              Undo
            </button>
            <button class="ghost" type="button" @click="clearSketch">
              Clear
            </button>
          </div>
        </section>
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
  width: 360px;
  flex: none;
}

.library {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid #33445a;
  border-radius: 12px;
  background: #10151f;
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
  min-width: 240px;
}
</style>
