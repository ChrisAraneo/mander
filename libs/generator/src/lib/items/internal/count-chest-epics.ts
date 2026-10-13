import { filter, size } from 'lodash-es';
import type { takeRandomChestRarities } from './take-random-chest-rarities';

export const countChestEpics = ({
  rarities,
  random,
}: ReturnType<typeof takeRandomChestRarities>) => ({
  rarities,
  epics: size(filter(rarities, (rarity) => rarity === 'EPIC')),
  random,
});
