import { type Random, tryTakeRandom } from '@mander/common';
import type { ItemRarity } from '@mander/model';
import { takeRandomItemOfType } from './take-random-item-of-type';
import type { ChestPicking } from './types/chest-picking';

export const takeRandomItem = (
  picking: ChestPicking,
  rarity: ItemRarity,
  random: Random,
): ChestPicking =>
  takeRandomItemOfType(
    picking,
    tryTakeRandom(picking.typesLeft, random),
    rarity,
    random,
  );
