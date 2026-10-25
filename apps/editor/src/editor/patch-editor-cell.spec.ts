import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { patchEditorCell } from './patch-editor-cell';
import type { Pool } from './types/pool';
import { useEditor } from './use-editor';

describe('patchEditorCell', () => {
  it('should paint the cell when the brush lands on a different tile', () => {
    const editor = useEditor(ref<Pool>('normal'));

    patchEditorCell(editor, 0, 2, TILE_BRICK, 'front');

    expect(editor.sketch.value.tiles[0][2]).toBe(TILE_BRICK);
  });

  it('should paint behind the level when the brush paints behind', () => {
    const editor = useEditor(ref<Pool>('normal'));

    patchEditorCell(editor, 0, 2, TILE_BRICK, 'back');

    expect(editor.sketch.value.backTiles[0][2]).toBe(TILE_BRICK);
    expect(editor.sketch.value.tiles[0][2]).toBe(TILE_AIR);
  });

  it('should keep a single start when it paints a second one', () => {
    const editor = useEditor(ref<Pool>('normal'));

    patchEditorCell(editor, 0, 2, STRUCTURE_START, 'front');
    patchEditorCell(editor, 1, 4, STRUCTURE_START, 'front');

    expect(editor.sketch.value.tiles[0][2]).toBe(TILE_AIR);
    expect(editor.sketch.value.tiles[1][4]).toBe(STRUCTURE_START);
  });

  it('should leave the sketch alone when the cell already holds the tile', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const sketch = editor.sketch.value;

    patchEditorCell(editor, 0, 2, TILE_AIR, 'front');

    expect(editor.sketch.value).toBe(sketch);
  });

  it('should leave the sketch alone when the cell lies outside it', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const sketch = editor.sketch.value;

    patchEditorCell(editor, 500, 2, TILE_BRICK, 'front');

    expect(editor.sketch.value).toBe(sketch);
  });
});
