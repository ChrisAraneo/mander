import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const getBulletsAmount = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'BULLET' }, (effect) => effect.amount)
    .otherwise(() => 0);
