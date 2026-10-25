import type { Random } from '@mander/engine';
import type { Item } from '@mander/model';
import { takeRandomChestRarities } from './internal/take-random-chest-rarities';
import { takeRandomEverydayItems } from './internal/take-random-everyday-items';

export const takeRandomChestItems = (random: Random): Item[] =>
  takeRandomEverydayItems(takeRandomChestRarities({ random }).rarities, random);
