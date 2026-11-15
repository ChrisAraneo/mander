import type { Cannonball } from '@mander/model';
import { filter } from 'lodash-es';
import { isCannonballOutOfLevel } from './is-cannonball-out-of-level';
import type { CannonballFlight } from './types/cannonball-flight';

export const filterCannonballsInLevel = ({
  cannonballs,
  level,
}: CannonballFlight): Cannonball[] =>
  filter(
    cannonballs,
    (cannonball) => !isCannonballOutOfLevel(level, cannonball),
  );
