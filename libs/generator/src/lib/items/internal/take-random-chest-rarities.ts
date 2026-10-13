import type { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { CHEST_ITEM_COUNT } from '../../consts';
import { toRarity } from './to-rarity';

export const takeRandomChestRarities = ({
  random,
}: {
  random: ReturnType<typeof createRandom>;
}) => ({
  rarities: times(CHEST_ITEM_COUNT, () => toRarity(random.rollFloat())),
  random,
});
