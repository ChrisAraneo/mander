import type { Random } from '@mander/engine';
import { times } from 'lodash-es';
import { CHEST_ITEM_COUNT } from '../../consts';
import { toRarity } from './to-rarity';
import type { ChestRarities } from './types/chest-rarities';

export const takeRandomChestRarities = ({
  random,
}: {
  random: Random;
}): ChestRarities => ({
  rarities: times(CHEST_ITEM_COUNT, () => toRarity(random())),
  random,
});
