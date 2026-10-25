import { map } from 'lodash-es';
import type { Level } from '../types/level';
import type { World } from './types/world';
import type { WorldLevelMeta } from './types/world-level-meta';
import type { WorldMeta } from './types/world-meta';

const EMPTY_STRUCTURES: string[] = [];

const toWorldLevelMeta = (level: Level, index: number): WorldLevelMeta => ({
  level: index + 1,
  structures: level.meta?.structures ?? EMPTY_STRUCTURES,
});

export const getWorldMeta = (world: World): WorldMeta => ({
  name: world.name,
  levels: map(world.levels, toWorldLevelMeta),
});
