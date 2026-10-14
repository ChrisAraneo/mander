import { filter, size } from 'lodash-es';
import type { ChestEpicCount } from './types/chest-epic-count';
import type { ChestRarities } from './types/chest-rarities';

export const countChestEpics = ({
  rarities,
  random,
}: ChestRarities): ChestEpicCount => ({
  rarities,
  epics: size(filter(rarities, (rarity) => rarity === 'EPIC')),
  random,
});
