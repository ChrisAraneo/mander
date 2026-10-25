import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createSketch } from './create-sketch';
import { patchEditorSketch } from './patch-editor-sketch';
import type { Pool } from './types/pool';
import { useEditor } from './use-editor';

describe('patchEditorSketch', () => {
  it('should remember the old sketch and fill in the missing back layer when it swaps the sketch', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const previous = editor.sketch.value;

    patchEditorSketch(editor, {
      tiles: [[TILE_DIRT, TILE_DIRT]],
      backTiles: [],
    });

    expect(editor.sketch.value).toEqual({
      tiles: [[TILE_DIRT, TILE_DIRT]],
      backTiles: [[TILE_AIR, TILE_AIR]],
    });
    expect(editor.history.value).toEqual([previous]);
  });

  it('should not share the given sketch when it swaps the sketch in', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const sketch = createSketch('hard');

    patchEditorSketch(editor, sketch);

    expect(editor.sketch.value).toEqual(sketch);
    expect(editor.sketch.value.tiles[0]).not.toBe(sketch.tiles[0]);
  });
});
