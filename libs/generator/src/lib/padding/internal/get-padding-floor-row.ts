import { last } from 'lodash-es';
import type { PaddingFloor } from './types/padding-floor';
import type { PaddingPlan } from './types/padding-plan';

export const getPaddingFloorRow = ({
  tiles,
  padding,
}: PaddingPlan): PaddingFloor => ({
  tiles,
  padding,
  floor: last(tiles),
});
