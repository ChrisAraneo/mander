import type { Layers } from '@mander/model';
import { size, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { computed, ref, type Ref, watch } from 'vue';
import { createSketch } from './create-sketch';
import { DEFAULT_BRUSH } from './default-brush';
import { findStructureIssues } from './find-structure-issues';
import { formatStructure } from './format-structure';
import { patchPoolSketch } from './internal/patch-pool-sketch';
import type { Brush } from './types/brush';
import type { Editor } from './types/editor';
import type { Pool } from './types/pool';

export const useEditor = (pool: Readonly<Ref<Pool>>): Editor =>
  pipe(
    {
      pool,
      sketch: ref<Layers>(createSketch(pool.value)),
      brush: ref<Brush>(DEFAULT_BRUSH),
      history: ref<Layers[]>([]),
    },
    (state) => ({
      ...state,
      issues: computed(() =>
        findStructureIssues(state.sketch.value, pool.value),
      ),
    }),
    (state): Editor => ({
      ...state,
      isValid: computed(() => size(state.issues.value) === 0),
      canUndo: computed(() => size(state.history.value) > 0),
      output: computed(() => formatStructure(state.sketch.value)),
    }),
    (editor) =>
      tap(editor, () => watch(pool, (next) => patchPoolSketch(editor, next))),
  );
