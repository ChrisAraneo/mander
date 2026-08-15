import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

export const startingFireballs = (inventory: readonly Item[]): number =>
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'FIREBALL' }, (effect) => effect.amount)
      .otherwise(() => 0),
  );
