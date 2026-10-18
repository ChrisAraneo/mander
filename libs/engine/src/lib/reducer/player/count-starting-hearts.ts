import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';
import { BASE_HEARTS } from './consts';

export const countStartingHearts = (inventory: readonly Item[]): number =>
  BASE_HEARTS +
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'NONE' }, () => 0)
      .with({ kind: 'HEART' }, (effect) => effect.amount)
      .with({ kind: 'SCORE' }, () => 0)
      .with({ kind: 'STAR' }, () => 0)
      .with({ kind: 'BULLET' }, () => 0)
      .exhaustive(() => 0),
  );
