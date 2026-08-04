import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const scoreGain = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'SCORE' }, (effect) => effect.amount)
    .otherwise(() => 0);
