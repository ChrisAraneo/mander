import type { Item } from '@mander/generator';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

import { BASE_HEARTS } from './constants';

export const startingHearts = (inventory: readonly Item[]): number =>
  BASE_HEARTS +
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'HEART' }, (effect) => effect.amount)
      .otherwise(() => 0),
  );
