import type { Sector } from '@mander/structures';
import { getLevelType } from '../../structures/get-level-type';
import { joinStructures } from '../../structures/layout/join-structures';

export const joinLevelStructures = ({
  seed,
  levelNumber,
  structures,
}: {
  seed: string;
  levelNumber: number;
  structures: Sector[];
}) => {
  const levelType = getLevelType(levelNumber);

  return {
    seed,
    levelNumber,
    levelType,
    structures,
    ...joinStructures(structures, levelType),
  };
};
