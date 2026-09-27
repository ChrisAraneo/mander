import { filter } from 'lodash-es';
import { CHEST_PORTAL_GAP } from '../../../consts';
import type { Spot } from '../../find-standing-spots';

export const filterLeftOfPortal = (candidates: Spot[], anchor: number) =>
  filter(candidates, ({ column }) => column <= anchor - CHEST_PORTAL_GAP);
