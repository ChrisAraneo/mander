import { SKY_HEIGHT } from '../../consts';
import type { computeMissingDepth } from './compute-missing-depth';

export const createPadding = ({
  tiles,
  depth,
}: ReturnType<typeof computeMissingDepth>) => ({
  tiles,
  padding: {
    sky: SKY_HEIGHT,
    depth,
  },
});
