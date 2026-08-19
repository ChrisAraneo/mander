import {
  type FallingSpike,
  findFallingSpikeTiles,
  type Level,
  TERMINAL_VELOCITY,
  TILE_SIZE,
} from '@mander/model';
import { map } from 'lodash-es';

export const createFallingSpikes = (level: Level): FallingSpike[] =>
  map(findFallingSpikeTiles(level), (tile): FallingSpike => ({
    position: { x: tile.x * TILE_SIZE, y: tile.y * TILE_SIZE },
    velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
    statuses: { isFalling: false },
  }));
