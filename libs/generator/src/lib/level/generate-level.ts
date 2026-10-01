import type { Sector } from '@mander/structures';
import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { addLevelPadding } from './internal/add-level-padding';
import { clearLevelTraps } from './internal/clear-level-traps';
import { clearLevelWeapons } from './internal/clear-level-weapons';
import { createGameLevel } from './internal/create-game-level';
import { furnishLevel } from './internal/furnish-level';
import { joinLevelStructures } from './internal/join-level-structures';
import { placeLevelEnds } from './internal/place-level-ends';

export const generateLevel = (
  levelNumber: number,
  structures: Sector[],
  random: ReturnType<typeof createRandom>,
) =>
  flow(
    joinLevelStructures,
    clearLevelWeapons,
    placeLevelEnds,
    addLevelPadding,
    clearLevelTraps,
    furnishLevel,
    createGameLevel,
  )({ levelNumber, structures, random });
