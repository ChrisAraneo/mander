import {
  isSpikeTile,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/engine';
import { filter, flatten, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  breakLongRuns,
  dropLoneSpikes,
  dropSqueezedSpikes,
  dropWalledSpikes,
  growSpikes,
  sowSpikes,
  thinSpikes,
} from './generate/spikes';
import { createRng } from './rng';

const CHARS: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  v: TILE_SPIKE_CEILING,
};

const TILES: Record<number, string> = {
  [TILE_AIR]: '.',
  [TILE_DIRT]: '#',
  [TILE_SPIKE]: '^',
  [TILE_SPIKE_CEILING]: 'v',
};

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (char) => CHARS[char]));

const draw = (tiles: Tile[][]): string[] =>
  map(tiles, (row) => map(row, (tile) => TILES[tile]).join(''));

const countSpikes = (tiles: Tile[][]): number =>
  filter(flatten(tiles), isSpikeTile).length;

describe('sowSpikes', () => {
  it('puts a spike on every block with headroom over it', () => {
    expect(
      draw(
        sowSpikes(
          grid([
            '....', //
            '....',
            '....',
            '####',
          ]),
        ),
      ),
    ).toEqual([
      '....', //
      '....',
      '^^^^',
      '####',
    ]);
  });

  it('leaves a crawlspace bare — a spike there could not be avoided', () => {
    // Column 1 has a ceiling two rows up, one short of the headroom asked for,
    // so the floor under it stays clear. The top of that ceiling block has all
    // the sky it wants, and takes a spike like any other block would.
    expect(
      draw(
        sowSpikes(
          grid([
            '....', //
            '.#..',
            '....',
            '####',
          ]),
        ),
      ),
    ).toEqual([
      '.^..', //
      '.#..',
      '^.^^',
      '####',
    ]);
  });

  it('grows on a platform as readily as on the ground', () => {
    expect(
      draw(
        sowSpikes(
          grid([
            '.....', //
            '.....',
            '.....',
            '.##..',
            '.....',
          ]),
        ),
      ),
    ).toEqual([
      '.....', //
      '.....',
      '.^^..',
      '.##..',
      '.....',
    ]);
  });
});

describe('breakLongRuns', () => {
  it('leaves a run the player can already hop', () => {
    expect(draw(breakLongRuns(grid(['^^^.'])))).toEqual(['^^^.']);
  });

  it('takes the middle two out of a run of four', () => {
    expect(draw(breakLongRuns(grid(['^^^^'])))).toEqual(['^..^']);
  });

  it('keeps breaking until no wall is left standing', () => {
    // Twelve splits into 5 and 5, and each of those splits again into 1 and 2.
    expect(draw(breakLongRuns(grid(['^^^^^^^^^^^^'])))).toEqual([
      '^..^^..^..^^',
    ]);
  });

  it('breaks each row on its own', () => {
    expect(
      draw(
        breakLongRuns(
          grid([
            '^^^^', //
            '.^^.',
          ]),
        ),
      ),
    ).toEqual([
      '^..^', //
      '.^^.',
    ]);
  });
});

describe('dropLoneSpikes', () => {
  it('clears a spike with nothing beside it', () => {
    expect(draw(dropLoneSpikes(grid(['.^..^^..'])))).toEqual(['....^^..']);
  });
});

describe('dropWalledSpikes', () => {
  it('clears the spikes pressed against a step', () => {
    expect(
      draw(
        dropWalledSpikes(
          grid([
            '.^^#^^.', //
            '#######',
          ]),
        ),
      ),
    ).toEqual([
      '.^.#.^.', //
      '#######',
    ]);
  });

  it('leaves a spike with air on both sides alone', () => {
    expect(draw(dropWalledSpikes(grid(['.^^.'])))).toEqual(['.^^.']);
  });
});

describe('dropSqueezedSpikes', () => {
  it('opens the gate a ceiling spike closes over the next column', () => {
    expect(
      draw(
        dropSqueezedSpikes(
          grid([
            '.v', //
            '..',
            '..',
            '^.',
          ]),
        ),
      ),
    ).toEqual([
      '.v', //
      '..',
      '..',
      '..',
    ]);
  });

  it('reads the pattern mirrored as well', () => {
    expect(
      draw(
        dropSqueezedSpikes(
          grid([
            'v.', //
            '..',
            '..',
            '.^',
          ]),
        ),
      ),
    ).toEqual([
      'v.', //
      '..',
      '..',
      '..',
    ]);
  });

  it('leaves a ground spike the ceiling does not lean over', () => {
    expect(
      draw(
        dropSqueezedSpikes(
          grid([
            '..v', //
            '...',
            '...',
            '^..',
          ]),
        ),
      ),
    ).toEqual([
      '..v', //
      '...',
      '...',
      '^..',
    ]);
  });
});

describe('growSpikes', () => {
  it('leaves a flat field in clumps with room to land between them', () => {
    expect(
      draw(
        growSpikes(
          grid([
            '............', //
            '............',
            '............',
            '############',
          ]),
        ),
      ),
    ).toEqual([
      '............', //
      '............',
      '...^^.....^^',
      '############',
    ]);
  });

  it('never leaves a spike pressed against a step', () => {
    // The spikes either side of the step in column 5 are the ones rule 4 takes
    // back; the lone spike on top of the step goes to rule 3.
    expect(
      draw(
        growSpikes(
          grid([
            '............', //
            '............',
            '.....#......',
            '############',
          ]),
        ),
      ),
    ).toEqual([
      '............', //
      '............',
      '...^.#.^..^^',
      '############',
    ]);
  });
});

const spikeField = (): Tile[][] =>
  map(times(4), (row) =>
    map(times(60), (): Tile => (row === 2 ? TILE_SPIKE : TILE_AIR)),
  );

describe('thinSpikes', () => {
  it('walks the first level of a run bare', () => {
    const thinned = thinSpikes(createRng('LEVEL-1'), spikeField(), 0);
    expect(countSpikes(thinned)).toBe(0);
  });

  it('clears hanging spikes on the first level too', () => {
    const tiles = grid(['vv^^']);
    expect(draw(thinSpikes(createRng('LEVEL-1'), tiles, 0))).toEqual(['....']);
  });

  it.each([1, 2, 3])('leaves about half of them on level %i', (levelIndex) => {
    const kept = countSpikes(
      thinSpikes(createRng(`LEVEL-${levelIndex}`), spikeField(), levelIndex),
    );
    expect(kept).toBeGreaterThan(15);
    expect(kept).toBeLessThan(45);
  });

  it.each([4, 5, 6, 7])(
    'leaves every one of them on level %i',
    (levelIndex) => {
      const kept = countSpikes(
        thinSpikes(createRng(`LEVEL-${levelIndex}`), spikeField(), levelIndex),
      );
      expect(kept).toBe(60);
    },
  );

  it('thins a level the same way for the same seed', () => {
    expect(draw(thinSpikes(createRng('SEED'), spikeField(), 2))).toEqual(
      draw(thinSpikes(createRng('SEED'), spikeField(), 2)),
    );
  });
});
