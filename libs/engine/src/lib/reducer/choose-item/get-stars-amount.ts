import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const getStarsAmount = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'STAR' }, (effect) => effect.amount)
    .otherwise(() => 0);
