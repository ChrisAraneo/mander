import { type Random, takeRandom } from '@mander/engine';
import type { ItemRarity } from '@mander/model';
import { takeRandomItemOfType } from './take-random-item-of-type';
import type { ChestPicking } from './types/chest-picking';

export const takeRandomCard = (
  picking: ChestPicking,
  rarity: ItemRarity,
  random: Random,
): ChestPicking =>
  takeRandomItemOfType(
    picking,
    takeRandom(picking.typesLeft, random),
    rarity,
    random,
  );
