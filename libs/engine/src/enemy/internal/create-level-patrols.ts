import { type Random } from '@mander/common';
import { type Enemy, findEnemySpawns } from '@mander/model';
import { map } from 'lodash-es';
import type { GameLevel } from '../../state/types/game-level';
import { createSpawnPatrol } from './create-spawn-patrol';

export const createLevelPatrols = (level: GameLevel, random: Random): Enemy[] =>
  map(findEnemySpawns(level), (spawn) =>
    createSpawnPatrol(level, spawn, random),
  );
