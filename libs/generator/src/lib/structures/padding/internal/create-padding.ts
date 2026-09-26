import type { getMissingDepth } from './get-missing-depth';

const SKY_HEIGHT = 20;

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
