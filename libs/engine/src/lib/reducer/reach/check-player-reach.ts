import { type Level } from '@mander/model';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { computeReachedCells } from './internal/compute-reached-cells';
import { createReachMap } from './internal/create-reach-map';
import { findEntryPlayer } from './internal/find-entry-player';
import type { ReachMap } from './types/reach-map';

const { nullish } = P;

export const checkPlayerReach = (level: Level): ReachMap =>
  pipe(level, findEntryPlayer, (start) =>
    match(start)
      .with(nullish, () => createReachMap(level, new Set<number>()))
      .otherwise((entry) =>
        createReachMap(level, computeReachedCells(level, entry)),
      ),
  );
