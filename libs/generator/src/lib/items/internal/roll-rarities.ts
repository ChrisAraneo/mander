import type { ItemRarity } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { CHEST_ITEM_COUNT } from '../../consts';
import { getRarity } from './get-rarity';

export const rollRarities = (
  random: ReturnType<typeof createRandom>,
): ItemRarity[] => times(CHEST_ITEM_COUNT, () => getRarity(random.rollFloat()));
