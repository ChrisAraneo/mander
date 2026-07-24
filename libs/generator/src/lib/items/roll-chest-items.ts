import { chain, findIndex, reduce, sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Rng } from '../rng';
import type { Item } from '../types';
import type { CatalogEntry } from './catalog-entry';
import { CHEST_ITEM_COUNT } from './constants';
import { ITEM_CATALOG } from './item-catalog';

const cumulativeRemainders = (
  pool: readonly CatalogEntry[],
  target: number,
): number[] =>
  reduce(
    pool,
    (remainders, entry) => [
      ...remainders,
      (remainders.at(-1) ?? target) - entry.weight,
    ],
    [] as number[],
  );

const pickWeightedIndex = (rng: Rng, pool: readonly CatalogEntry[]): number =>
  Math.max(
    findIndex(
      cumulativeRemainders(pool, rng.next() * sumBy(pool, 'weight')),
      (remaining) => remaining <= 0,
    ),
    0,
  );

const withoutIndex = <Value>(values: readonly Value[], index: number): Value[] => [
  ...values.slice(0, index),
  ...values.slice(index + 1),
];

const shouldStopDrawing = (
  pool: readonly CatalogEntry[],
  drawn: readonly Item[],
): boolean => drawn.length >= CHEST_ITEM_COUNT || pool.length === 0;

const drawItems = (
  rng: Rng,
  pool: readonly CatalogEntry[],
  drawn: readonly Item[],
): Item[] =>
  match(shouldStopDrawing(pool, drawn))
    .with(true, () => [...drawn])
    .otherwise(() =>
      chain(pickWeightedIndex(rng, pool))
        .thru((index) =>
          drawItems(
            rng,
            withoutIndex(pool, index),
            [...drawn, pool[index].item],
          ),
        )
        .value(),
    );

export const rollChestItems = (rng: Rng): Item[] => drawItems(rng, ITEM_CATALOG, []);
