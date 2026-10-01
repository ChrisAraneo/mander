import type { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { CHEST_ITEM_COUNT } from '../../consts';
import { getRarity } from './get-rarity';

export const pickChestRarities = ({
  random,
}: {
  random: ReturnType<typeof createRandom>;
}) => ({
  random,
  rarities: times(CHEST_ITEM_COUNT, () => getRarity(random.rollFloat())),
});
