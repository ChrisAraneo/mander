import type { GameState } from '@mander/engine';
import type { World } from '@mander/model';
import { size } from 'lodash-es';

export const shouldWriteScore = (
  world: World,
  previous: GameState,
  next: GameState,
): boolean =>
  next.status === 'COMPLETE' &&
  previous.status !== 'COMPLETE' &&
  next.levelIndex < size(world.levels) - 1;
