<script setup lang="ts">
import { STRUCTURE_WIDTH, STRUCTURE_HEIGHT } from '@mander/structures';
import { find } from 'lodash-es';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import BrushPicker from './components/BrushPicker.vue';
import IssuePanel from './components/IssuePanel.vue';
import OutputPanel from './components/OutputPanel.vue';
import StructureGrid from './components/StructureGrid.vue';
import { BRUSHES, PRESETS } from './editor';
import { useEditor } from './editor';

const editor = useEditor();
const presetLabel = ref('');

function loadPreset(label: string): void {
  const preset = find(PRESETS, { label });
  if (preset === undefined) return;
  editor.replace(preset.grid);
}

function onKeydown(event: KeyboardEvent): void {
  const brush = find(BRUSHES, { shortcut: event.key });
  if (brush !== undefined) {
    editor.brush.value = brush.value;
    return;
  }
  if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    editor.undo();
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
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
          <select v-model="presetLabel" @change="loadPreset(presetLabel)">
            <option value="">Blank grid</option>
            <option
              v-for="preset in PRESETS"
              :key="preset.label"
              :value="preset.label">
              {{ preset.label }}
            </option>
          </select>
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

select {
  width: 100%;
  font: inherit;
  padding: 8px 10px;
  border-radius: 9px;
  border: 1px solid #33445a;
  background: #141a28;
  color: #e8eef6;
  outline: none;
}

select:focus {
  border-color: #f4762c;
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
