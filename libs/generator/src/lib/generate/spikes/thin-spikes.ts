import { isSpikeTile, type Tile, TILE_AIR } from '@mander/engine';
import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  SPIKE_CLEAR_LEVEL,
  SPIKE_HALVED_UNTIL_LEVEL,
  SPIKE_KEEP_CHANCE,
} from '../../consts';
import type { Rng } from '../../rng';

type Verdict = 'CLEAR' | 'HALVE' | 'KEEP';

/**
 * How much of what grew actually survives, by level. The first level of a run
 * is walked bare so the player learns to move; the next three are thinned by a
 * coin toss; from the fifth on, every spike stands.
 */
const verdictFor = (levelIndex: number): Verdict =>
  match(levelIndex)
    .with(SPIKE_CLEAR_LEVEL, (): Verdict => 'CLEAR')
    .with(
      P.when((index) => index <= SPIKE_HALVED_UNTIL_LEVEL),
      (): Verdict => 'HALVE',
    )
    .otherwise((): Verdict => 'KEEP');

const survives = (rng: Rng, verdict: Verdict): boolean =>
  match(verdict)
    .with('CLEAR', () => false)
    .with('HALVE', () => rng.chance(SPIKE_KEEP_CHANCE))
    .otherwise(() => true);

/**
 * Rolls once per spike, left to right and top to bottom, so a seed always
 * thins a level the same way.
 */
export const thinSpikes = (
  rng: Rng,
  tiles: Tile[][],
  levelIndex: number,
): Tile[][] => {
  const verdict = verdictFor(levelIndex);
  return match(verdict)
    .with('KEEP', () => tiles)
    .otherwise(() =>
      map(tiles, (rowTiles) =>
        map(rowTiles, (tile): Tile =>
          match(isSpikeTile(tile) && !survives(rng, verdict))
            .with(true, (): Tile => TILE_AIR)
            .otherwise((): Tile => tile),
        ),
      ),
    );
};
