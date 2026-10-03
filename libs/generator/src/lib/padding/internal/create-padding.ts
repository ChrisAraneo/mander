import { SKY_HEIGHT } from '../../consts';
import type { getMissingDepth } from './get-missing-depth';

export const createPadding = ({
  tiles,
  depth,
}: ReturnType<typeof getMissingDepth>) => ({
  tiles,
  padding: {
    sky: SKY_HEIGHT,
    depth,
  },
});
