import { type Bullet, isSpike, type Level, type Point } from '@mander/model';
import { find, flatMap, map } from 'lodash-es';
import { pipe } from 'remeda';
import { computeTileRange } from '../../collision/compute-tile-range';
import { computeBulletBox } from './compute-bullet-box';
import { computeProngBand } from './compute-prong-band';
import { isOverlappingBox } from './is-overlapping-box';

export const findStruckSpikeTile = (
  level: Level,
  bullet: Bullet,
): Point | undefined =>
  pipe(bullet, computeBulletBox, (box) =>
    find(
      flatMap(computeTileRange(box.y, box.height), (row) =>
        map(computeTileRange(box.x, box.width), (column): Point => ({
          x: column,
          y: row,
        })),
      ),
      (tile) =>
        isSpike(level, tile.x, tile.y) &&
        isOverlappingBox(box, computeProngBand(level, tile)),
    ),
  );
