import type { Item } from '@mander/model';
import { reduce } from 'lodash-es';
import { CHEST_ITEM_TYPES } from '../../consts';
import { takeRandomItem } from './take-random-item';
import type { ChestPicking } from './types/chest-picking';
import type { ChestRarities } from './types/chest-rarities';

export const takeRandomEverydayItems = ({
  rarities,
  random,
}: ChestRarities): Item[] =>
  reduce(
    rarities,
    (picking: ChestPicking, rarity): ChestPicking =>
      takeRandomItem(picking, rarity, random),
    { picked: [], typesLeft: [...CHEST_ITEM_TYPES] },
  ).picked;
