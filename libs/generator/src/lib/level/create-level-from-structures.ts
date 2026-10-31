import type { GameLevel, Random } from '@mander/engine';
import type { Season } from '@mander/model';
import type { Sector } from '@mander/structures';
import { pipe } from 'remeda';
import type { LevelVariant } from '../types/level-variant';
import { addLevelEnds } from './internal/add-level-ends';
import { addLevelEnemies } from './internal/add-level-enemies';
import { addLevelFurniture } from './internal/add-level-furniture';
import { addLevelPadding } from './internal/add-level-padding';
import { createGameLevel } from './internal/create-game-level';
import { createLevelLayers } from './internal/create-level-layers';
import { removeLevelTraps } from './internal/remove-level-traps';
import { removeLevelWeapons } from './internal/remove-level-weapons';

export const createLevelFromStructures = (
  levelNumber: number,
  levelVariant: LevelVariant,
  season: Season,
  structures: Sector[],
  random: Random,
): GameLevel =>
  pipe(
    { levelNumber, levelVariant, season, structures, random },
    createLevelLayers,
    removeLevelWeapons,
    addLevelEnds,
    addLevelPadding,
    removeLevelTraps,
    addLevelFurniture,
    addLevelEnemies,
    createGameLevel,
  );
