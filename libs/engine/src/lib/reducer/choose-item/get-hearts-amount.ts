import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const getHeartsAmount = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'HEART' }, (effect) => effect.amount)
    .otherwise(() => 0);
