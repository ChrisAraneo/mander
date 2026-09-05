import { map } from 'lodash-es';

import type { Level } from '../level/level';
import type { World } from './world';
import type { WorldLevelMeta, WorldMeta } from './world-meta';

const EMPTY_STRUCTURES: string[] = [];

const levelMetaOf = (level: Level, index: number): WorldLevelMeta => ({
  level: index + 1,
  structures: level.meta?.structures ?? EMPTY_STRUCTURES,
});

export const getWorldMeta = (world: World): WorldMeta => ({
  name: world.name,
  levels: map(world.levels, levelMetaOf),
});
