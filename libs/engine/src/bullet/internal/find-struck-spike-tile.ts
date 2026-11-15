import type { Bullet, Level, Point } from '@mander/model';
import { computeBulletBox } from './compute-bullet-box';
import { findStruckBoxTile } from './find-struck-box-tile';

export const findStruckSpikeTile = (
  level: Level,
  bullet: Bullet,
): Point | undefined => findStruckBoxTile(level, computeBulletBox(bullet));
