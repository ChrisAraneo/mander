import { filter, size } from 'lodash-es';
import type { rollChestRarities } from './roll-chest-rarities';

export const countChestEpics = ({
  random,
  rarities,
}: ReturnType<typeof rollChestRarities>) => ({
  random,
  rarities,
  epics: size(filter(rarities, (rarity) => rarity === 'EPIC')),
});
