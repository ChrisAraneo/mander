import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

export const countStartingStars = (inventory: readonly Item[]): number =>
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'NONE' }, () => 0)
      .with({ kind: 'HEART' }, () => 0)
      .with({ kind: 'SCORE' }, () => 0)
      .with({ kind: 'STAR' }, (effect) => effect.amount)
      .with({ kind: 'BULLET' }, () => 0)
      .exhaustive(() => 0),
  );
