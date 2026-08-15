import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

export const startingAmmo = (inventory: readonly Item[]): number =>
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'BULLET' }, (effect) => effect.amount)
      .otherwise(() => 0),
  );
