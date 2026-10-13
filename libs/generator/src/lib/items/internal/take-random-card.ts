import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { filterTypesHolding } from './filter-types-holding';
import type { Picking } from './picking';
import { takeRandomItemOfType } from './take-random-item-of-type';

export const takeRandomCard = (
  picking: Picking,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): Picking =>
  takeRandomItemOfType(
    picking,
    random.pick(filterTypesHolding(picking.typesLeft, rarity)),
    rarity,
    random,
  );
