import { patchEnemies } from '../../enemies/patch-enemies';
import { getFastEnemyChance } from './get-fast-enemy-chance';
import { getFreezingEnemyChance } from './get-freezing-enemy-chance';
import { getHornedEnemyChance } from './get-horned-enemy-chance';
import { getShooterEnemyChance } from './get-shooter-enemy-chance';
import type { LevelFurniture } from './types/level-furniture';

export const addLevelEnemies = ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: LevelFurniture): LevelFurniture => ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles: patchEnemies(
    tiles,
    {
      horned: getHornedEnemyChance(levelNumber, season),
      fast: getFastEnemyChance(levelNumber, season),
      shooter: getShooterEnemyChance(levelNumber, season),
      freezing: getFreezingEnemyChance(levelNumber, season),
    },
    random,
  ),
  backTiles,
  random,
});
