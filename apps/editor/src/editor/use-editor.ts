import {
  AIR,
  BLOCK,
  formatStructure,
  structureIssues,
  type Structure,
} from '@mander/generator';
import { computed, ref } from 'vue';

import { cloneGrid } from './clone-grid';
import { createGrid } from './create-grid';

const HISTORY_LIMIT = 50;

export const useEditor = () => {
  const grid = ref<Structure>(createGrid());
  const brush = ref<number>(BLOCK);
  const history = ref<Structure[]>([]);

  const issues = computed(() => structureIssues(grid.value));
  const isValid = computed(() => issues.value.length === 0);
  const output = computed(() => formatStructure(grid.value));
  const canUndo = computed(() => history.value.length > 0);

  const remember = (): void => {
    history.value = [...history.value, cloneGrid(grid.value)].slice(
      -HISTORY_LIMIT,
    );
  };

  const paint = (row: number, column: number, value: number): void => {
    const current = grid.value[row]?.[column];
    if (current === undefined || current === value) return;
    grid.value[row][column] = value;
  };

  const replace = (next: Structure): void => {
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
    eraseValue: AIR,
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
