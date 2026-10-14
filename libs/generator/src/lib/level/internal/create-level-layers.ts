import type { Sector } from '@mander/structures';
import { chain, type createRandom } from '@mander/utils';
import { createStructureLayers } from '../../layout/create-structure-layers';
import { toLevelType } from '../../structures/to-level-type';
import type { LevelDraft } from './types/level-draft';

export const createLevelLayers = ({
  levelNumber,
  structures,
  random,
}: {
  levelNumber: number;
  structures: Sector[];
  random: ReturnType<typeof createRandom>;
}): LevelDraft =>
  chain({ levelType: toLevelType(levelNumber) })
    .thru(({ levelType }) => ({
      levelNumber,
      levelType,
      structures,
      ...createStructureLayers(structures, levelType),
      random,
    }))
    .value();
