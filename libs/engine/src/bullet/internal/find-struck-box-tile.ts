import type { Level, Point, Rectangle } from '@mander/model';
import { find } from 'lodash-es';
import { computeBulletTileCandidates } from './compute-bullet-tile-candidates';
import { isStruckSpikeTile } from './is-struck-spike-tile';

export const findStruckBoxTile = (
  level: Level,
  box: Rectangle,
): Point | undefined =>
  find(computeBulletTileCandidates(box), (tile) =>
    isStruckSpikeTile(level, box, tile),
  );
