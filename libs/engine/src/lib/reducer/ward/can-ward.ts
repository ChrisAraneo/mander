import type { HazardKind, Item } from '@mander/model';
import { match } from 'ts-pattern';

export const canWard = (item: Item, hazard: HazardKind): boolean =>
  match(item.effect)
    .with({ kind: 'NONE' }, () => false)
    .with({ kind: 'HEART' }, () => false)
    .with({ kind: 'SCORE' }, () => false)
    .with({ kind: 'STAR' }, () => false)
    .with({ kind: 'BULLET' }, () => false)
    .with({ kind: 'FIREBALL' }, () => false)
    .with({ kind: 'WARD' }, (effect) => effect.hazard === hazard)
    .exhaustive(() => false);
