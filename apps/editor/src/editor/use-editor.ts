import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { chain, withEffect } from '@mander/utils';
import { concat, includes, last, map, noop, size, slice } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computed, ref, type Ref } from 'vue';

import { cloneGrid } from './clone-grid';
import { createGrid } from './create-grid';
import { formatStructure } from './format-structure';
import { setRef } from './set-ref';
import { structureIssues } from './structure-issues';

const { nullish } = P;

const HISTORY_LIMIT = 50;

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

const withoutMarker = (grid: number[][], marker: number): number[][] =>
  map(cloneGrid(grid), (row) =>
    map(row, (cell) =>
      match(cell)
        .with(marker, () => TILE_AIR)
        .otherwise(() => cell),
    ),
  );

/** A start or an end may only exist once, so placing one clears the old. */
const applyPaint = (
  grid: Ref<number[][]>,
  row: number,
  column: number,
  value: number,
): void =>
  void chain(value)
    .thru((next) =>
      match(includes(MARKERS, next))
        .with(true, () => void setRef(grid, withoutMarker(grid.value, next)))
        .otherwise(noop),
    )
    .thru(() => (grid.value[row][column] = value))
    .value();

export const useEditor = () =>
  chain({
    grid: ref<number[][]>(createGrid()),
    brush: ref<number>(TILE_DIRT),
    history: ref<number[][][]>([]),
  })
    .thru((state) => ({
      ...state,
      issues: computed(() => structureIssues(state.grid.value)),
      remember: (): void =>
        void setRef(
          state.history,
          slice(
            concat(state.history.value, [cloneGrid(state.grid.value)]),
            -HISTORY_LIMIT,
          ),
        ),
    }))
    .thru((state) => ({
      ...state,
      paint: (row: number, column: number, value: number): void =>
        chain(state.grid.value[row]?.[column])
          .thru((current) =>
            match(current)
              .with(nullish, noop)
              .with(value, noop)
              .otherwise(() => applyPaint(state.grid, row, column, value)),
          )
          .value(),
      replace: (next: number[][]): void =>
        void chain(withEffect(next, () => state.remember()))
          .thru((grid) => setRef(state.grid, cloneGrid(grid)))
          .value(),
      undo: (): void =>
        void chain(last(state.history.value))
          .thru((previous) =>
            match(previous)
              .with(nullish, noop)
              .otherwise((restored) =>
                chain(restored)
                  .thru((grid) => setRef(state.grid, grid))
                  .thru(() =>
                    setRef(state.history, slice(state.history.value, 0, -1)),
                  )
                  .value(),
              ),
          )
          .value(),
    }))
    .thru((state) => ({
      brush: state.brush,
      canUndo: computed(() => size(state.history.value) > 0),
      clear: (): void => state.replace(createGrid()),
      eraseValue: TILE_AIR,
      grid: state.grid,
      issues: state.issues,
      isValid: computed(() => size(state.issues.value) === 0),
      output: computed(() => formatStructure(state.grid.value)),
      paint: state.paint,
      remember: state.remember,
      replace: state.replace,
      undo: state.undo,
    }))
    .value();
