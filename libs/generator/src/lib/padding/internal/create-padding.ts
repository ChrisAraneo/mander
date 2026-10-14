import { SKY_HEIGHT } from '../../consts';
import type { PaddingDepth } from './types/padding-depth';
import type { PaddingPlan } from './types/padding-plan';

export const createPadding = ({ tiles, depth }: PaddingDepth): PaddingPlan => ({
  tiles,
  padding: {
    sky: SKY_HEIGHT,
    depth,
  },
});
