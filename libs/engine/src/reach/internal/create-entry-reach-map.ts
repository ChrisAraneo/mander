import type { Level, Player } from '@mander/model';
import { match, P } from 'ts-pattern';
import type { ReachMap } from '../types/reach-map';
import { computeReachedCells } from './compute-reached-cells';
import { createReachMap } from './create-reach-map';

const { nullish } = P;

export const createEntryReachMap = (
  level: Level,
  start: Player | undefined,
): ReachMap =>
  match(start)
    .with(nullish, () => createReachMap(level, new Set<number>()))
    .otherwise((entry) =>
      createReachMap(level, computeReachedCells(level, entry)),
    );
