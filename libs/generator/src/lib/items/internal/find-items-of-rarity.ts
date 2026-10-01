import type { Item, ItemRarity } from '@mander/model';
import { filter, isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';

export const findItemsOfRarity = (items: Item[], rarity: ItemRarity): Item[] =>
  match(filter(items, { rarity }))
    .when(isEmpty, () => items)
    .otherwise((matching) => matching);
