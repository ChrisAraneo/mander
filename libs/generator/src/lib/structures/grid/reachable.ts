import { chain } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { maxJumpColumns } from './max-jump-columns';
import type { Surface } from './surface';

const isReachableStep = (from: Surface, target: Surface): boolean => {
  const columnDistance = Math.abs(target.col - from.col);
  return (
    columnDistance >= 1 &&
    columnDistance <= 6 &&
    columnDistance <= maxJumpColumns(target.height - from.height)
  );
};

const stepsFrom = (
  surfaces: Surface[],
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
  surfaces: Surface[],
  visited: ReadonlySet<number>,
  frontier: number[],
): Set<number> =>
  match(
    chain(frontier)
      .flatMap((fromIndex) => stepsFrom(surfaces, visited, fromIndex))
      .uniq()
      .value(),
  )
    .with(
      P.when((next: number[]) => next.length === 0),
      () => new Set(visited),
    )
    .otherwise((next) =>
      expand(surfaces, new Set([...visited, ...next]), next),
    );

export const reachable = (
  surfaces: Surface[],
  startIndex: number,
): Set<number> => expand(surfaces, new Set([startIndex]), [startIndex]);
