import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

export const startingStars = (inventory: readonly Item[]): number =>
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'STAR' }, (effect) => effect.amount)
      .otherwise(() => 0),
  );
