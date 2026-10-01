import { times } from 'lodash-es';
import { CHEST_ITEM_COUNT } from '../../consts';
import type { createChestRandom } from './create-chest-random';
import { getRarity } from './get-rarity';

export const pickChestRarities = ({
  random,
}: ReturnType<typeof createChestRandom>) => ({
  random,
  rarities: times(CHEST_ITEM_COUNT, () => getRarity(random.rollFloat())),
});
