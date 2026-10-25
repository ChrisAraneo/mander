import { TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { addEditorHistory } from './add-editor-history';
import { cloneSketch } from './clone-sketch';
import { patchEditorCell } from './patch-editor-cell';
import { patchPreviousSketch } from './patch-previous-sketch';
import type { Pool } from './types/pool';
import { useEditor } from './use-editor';

describe('patchPreviousSketch', () => {
  it('should bring back the remembered sketch and forget it when there is one', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const before = cloneSketch(editor.sketch.value);

    addEditorHistory(editor);
    patchEditorCell(editor, 0, 2, TILE_BRICK, 'front');
    patchPreviousSketch(editor);

    expect(editor.sketch.value).toEqual(before);
    expect(editor.history.value).toEqual([]);
  });

  it('should leave the sketch alone when nothing is remembered', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const sketch = editor.sketch.value;

    patchPreviousSketch(editor);

    expect(editor.sketch.value).toBe(sketch);
    expect(editor.history.value).toEqual([]);
  });
});
