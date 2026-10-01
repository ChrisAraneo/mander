import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import type { Picking } from './picking';
import { findTypesHolding } from './find-types-holding';
import { takeType } from './take-type';

export const pickCard = (
  picking: Picking,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): Picking =>
  takeType(
    picking,
    random.pick(findTypesHolding(picking.typesLeft, rarity)),
    rarity,
    random,
  );
