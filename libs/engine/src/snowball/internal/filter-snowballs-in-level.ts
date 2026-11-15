import type { Snowball } from '@mander/model';
import { filter } from 'lodash-es';
import { isSnowballOutOfLevel } from './is-snowball-out-of-level';
import type { SnowballFlight } from './types/snowball-flight';

export const filterSnowballsInLevel = ({
  snowballs,
  level,
}: SnowballFlight): Snowball[] =>
  filter(snowballs, (snowball) => !isSnowballOutOfLevel(level, snowball));
