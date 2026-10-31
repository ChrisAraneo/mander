import { randomizeEnemies } from '../../enemies/randomize-enemies';
import { getFastEnemyChance } from './get-fast-enemy-chance';
import { getFreezingEnemyChance } from './get-freezing-enemy-chance';
import { getHornedEnemyChance } from './get-horned-enemy-chance';
import { getShooterEnemyChance } from './get-shooter-enemy-chance';
import type { FurnishedLevel } from './types/furnished-level';

export const addLevelEnemies = ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles,
  backTiles,
  random,
}: FurnishedLevel): FurnishedLevel => ({
  levelNumber,
  levelVariant,
  season,
  structures,
  tiles: randomizeEnemies(
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
