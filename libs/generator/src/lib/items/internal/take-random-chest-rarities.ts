import type { createRandom } from '@mander/engine';
import { times } from 'lodash-es';
import { CHEST_ITEM_COUNT } from '../../consts';
import { toRarity } from './to-rarity';
import type { ChestRarities } from './types/chest-rarities';

export const takeRandomChestRarities = ({
  random,
}: {
  random: ReturnType<typeof createRandom>;
}): ChestRarities => ({
  rarities: times(CHEST_ITEM_COUNT, () => toRarity(random.rollFloat())),
  random,
});
