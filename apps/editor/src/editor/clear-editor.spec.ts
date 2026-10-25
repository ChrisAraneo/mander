import { TILE_BRICK } from '@mander/model';
import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { clearEditor } from './clear-editor';
import { createSketch } from './create-sketch';
import { patchEditorCell } from './patch-editor-cell';
import type { Pool } from './types/pool';
import { useEditor } from './use-editor';

describe('clearEditor', () => {
  it('should start over from a blank sketch of the pool and remember the old one when it is called', () => {
    const editor = useEditor(ref<Pool>('normal'));

    patchEditorCell(editor, 0, 2, TILE_BRICK, 'front');
    clearEditor(editor);

    expect(editor.sketch.value).toEqual(createSketch('normal'));
    expect(size(editor.history.value)).toBe(1);
    expect(editor.history.value[0].tiles[0][2]).toBe(TILE_BRICK);
  });
});
