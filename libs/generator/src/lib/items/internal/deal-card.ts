import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import type { Deal } from './deal';
import { findTypesHolding } from './find-types-holding';
import { takeType } from './take-type';

export const dealCard = (
  deal: Deal,
  rarity: ItemRarity,
  random: ReturnType<typeof createRandom>,
): Deal =>
  takeType(
    deal,
    random.pick(findTypesHolding(deal.typesLeft, rarity)),
    rarity,
    random,
  );
