import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import type { Picking } from './picking';
import { findTypesHolding } from './find-types-holding';
import { pickRandomItemOfType } from './pick-random-item-of-type';

export const pickRandomCard = (
  picking: Picking,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): Picking =>
  pickRandomItemOfType(
    picking,
    random.pick(findTypesHolding(picking.typesLeft, rarity)),
    rarity,
    random,
  );
