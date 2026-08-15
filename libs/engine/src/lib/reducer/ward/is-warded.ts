import type { HazardKind, Item } from '@mander/model';
import { some } from 'lodash-es';
import { match } from 'ts-pattern';

export const wards = (item: Item, hazard: HazardKind): boolean =>
  match(item.effect)
    .with({ kind: 'WARD' }, (effect) => effect.hazard === hazard)
    .otherwise(() => false);

export const isWarded = (
  inventory: readonly Item[],
  hazard: HazardKind,
): boolean => some(inventory, (item) => wards(item, hazard));
