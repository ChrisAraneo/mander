import type { Layers } from '@mander/model';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { addEditorHistory } from './add-editor-history';
import { addMissingSketchTiles } from './add-missing-sketch-tiles';
import { cloneSketch } from './clone-sketch';
import { patchRef } from './patch-ref';
import type { Editor } from './types/editor';

export const patchEditorSketch = (editor: Editor, sketch: Layers): Layers =>
  pipe(
    sketch,
    (next) => tap(next, () => addEditorHistory(editor)),
    cloneSketch,
    addMissingSketchTiles,
    (filled) => patchRef(editor.sketch, filled),
  );
