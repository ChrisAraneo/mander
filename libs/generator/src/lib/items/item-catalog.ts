import type { CatalogEntry } from './catalog-entry';
import { entry } from './entry';

export const ITEM_CATALOG: readonly CatalogEntry[] = [
  entry(
    {
      id: 'EMBER-HEART',
      name: 'Ember Heart',
      description:
        'A spare ember that beats in your chest. Soak up one more hit before you fall. (+1 heart)',
      rarity: 'COMMON',
      effect: { kind: 'HEART', amount: 1 },
    },
    1,
  ),
];
