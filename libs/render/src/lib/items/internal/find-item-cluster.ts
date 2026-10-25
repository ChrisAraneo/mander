import { findLast, keys, map, round, sortBy } from 'lodash-es';
import { pipe } from 'remeda';
import type { ItemCluster } from './types/item-cluster';

export const findItemCluster = (
  clusters: Readonly<Record<number, ItemCluster>>,
  count: number,
): ItemCluster =>
  pipe(
    clusters,
    keys,
    (countKeys) => sortBy(map(countKeys, Number)),
    (counts) =>
      findLast(counts, (clusterCount) => clusterCount <= round(count)) ??
      counts[0],
    (clusterCount) => clusters[clusterCount],
  );
