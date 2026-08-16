import { find, map, orderBy, unionBy } from 'lodash-es';

import type { CompletedWorld, PlayedWorld, SaveData } from './save-data';

export interface PlayableWorld {
  name: string;
  day: string;
  playedAt: string;
  runs: number;
  completed: CompletedWorld | null;
}

const asPlayed = (world: CompletedWorld): PlayedWorld => ({
  name: world.name,
  day: world.day,
  playedAt: '',
  runs: 1,
});

export const playableWorlds = (save: SaveData): PlayableWorld[] =>
  orderBy(
    map(
      unionBy(save.playedWorlds, map(save.completedWorlds, asPlayed), 'name'),
      (world): PlayableWorld => ({
        ...world,
        completed: find(save.completedWorlds, { name: world.name }) ?? null,
      }),
    ),
    ['playedAt', 'day'],
    ['desc', 'desc'],
  );
