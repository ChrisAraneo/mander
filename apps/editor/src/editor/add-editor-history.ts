import type { Layers } from '@mander/model';
import { concat, slice } from 'lodash-es';
import { pipe } from 'remeda';
import { cloneSketch } from './clone-sketch';
import { patchRef } from './patch-ref';
import type { Editor } from './types/editor';

const HISTORY_LIMIT = 50;

export const addEditorHistory = (editor: Editor): Layers[] =>
  pipe(
    editor.history.value,
    (history) => concat(history, [cloneSketch(editor.sketch.value)]),
    (history) => slice(history, -HISTORY_LIMIT),
    (history) => patchRef(editor.history, history),
  );
