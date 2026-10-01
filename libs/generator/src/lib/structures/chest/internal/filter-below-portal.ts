import { filter } from 'lodash-es';
import { CHEST_PORTAL_GAP } from '../../../consts';
import type { Spot } from '../../types/spot';

export const filterBelowPortal = (candidates: Spot[], anchor: number): Spot[] =>
  filter(candidates, ({ row }) => row >= anchor + CHEST_PORTAL_GAP);
