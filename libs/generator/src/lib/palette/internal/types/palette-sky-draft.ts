import type { createRandom } from '@mander/engine';
import type { PaletteSky } from './palette-sky';

export interface PaletteSkyDraft {
  sky: PaletteSky;
  random: ReturnType<typeof createRandom>;
}
