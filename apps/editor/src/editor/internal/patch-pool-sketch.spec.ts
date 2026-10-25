import { VERTICAL_HEIGHT } from '@mander/structures';
import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createSketch } from '../create-sketch';
import type { Pool } from '../types/pool';
import { useEditor } from '../use-editor';
import { patchPoolSketch } from './patch-pool-sketch';

describe('patchPoolSketch', () => {
  it('should start over with a sketch of the new pool and keep the old one in the history when the heights differ', () => {
    const editor = useEditor(ref<Pool>('normal'));

    const patched = patchPoolSketch(editor, 'vertical');

    expect(patched).toEqual(createSketch('vertical'));
    expect(size(editor.sketch.value.tiles)).toBe(VERTICAL_HEIGHT);
    expect(editor.history.value).toEqual([createSketch('normal')]);
  });

  it('should keep the sketch and the history when the heights are the same', () => {
    const editor = useEditor(ref<Pool>('normal'));
    const sketch = editor.sketch.value;

    const patched = patchPoolSketch(editor, 'hard');

    expect(patched).toBeUndefined();
    expect(editor.sketch.value).toBe(sketch);
    expect(editor.history.value).toEqual([]);
  });
});
