import { STRUCTURE_HEIGHT, VERTICAL_HEIGHT } from '@mander/structures';
import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';

import { createSketch } from './create-sketch';
import { DEFAULT_BRUSH } from './default-brush';
import { formatStructure } from './format-structure';
import type { Pool } from './types/pool';
import { useEditor } from './use-editor';

describe('useEditor', () => {
  it('should start from a blank sketch of the pool with the default brush and no history when it is created', () => {
    const editor = useEditor(ref<Pool>('normal'));

    expect(editor.sketch.value).toEqual(createSketch('normal'));
    expect(editor.brush.value).toEqual(DEFAULT_BRUSH);
    expect(editor.history.value).toEqual([]);
    expect(editor.canUndo.value).toBe(false);
  });

  it('should report the issues and the source of the sketch when it is created', () => {
    const editor = useEditor(ref<Pool>('normal'));

    expect(size(editor.issues.value)).toBeGreaterThan(0);
    expect(editor.isValid.value).toBe(false);
    expect(editor.output.value).toBe(formatStructure(createSketch('normal')));
  });

  it('should start over at the new height when the pool changes to one of another height', async () => {
    const pool = ref<Pool>('normal');
    const editor = useEditor(pool);

    pool.value = 'vertical';
    await nextTick();

    expect(size(editor.sketch.value.tiles)).toBe(VERTICAL_HEIGHT);
    expect(size(editor.history.value)).toBe(1);
  });

  it('should keep the sketch when the pool changes to one of the same height', async () => {
    const pool = ref<Pool>('normal');
    const editor = useEditor(pool);
    const sketch = editor.sketch.value;

    pool.value = 'hard';
    await nextTick();

    expect(editor.sketch.value).toBe(sketch);
    expect(size(editor.sketch.value.tiles)).toBe(STRUCTURE_HEIGHT);
  });
});
