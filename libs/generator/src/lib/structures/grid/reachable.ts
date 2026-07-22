import { maxJumpColumns } from './max-jump-columns';
import type { Surface } from './surface';

export function reachable(
  surfaces: Surface[],
  startIndex: number,
): Set<number> {
  const visited = new Set<number>([startIndex]);
  const queue = [startIndex];
  while (queue.length > 0) {
    const current = surfaces[queue.shift()!];
    surfaces.forEach((target, index) => {
      if (visited.has(index)) return;
      const columnDistance = Math.abs(target.col - current.col);
      if (columnDistance < 1 || columnDistance > 6) return;
      if (columnDistance <= maxJumpColumns(target.height - current.height)) {
        visited.add(index);
        queue.push(index);
      }
    });
  }
  return visited;
}
