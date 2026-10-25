import { last, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { addEditorHistory } from './add-editor-history';
import type { Pool } from './types/pool';
import { useEditor } from './use-editor';

const HISTORY_LIMIT = 50;

describe('addEditorHistory', () => {
  it('should remember a copy of the sketch when it is called', () => {
    const editor = useEditor(ref<Pool>('normal'));

    addEditorHistory(editor);

    expect(editor.history.value).toEqual([editor.sketch.value]);
    expect(editor.history.value[0]).not.toBe(editor.sketch.value);
    expect(editor.canUndo.value).toBe(true);
  });

  it('should forget the oldest sketch when the history is full', () => {
    const editor = useEditor(ref<Pool>('normal'));

    times(HISTORY_LIMIT + 3, () => addEditorHistory(editor));

    expect(size(editor.history.value)).toBe(HISTORY_LIMIT);
    expect(last(editor.history.value)).toEqual(editor.sketch.value);
  });
});
