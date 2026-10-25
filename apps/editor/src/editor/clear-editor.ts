import type { Layers } from '@mander/model';
import { createSketch } from './create-sketch';
import { patchEditorSketch } from './patch-editor-sketch';
import type { Editor } from './types/editor';

export const clearEditor = (editor: Editor): Layers =>
  patchEditorSketch(editor, createSketch(editor.pool.value));
