import { map, orderBy, unionBy } from 'lodash-es';
import { pipe } from 'remeda';
import { createPlayable } from './internal/create-playable';
import { findCompletedWorld } from './internal/find-completed-world';
import { toPlayed } from './internal/to-played';
import { toPlayedFromRun } from './internal/to-played-from-run';
import type { PlayableWorld } from './types/playable-world';
import type { SaveData } from './types/save-data';

export const getPlayableWorlds = (save: SaveData): PlayableWorld[] =>
  pipe(
    unionBy(
      save.playedWorlds,
      map(save.completedWorlds, toPlayed),
      map(save.runs, toPlayedFromRun),
      'name',
    ),
    (worlds) =>
      map(worlds, (world) =>
        createPlayable(save, world, findCompletedWorld(save, world.name)),
      ),
    (worlds) => orderBy(worlds, ['playedAt', 'day'], ['desc', 'desc']),
  );
