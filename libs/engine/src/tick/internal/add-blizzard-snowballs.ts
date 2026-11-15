import type { Snowball } from '@mander/model';
import type { Blizzard } from '../../enemy/types/blizzard';

export const addBlizzardSnowballs = (
  snowballs: Snowball[],
  blizzard: Blizzard,
): Snowball[] => [...snowballs, ...blizzard.snowballs];
