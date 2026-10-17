import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const getScoreAmount = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'NONE' }, () => 0)
    .with({ kind: 'HEART' }, () => 0)
    .with({ kind: 'SCORE' }, (effect) => effect.amount)
    .with({ kind: 'STAR' }, () => 0)
    .with({ kind: 'BULLET' }, () => 0)
    .with({ kind: 'FIREBALL' }, () => 0)
    .with({ kind: 'WARD' }, () => 0)
    .exhaustive(() => 0);
