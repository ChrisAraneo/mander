import type { ItemRarity } from '@mander/model';
import { filter, size } from 'lodash-es';

export const countEpics = (rarities: ItemRarity[]): number =>
  size(filter(rarities, (rarity) => rarity === 'EPIC'));
