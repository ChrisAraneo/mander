import { filter, size } from 'lodash-es';
import type { pickRandomChestRarities } from './pick-random-chest-rarities';

export const countChestEpics = ({
  random,
  rarities,
}: ReturnType<typeof pickRandomChestRarities>) => ({
  random,
  rarities,
  epics: size(filter(rarities, (rarity) => rarity === 'EPIC')),
});
