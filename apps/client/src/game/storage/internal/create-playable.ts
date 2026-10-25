import type { CompletedWorld } from '../types/completed-world';
import type { PlayableWorld } from '../types/playable-world';
import type { PlayedWorld } from '../types/played-world';
import type { SaveData } from '../types/save-data';
import { computeWorldReplays } from './compute-world-replays';

export const createPlayable = (
  save: SaveData,
  world: PlayedWorld,
  completed: CompletedWorld | null,
): PlayableWorld => ({
  ...world,
  completed,
  replays: computeWorldReplays(save, world.name, completed),
});
