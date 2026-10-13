import type { createPaletteSky } from './create-palette-sky';
import { createRandomGround } from './create-random-ground';

export const createPaletteGround = ({
  sky,
  random,
}: ReturnType<typeof createPaletteSky>) => ({
  sky,
  ground: createRandomGround(random),
});
