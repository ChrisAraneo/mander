import type { Sector } from '@mander/structures';
import type { createRandom } from '@mander/utils';
import { getLevelType } from '../../structures/get-level-type';
import { joinStructures } from '../../layout/join-structures';

export const joinLevelStructures = ({
  levelNumber,
  structures,
  random,
}: {
  levelNumber: number;
  structures: Sector[];
  random: ReturnType<typeof createRandom>;
}) => {
  const levelType = getLevelType(levelNumber);

  return {
    random,
    levelNumber,
    levelType,
    structures,
    ...joinStructures(structures, levelType),
  };
};
