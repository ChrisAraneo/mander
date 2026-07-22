import type { Item } from '../types';
import type { CatalogEntry } from './catalog-entry';

export const entry = (item: Item, weight: number): CatalogEntry => ({
  item,
  weight,
});
