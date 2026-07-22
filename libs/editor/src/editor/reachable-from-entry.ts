import {
  maxJumpColumns,
  type Structure,
  structureSurfaces,
} from '@mander/generator';
import { findIndex, forEach, map } from 'lodash-es';

export function reachableFromEntry(grid: Structure): {
  surfaces: ReturnType<typeof structureSurfaces>;
  reached: boolean[];
} {
  const surfaces = structureSurfaces(grid);
  const reached = map(surfaces, () => false);
  const entryIndex = findIndex(surfaces, (surface) => surface.col === 0);
  if (entryIndex >= 0) {
    reached[entryIndex] = true;
    const queue = [entryIndex];
    while (queue.length > 0) {
      const current = surfaces[queue.shift()!];
      forEach(surfaces, (target, index) => {
        if (reached[index]) return;
        const columnDistance = Math.abs(target.col - current.col);
        if (columnDistance < 1 || columnDistance > 6) return;
        if (columnDistance <= maxJumpColumns(target.height - current.height)) {
          reached[index] = true;
          queue.push(index);
        }
      });
    }
  }
  return { surfaces, reached };
}
