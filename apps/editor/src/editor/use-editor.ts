import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { computed, ref } from 'vue';

import { cloneGrid } from './clone-grid';
import { createGrid } from './create-grid';
import { formatStructure } from './format-structure';
import { structureIssues } from './structure-issues';

const HISTORY_LIMIT = 50;

export const useEditor = () => {
  const grid = ref<number[][]>(createGrid());
  const brush = ref<number>(TILE_DIRT);
  const history = ref<number[][][]>([]);

  const issues = computed(() => structureIssues(grid.value));
  const isValid = computed(() => issues.value.length === 0);
  const output = computed(() => formatStructure(grid.value));
  const canUndo = computed(() => history.value.length > 0);

  const remember = (): void => {
    history.value = [...history.value, cloneGrid(grid.value)].slice(
      -HISTORY_LIMIT,
    );
  };

  /**
   * A structure has one way in and one way out, so painting a marker moves it
   * rather than adding a second.
   */
  const clearMarker = (marker: number): void => {
    grid.value = cloneGrid(grid.value).map((row) =>
      row.map((cell) => (cell === marker ? TILE_AIR : cell)),
    );
  };

  const paint = (row: number, column: number, value: number): void => {
    const current = grid.value[row]?.[column];
    if (current === undefined || current === value) return;
    if (value === STRUCTURE_START || value === STRUCTURE_END)
      clearMarker(value);
    grid.value[row][column] = value;
  };

  const replace = (next: number[][]): void => {
    remember();
    grid.value = cloneGrid(next);
  };

  const clear = (): void => replace(createGrid());

  const undo = (): void => {
    const previous = history.value.at(-1);
    if (previous === undefined) return;
    grid.value = previous;
    history.value = history.value.slice(0, -1);
  };

  return {
    brush,
    canUndo,
    clear,
    eraseValue: TILE_AIR,
    grid,
    issues,
    isValid,
    output,
    paint,
    remember,
    replace,
    undo,
  };
};
