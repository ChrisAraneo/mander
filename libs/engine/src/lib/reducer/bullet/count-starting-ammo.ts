import type { Item } from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

export const countStartingAmmo = (inventory: readonly Item[]): number =>
  sumBy(inventory, (item) =>
    match(item.effect)
      .with({ kind: 'NONE' }, () => 0)
      .with({ kind: 'HEART' }, () => 0)
      .with({ kind: 'SCORE' }, () => 0)
      .with({ kind: 'STAR' }, () => 0)
      .with({ kind: 'BULLET' }, (effect) => effect.amount)
      .exhaustive(() => 0),
  );
