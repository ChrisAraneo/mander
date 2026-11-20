import type { Random } from '@mander/common';
import type { Item } from '@mander/model';
import { pipe } from 'remeda';
import { takeRandomChestRarities } from './internal/take-random-chest-rarities';
import { takeRandomEverydayItems } from './internal/take-random-everyday-items';

export const takeRandomChestItems = (random: Random): Item[] =>
  pipe({ random }, takeRandomChestRarities, takeRandomEverydayItems);
