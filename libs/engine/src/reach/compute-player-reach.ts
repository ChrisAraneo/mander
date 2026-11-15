import type { Level } from '@mander/model';
import { createEntryReachMap } from './internal/create-entry-reach-map';
import { findEntryPlayer } from './internal/find-entry-player';
import type { ReachMap } from './types/reach-map';

export const computePlayerReach = (level: Level): ReachMap =>
  createEntryReachMap(level, findEntryPlayer(level));
