import { chain } from '@mander/utils';
import { findLast, keys, map, round, sortBy } from 'lodash-es';
import type { ItemCluster } from './types/item-cluster';

export const getItemCluster = (
  clusters: Readonly<Record<number, ItemCluster>>,
  count: number,
): ItemCluster =>
  chain(sortBy(map(keys(clusters), Number)))
    .thru(
      (counts) =>
        clusters[
          findLast(counts, (clusterCount) => clusterCount <= round(count)) ??
            counts[0]
        ],
    )
    .value();
