import { type Random } from '@mander/common';
import type { Enemy, TileCell } from '@mander/model';
import type { GameLevel } from '../../state/types/game-level';
import { createPatrol } from '../create-patrol';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';
import { computeSpawnEnemyKind } from './compute-spawn-enemy-kind';

export const createSpawnPatrol = (
  level: GameLevel,
  spawn: TileCell,
  random: Random,
): Enemy =>
  createPatrol(
    { x: computeEnemySpawnX(spawn), y: computeEnemySpawnY(spawn) },
    computeSpawnEnemyKind(level, spawn, random),
  );
