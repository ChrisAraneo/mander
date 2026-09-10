import { type Layers, TILE_AIR } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { chain, withEffect } from '@mander/utils';
import { concat, includes, last, map, noop, size, slice } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computed, ref, type Ref, watch } from 'vue';

import type { Brush, BrushLayer } from './brush';
import { DEFAULT_BRUSH } from './brushes';
import { cloneSketch } from './clone-grid';
import { createSketch, heightOf } from './create-grid';
import { fillSketch } from './fill-sketch';
import { formatStructure } from './format-structure';
import { setRef } from './set-ref';
import { structureIssues } from './structure-issues';
import type { Pool } from './structure-entry';

const { nullish } = P;

const HISTORY_LIMIT = 50;

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

const gridOf = (sketch: Layers, layer: BrushLayer): number[][] =>
  match(layer)
    .with('back', () => sketch.backTiles)
    .otherwise(() => sketch.tiles);

const withoutMarker = (grid: number[][], marker: number): number[][] =>
  map(grid, (row) =>
    map(row, (cell) =>
      match(cell)
        .with(marker, () => TILE_AIR)
        .otherwise(() => cell),
    ),
  );

// a sector is entered and left in one place, so painting a marker lifts the one
// that was there before
const cleared = (sketch: Layers, value: number): Layers =>
  match(includes(MARKERS, value))
    .with(true, (): Layers => ({
      ...sketch,
      tiles: withoutMarker(sketch.tiles, value),
    }))
    .otherwise(() => sketch);

const applyPaint = (
  sketch: Ref<Layers>,
  row: number,
  column: number,
  value: number,
  layer: BrushLayer,
): void =>
  void chain(setRef(sketch, cleared(sketch.value, value)))
    .thru((next) => (gridOf(next, layer)[row][column] = value))
    .value();

export const useEditor = (pool: Readonly<Ref<Pool>>) =>
  chain({
    sketch: ref<Layers>(createSketch(pool.value)),
    brush: ref<Brush>(DEFAULT_BRUSH),
    history: ref<Layers[]>([]),
  })
    .thru((state) => ({
      ...state,
      issues: computed(() => structureIssues(state.sketch.value, pool.value)),
      remember: (): void =>
        void setRef(
          state.history,
          slice(
            concat(state.history.value, [cloneSketch(state.sketch.value)]),
            -HISTORY_LIMIT,
          ),
        ),
    }))
    .thru((state) => ({
      ...state,
      paint: (
        row: number,
        column: number,
        value: number,
        layer: BrushLayer,
      ): void =>
        chain(gridOf(state.sketch.value, layer)[row]?.[column])
          .thru((current) =>
            match(current)
              .with(nullish, noop)
              .with(value, noop)
              .otherwise(() =>
                applyPaint(state.sketch, row, column, value, layer),
              ),
          )
          .value(),
      replace: (next: Layers): void =>
        void chain(withEffect(next, () => state.remember()))
          .thru((sketch) =>
            setRef(state.sketch, fillSketch(cloneSketch(sketch))),
          )
          .value(),
      undo: (): void =>
        void chain(last(state.history.value))
          .thru((previous) =>
            match(previous)
              .with(nullish, noop)
              .otherwise((restored) =>
                chain(restored)
                  .thru((sketch) => setRef(state.sketch, sketch))
                  .thru(() =>
                    setRef(state.history, slice(state.history.value, 0, -1)),
                  )
                  .value(),
              ),
          )
          .value(),
    }))
    .thru((state) =>
      withEffect(state, () =>
        watch(pool, (next) =>
          match(size(state.sketch.value.tiles) === heightOf(next))
            .with(true, noop)
            .otherwise(() => state.replace(createSketch(next))),
        ),
      ),
    )
    .thru((state) => ({
      brush: state.brush,
      canUndo: computed(() => size(state.history.value) > 0),
      clear: (): void => state.replace(createSketch(pool.value)),
      eraseValue: TILE_AIR,
      sketch: state.sketch,
      issues: state.issues,
      isValid: computed(() => size(state.issues.value) === 0),
      output: computed(() => formatStructure(state.sketch.value)),
      paint: state.paint,
      remember: state.remember,
      replace: state.replace,
      undo: state.undo,
    }))
    .value();
