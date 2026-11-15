import type { Item } from '@mander/model';
import { match } from 'ts-pattern';

export const getHeartsAmount = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'NONE' }, () => 0)
    .with({ kind: 'HEART' }, (effect) => effect.amount)
    .with({ kind: 'SCORE' }, () => 0)
    .with({ kind: 'STAR' }, () => 0)
    .with({ kind: 'BULLET' }, () => 0)
    .exhaustive(() => 0);
