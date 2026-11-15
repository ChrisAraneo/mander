import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const getBulletsAmount = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'NONE' }, () => 0)
    .with({ kind: 'HEART' }, () => 0)
    .with({ kind: 'SCORE' }, () => 0)
    .with({ kind: 'STAR' }, () => 0)
    .with({ kind: 'BULLET' }, (effect) => effect.amount)
    .exhaustive(() => 0);
