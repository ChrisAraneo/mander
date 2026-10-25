import type { Random } from '@mander/engine';
import type { Sector } from '@mander/structures';
import { pipe } from 'remeda';
import { createStructureLayers } from '../../layout/create-structure-layers';
import { toLevelType } from '../../structures/to-level-type';
import type { LevelVariant } from '../../types/level-variant';
import type { LevelDraft } from './types/level-draft';

export const createLevelLayers = ({
  levelNumber,
  levelVariant,
  structures,
  random,
}: {
  levelNumber: number;
  levelVariant: LevelVariant;
  structures: Sector[];
  random: Random;
}): LevelDraft =>
  pipe(levelVariant, toLevelType, (levelType): LevelDraft => ({
    levelNumber,
    levelVariant,
    levelType,
    structures,
    ...createStructureLayers(structures, levelType),
    random,
  }));
