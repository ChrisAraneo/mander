import { last } from 'lodash-es';
import type { createPadding } from './create-padding';

export const getFloorRow = ({
  tiles,
  padding,
}: ReturnType<typeof createPadding>) => ({
  tiles,
  padding,
  floor: last(tiles),
});
