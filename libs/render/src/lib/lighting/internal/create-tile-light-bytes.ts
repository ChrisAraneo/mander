import { isSolidTile, type Level } from '@mander/model';
import { flatMap } from 'lodash-es';
import { match } from 'ts-pattern';
import { isBackAt } from '../../tile/is-back-at';
import { LIGHT_RECEIVER_WALL } from '../consts';
import { computeTileLightDensity } from './compute-tile-light-density';

export const createTileLightBytes = (level: Level): Uint8Array =>
  Uint8Array.from(
    flatMap(level.tiles, (cells, row) =>
      flatMap(cells, (tile, column) => [
        computeTileLightDensity(tile),
        match(isBackAt(level, column, row) || isSolidTile(tile))
          .with(true, () => LIGHT_RECEIVER_WALL)
          .otherwise(() => 0),
      ]),
    ),
  );
