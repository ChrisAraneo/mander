import { filter } from 'lodash-es';
import { CHEST_PORTAL_GAP } from '../../../consts';
import type { Spot } from '../../types/spot';

export const filterLeftOfPortal = (
  candidates: Spot[],
  anchor: number,
): Spot[] =>
  filter(candidates, ({ column }) => column <= anchor - CHEST_PORTAL_GAP);
