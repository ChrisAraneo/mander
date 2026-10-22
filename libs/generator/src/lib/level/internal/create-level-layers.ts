import type { createRandom } from '@mander/engine';
import { chain } from '@mander/model';
import type { Sector } from '@mander/structures';
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
  random: ReturnType<typeof createRandom>;
}): LevelDraft =>
  chain({ levelType: toLevelType(levelVariant) })
    .thru(({ levelType }) => ({
      levelNumber,
      levelVariant,
      levelType,
      structures,
      ...createStructureLayers(structures, levelType),
      random,
    }))
    .value();
