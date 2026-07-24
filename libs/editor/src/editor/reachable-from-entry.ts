import {
  maxJumpColumns,
  type Structure,
  structureSurfaces,
} from '@mander/generator';
import { chain, findIndex, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

type Surfaces = ReturnType<typeof structureSurfaces>;
type Surface = Surfaces[number];

const isReachableStep = (from: Surface, target: Surface): boolean => {
  const columnDistance = Math.abs(target.col - from.col);
  return (
    columnDistance >= 1 &&
    columnDistance <= 6 &&
    columnDistance <= maxJumpColumns(target.height - from.height)
  );
};

const stepsFrom = (
  surfaces: Surfaces,
  visited: ReadonlySet<number>,
  fromIndex: number,
): number[] =>
  chain(surfaces)
    .map((target, index) => ({ index, target }))
    .filter(({ index }) => !visited.has(index))
    .filter(({ target }) => isReachableStep(surfaces[fromIndex], target))
    .map(({ index }) => index)
    .value();

const expand = (
  surfaces: Surfaces,
  visited: ReadonlySet<number>,
  frontier: number[],
): Set<number> =>
  match(
    chain(frontier)
      .flatMap((fromIndex) => stepsFrom(surfaces, visited, fromIndex))
      .uniq()
      .value(),
  )
    .with(P.when((next: number[]) => next.length === 0), () => new Set(visited))
    .otherwise((next) => expand(surfaces, new Set([...visited, ...next]), next));

export const reachableFromEntry = (
  grid: Structure,
): {
  surfaces: Surfaces;
  reached: boolean[];
} => {
  const surfaces = structureSurfaces(grid);
  const entryIndex = findIndex(surfaces, (surface) => surface.col === 0);
  const visited = match(entryIndex >= 0)
    .with(true, () => expand(surfaces, new Set([entryIndex]), [entryIndex]))
    .otherwise(() => new Set<number>());
  return { surfaces, reached: map(surfaces, (_, index) => visited.has(index)) };
};
