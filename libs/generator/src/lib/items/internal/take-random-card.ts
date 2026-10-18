import type { createRandom } from '@mander/engine';
import type { ItemRarity } from '@mander/model';
import { filterTypesHolding } from './filter-types-holding';
import { takeRandomItemOfType } from './take-random-item-of-type';
import type { ChestPicking } from './types/chest-picking';

export const takeRandomCard = (
  picking: ChestPicking,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): ChestPicking =>
  takeRandomItemOfType(
    picking,
    random.pick(filterTypesHolding(picking.typesLeft, rarity)),
    rarity,
    random,
  );
