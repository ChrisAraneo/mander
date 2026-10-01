import { filter, size } from 'lodash-es';
import type { pickChestRarities } from './pick-chest-rarities';

export const countChestEpics = ({
  random,
  rarities,
}: ReturnType<typeof pickChestRarities>) => ({
  random,
  rarities,
  epics: size(filter(rarities, (rarity) => rarity === 'EPIC')),
});
