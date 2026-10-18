import type { HazardKind, Item } from '@mander/model';
import { some } from 'lodash-es';
import { canWard } from './can-ward';

export const isWarded = (
  inventory: readonly Item[],
  hazard: HazardKind,
): boolean => some(inventory, (item) => canWard(item, hazard));
