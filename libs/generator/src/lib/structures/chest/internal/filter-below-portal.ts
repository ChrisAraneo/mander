import { filter } from 'lodash-es';
import { CHEST_PORTAL_GAP } from '../../../consts';
import type { Spot } from '../../find-standing-spots';

export const filterBelowPortal = (candidates: Spot[], anchor: number) =>
  filter(candidates, ({ row }) => row >= anchor + CHEST_PORTAL_GAP);
