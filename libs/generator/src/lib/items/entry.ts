import type { Item } from '@mander/engine';
import type { CatalogEntry } from './catalog-entry';

export const entry = (item: Item, weight: number): CatalogEntry => ({
  item,
  weight,
});
