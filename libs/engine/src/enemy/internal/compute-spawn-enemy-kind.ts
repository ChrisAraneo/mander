import { type Random, isRollUnder } from '@mander/common';
import { type EnemyKind, type TileCell, isSolid } from '@mander/model';
import type { GameLevel } from '../../state/types/game-level';
import { toEnemyKind } from './to-enemy-kind';

const ROW_BELOW = 1;

export const computeSpawnEnemyKind = (
  level: GameLevel,
  spawn: TileCell,
  random: Random,
): EnemyKind =>
  toEnemyKind(
    spawn.tile,
    !isSolid(level, spawn.x, spawn.y + ROW_BELOW),
    isRollUnder(level.hornedEnemyChance, random),
    isRollUnder(level.fastEnemyChance, random),
    isRollUnder(level.shooterEnemyChance, random),
    isRollUnder(level.freezingEnemyChance, random),
  );
