import type { Random } from '@mander/common';
import type { Sector } from '@mander/structures';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';
import { getStructures } from './get-structures';

const sortRandomly = (
  structures: readonly Sector[],
  random: Random,
): Sector[] => sortBy(structures, () => random());

const computeRoundsNeeded = (
  count: number,
  structures: readonly Sector[],
): number => ceil(count / size(structures));

const takeRandomRounds = (
  count: number,
  structures: readonly Sector[],
  random: Random,
): Sector[] =>
  take(
    flatMap(range(computeRoundsNeeded(count, structures)), () =>
      sortRandomly(structures, random),
    ),
    count,
  );

export const takeRandomStructures = (
  count: number,
  levelCategory: LevelCategory,
  random: Random,
): Sector[] => takeRandomRounds(count, getStructures(levelCategory), random);
