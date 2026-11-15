import type { Bullet } from '@mander/model';
import { filter } from 'lodash-es';
import { isBulletOutOfLevel } from './is-bullet-out-of-level';
import type { BulletFlight } from './types/bullet-flight';

export const filterBulletsInLevel = ({
  bullets,
  level,
}: BulletFlight): Bullet[] =>
  filter(bullets, (bullet) => !isBulletOutOfLevel(level, bullet));
