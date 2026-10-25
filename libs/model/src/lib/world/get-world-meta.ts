import { map } from 'lodash-es';
import { toWorldLevelMeta } from './internal/to-world-level-meta';
import type { World } from './types/world';
import type { WorldMeta } from './types/world-meta';

export const getWorldMeta = (world: World): WorldMeta => ({
  name: world.name,
  levels: map(world.levels, toWorldLevelMeta),
});
