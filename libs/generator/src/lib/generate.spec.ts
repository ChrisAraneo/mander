import type { Point } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import {
  maxJumpColumns,
  NORMAL_STRUCTURES,
  PLAYER_CLEARANCE,
  SECTOR_WIDTH,
} from '@mander/structures';

import {
  BASE_GROUND,
  INTRO_WIDTH,
  LEVEL_WIDTH,
  LEVELS_PER_SEED,
  OUTRO_WIDTH,
  SECTOR_COUNT,
  SPIKE_BREAK_RUN,
  SPIKE_CLEAR_LEVEL,
  SPIKE_HALVED_UNTIL_LEVEL,
  SPIKE_HEADROOM,
} from './consts';
import {
  dailyDate,
  dailySeed,
  generateLevel,
  generateLevelSet,
  levelSeed,
  rollStructure,
} from './generate';
import { CHEST_ITEM_COUNT, ITEM_CATALOG, rollChestItems } from './items';
import { createRng } from './rng';
import {
  CHEST_ENTITY_BOX,
  findChestTile,
  findKeyTile,
  findPortalTile,
  findSpawnTile,
  isSolidTile,
  KEY_ENTITY_BOX,
  type Level,
  TILE_CHEST,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  toEntityRectangle,
} from '@mander/engine';

const groundHeights = (level: Level): number[] => {
  const heights: number[] = [];
  for (let x = 0; x < level.width; x++) {
    let h = 0;
    for (let y = level.height - 1; y >= 0; y--) {
      if (!isSolidTile(level.tiles[y][x])) break;
      h++;
    }
    heights.push(h);
  }
  return heights;
};

const countTiles = (level: Level, target: number): number => {
  let count = 0;
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++)
      if (level.tiles[y][x] === target) count++;
  }
  return count;
};

const countSpikes = (level: Level): number => countTiles(level, TILE_SPIKE);

/** The width of every stretch of spikes standing shoulder to shoulder. */
const spikeRunWidths = (level: Level): number[] => {
  const widths: number[] = [];
  for (let y = 0; y < level.height; y++) {
    let run = 0;
    for (let x = 0; x < level.width; x++) {
      if (level.tiles[y][x] === TILE_SPIKE) run++;
      else if (run > 0) {
        widths.push(run);
        run = 0;
      }
    }
    if (run > 0) widths.push(run);
  }
  return widths;
};

interface HoleRun {
  start: number;
  width: number;
}

const holeRuns = (level: Level): HoleRun[] => {
  const heights = groundHeights(level);
  const runs: HoleRun[] = [];
  let start = -1;
  for (let x = 1; x < level.width - 1; x++) {
    if (heights[x] === 0) {
      if (start === -1) start = x;
    } else if (start !== -1) {
      runs.push({ start, width: x - start });
      start = -1;
    }
  }
  return runs;
};

interface Surface {
  c: number;
  r: number;
}

const reachableSurfaces = (level: Level, from: Surface): Set<string> => {
  const surfaces: Surface[] = [];
  const byId = new Map<string, Surface>();
  for (let c = 1; c < level.width - 1; c++) {
    for (let r = 0; r < level.height; r++) {
      const isTop =
        isSolidTile(level.tiles[r][c]) &&
        (r === 0 || !isSolidTile(level.tiles[r - 1][c]));
      if (isTop) {
        const surface = { c, r };
        surfaces.push(surface);
        byId.set(`${c}:${r}`, surface);
      }
    }
  }

  const visited = new Set<string>();
  const queue: Surface[] = [];
  const startId = `${from.c}:${from.r}`;
  if (!byId.has(startId)) return visited;
  visited.add(startId);
  queue.push(from);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    for (const target of surfaces) {
      const id = `${target.c}:${target.r}`;
      const dc = Math.abs(target.c - current.c);
      if (
        !visited.has(id) &&
        dc > 0 &&
        dc <= 6 &&
        dc <= maxJumpColumns(current.r - target.r)
      ) {
        visited.add(id);
        queue.push(target);
      }
    }
  }
  return visited;
};

const surfaceUnder = (
  level: Level,
  centerX: number,
  fromY: number,
): Surface => {
  const c = Math.floor(centerX / TILE_SIZE);
  for (let r = Math.floor(fromY / TILE_SIZE); r < level.height; r++) {
    if (isSolidTile(level.tiles[r][c])) return { c, r };
  }
  throw new Error(`no surface under column ${c}`);
};

const tileOrThrow = (tile: Point | null, name: string): Point => {
  if (tile === null) throw new Error(`no ${name} tile`);
  return tile;
};

const keySurface = (level: Level): Surface => {
  const key = toEntityRectangle(
    tileOrThrow(findKeyTile(level), 'key'),
    KEY_ENTITY_BOX,
  );
  return surfaceUnder(level, key.x + key.width / 2, key.y + key.height);
};

const chestSurface = (level: Level): Surface => {
  const chest = toEntityRectangle(
    tileOrThrow(findChestTile(level), 'chest'),
    CHEST_ENTITY_BOX,
  );
  return surfaceUnder(level, chest.x + chest.width / 2, chest.y + chest.height);
};

const spawnSurface = (level: Level): Surface => {
  const spawn = tileOrThrow(findSpawnTile(level), 'spawn');
  return surfaceUnder(level, spawn.x * TILE_SIZE, spawn.y * TILE_SIZE);
};

const SEEDS = Array.from({ length: 12 }, (_, i) => `SAMPLE-SEED-${i}`);
const ALL_LEVELS = Array.from({ length: LEVELS_PER_SEED }, (_, i) => i);
const CASES: Array<[string, number]> = SEEDS.flatMap((seed) =>
  ALL_LEVELS.map((d): [string, number] => [seed, d]),
);

const expectValidSpike = (level: Level, x: number, y: number): void => {
  expect(
    isSolidTile(level.tiles[y + 1][x]),
    `spike at ${x}:${y} stands on something solid`,
  ).toBe(true);
  for (let r = y; r > y - SPIKE_HEADROOM; r--) {
    expect(
      isSolidTile(level.tiles[r][x]),
      `spike at ${x}:${y} wants ${SPIKE_HEADROOM} clear rows, row ${r} is solid`,
    ).toBe(false);
  }
};

describe('generateLevel', () => {
  it('is deterministic for the same seed and difficulty', () => {
    expect(generateLevel('MANDER', 3)).toEqual(generateLevel('MANDER', 3));
  });

  it('produces different levels for different seeds and difficulties', () => {
    expect(JSON.stringify(generateLevel('SEED-A', 0))).not.toEqual(
      JSON.stringify(generateLevel('SEED-B', 0)),
    );
    expect(JSON.stringify(generateLevel('SEED-A', 0))).not.toEqual(
      JSON.stringify(generateLevel('SEED-A', 5)),
    );
  });

  it.each(CASES)(
    'lets the player reach key and chest, both ways, for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const spawn = spawnSurface(level);
      const key = keySurface(level);
      const chest = chestSurface(level);

      const fromSpawn = reachableSurfaces(level, spawn);
      expect(fromSpawn.has(`${key.c}:${key.r}`), 'spawn → key').toBe(true);
      expect(fromSpawn.has(`${chest.c}:${chest.r}`), 'spawn → chest').toBe(
        true,
      );

      const fromChest = reachableSurfaces(level, chest);
      expect(fromChest.has(`${key.c}:${key.r}`), 'chest → key').toBe(true);
      const fromKey = reachableSurfaces(level, key);
      expect(fromKey.has(`${chest.c}:${chest.r}`), 'key → chest').toBe(true);
    },
  );

  it.each(CASES)(
    'is a fixed 120 tiles wide, in the intro/sectors/outro layout, for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      expect(level.width).toBe(LEVEL_WIDTH);
      expect(INTRO_WIDTH + SECTOR_COUNT * SECTOR_WIDTH + OUTRO_WIDTH).toBe(
        LEVEL_WIDTH,
      );
    },
  );

  it.each(CASES)(
    'starts every level with the identical flat intro for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const heights = groundHeights(level);
      const surfaceRow = level.height - BASE_GROUND;
      for (let x = 1; x < INTRO_WIDTH; x++) {
        expect(heights[x], `intro column ${x}`).toBe(BASE_GROUND);
        for (let r = 0; r < surfaceRow; r++) {
          expect(
            isSolidTile(level.tiles[r][x]),
            `floating tile at intro column ${x}`,
          ).toBe(false);
        }
      }
      expect(spawnSurface(level).r).toBe(surfaceRow);
    },
  );

  it.each(CASES)(
    'ends every level with the same flat chest-and-portal outro for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const heights = groundHeights(level);
      const outroStart = level.width - OUTRO_WIDTH;
      const outroHeight = heights[outroStart];
      for (let x = outroStart; x < level.width - 1; x++) {
        expect(heights[x], `outro column ${x}`).toBe(outroHeight);
      }
      const groundRow = level.height - outroHeight;
      const chest = tileOrThrow(findChestTile(level), 'chest');
      const portal = tileOrThrow(findPortalTile(level), 'portal');
      expect(chest.x).toBe(level.width - 9);
      expect(chest.y).toBe(groundRow - 1);
      expect(portal.x).toBe(level.width - 4);
      expect(portal.y).toBe(groundRow - 1);
      expect(level.tiles[chest.y][chest.x]).toBe(TILE_CHEST);
      expect(level.tiles[portal.y][portal.x]).toBe(TILE_PORTAL);
      expect(level.tiles[portal.y - 1][portal.x]).toBe(TILE_PORTAL);
    },
  );

  it.each(CASES)(
    'never lets connected ground step beyond a jumpable rise for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const heights = groundHeights(level);
      for (let x = 1; x < level.width - 2; x++) {
        const isPit = heights[x] === 0 || heights[x + 1] === 0;
        const isWall =
          heights[x] === level.height || heights[x + 1] === level.height;
        if (!isPit && !isWall) {
          const rise = heights[x + 1] - heights[x];
          expect(
            maxJumpColumns(rise),
            `rise of ${rise} at column ${x} is not jumpable`,
          ).toBeGreaterThanOrEqual(1);
        }
      }
    },
  );

  it.each(CASES)(
    'leaves every hole crossable, by bridge or by jump, for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const heights = groundHeights(level);
      for (const run of holeRuns(level)) {
        expect(run.start, `hole at ${run.start}`).toBeGreaterThanOrEqual(
          INTRO_WIDTH,
        );
        expect(
          run.start + run.width,
          `hole at ${run.start}`,
        ).toBeLessThanOrEqual(level.width - OUTRO_WIDTH);

        let bridge = 0;
        for (let x = run.start; x < run.start + run.width; x++) {
          for (let r = 0; r < level.height; r++) {
            if (isSolidTile(level.tiles[r][x])) bridge++;
          }
        }
        // A hole is fair either because something spans it, or because it is
        // narrow enough to clear in one hop from lip to lip.
        const left = run.start - 1;
        const right = run.start + run.width;
        // the level has to work in both directions, so cost the climb
        const rise = Math.abs(heights[right] - heights[left]);
        const jump = run.width + 1 <= maxJumpColumns(rise);
        expect(
          bridge > 0 || jump,
          `hole at ${run.start} is ${run.width} wide over a rise of ${rise}: no bridge and too far to jump`,
        ).toBe(true);
      }
    },
  );

  it('carves bottomless, bridged holes somewhere across a run', () => {
    let holes = 0;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS) {
        holes += holeRuns(generateLevel(levelSeed(seed, d), d)).length;
      }
    }
    expect(holes, 'holes should appear across a run of levels').toBeGreaterThan(
      0,
    );
  });

  it('raises the ground for the rest of the level after a climbing structure', () => {
    let hasRisen = false;
    let hasAnyBelowBase = false;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS) {
        const level = generateLevel(levelSeed(seed, d), d);
        const heights = groundHeights(level);
        const outroHeight = heights[level.width - OUTRO_WIDTH];
        if (outroHeight > BASE_GROUND) hasRisen = true;
        if (outroHeight < BASE_GROUND) hasAnyBelowBase = true;
      }
    }
    expect(
      hasRisen,
      'some level should end raised above the spawn height',
    ).toBe(true);
    expect(
      hasAnyBelowBase,
      'the level never sinks below the spawn height',
    ).toBe(false);
  });

  it.each(CASES)(
    'leaves the player headroom on every surface for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (let x = 1; x < level.width - 1; x++) {
        for (let y = 0; y < level.height; y++) {
          const isSurface =
            isSolidTile(level.tiles[y][x]) &&
            (y === 0 || !isSolidTile(level.tiles[y - 1][x]));
          if (!isSurface) continue;
          for (let r = Math.max(0, y - PLAYER_CLEARANCE); r < y; r++) {
            expect(
              isSolidTile(level.tiles[r][x]),
              `headroom above ${x}:${y}`,
            ).toBe(false);
          }
        }
      }
    },
  );

  it.each(CASES)(
    'always lands the key, chest, portal and spawn on the map for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      // Entities only stamp onto air, so a spike sitting on the chosen support
      // silently swallows them — a level with no key can never be finished.
      expect(findKeyTile(level), 'key').not.toBeNull();
      expect(findChestTile(level), 'chest').not.toBeNull();
      expect(findPortalTile(level), 'portal').not.toBeNull();
      expect(findSpawnTile(level), 'spawn').not.toBeNull();
    },
  );

  it.each(CASES)(
    'hangs every ceiling spike off something solid for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          if (level.tiles[y][x] !== TILE_SPIKE_CEILING) continue;
          expect(
            isSolidTile(level.tiles[y - 1][x]),
            `ceiling spike at ${x}:${y} hangs off nothing`,
          ).toBe(true);
        }
      }
    },
  );

  it.each(CASES)(
    'hides the key in the middle of the level for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const key = tileOrThrow(findKeyTile(level), 'key');
      expect(key.x).toBeGreaterThanOrEqual(Math.floor(level.width * 0.25));
      expect(key.x).toBeLessThan(level.width - OUTRO_WIDTH);
      expect(key.y).toBeGreaterThan(0);
      expect(level.tiles[key.y][key.x]).toBe(TILE_KEY);
    },
  );

  it.each(CASES)(
    'spawns every enemy on solid ground inside the sector band for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (const enemy of level.enemies) {
        const col = enemy.x;
        const row = enemy.y;
        expect(col, `enemy column ${col}`).toBeGreaterThanOrEqual(INTRO_WIDTH);
        expect(col, `enemy column ${col}`).toBeLessThan(
          LEVEL_WIDTH - OUTRO_WIDTH,
        );
        expect(isSolidTile(level.tiles[row][col])).toBe(false);
        expect(
          isSolidTile(level.tiles[row + 1][col]),
          `ground under enemy at ${col}`,
        ).toBe(true);
      }
    },
  );

  it('populates enemies across a run of levels', () => {
    let total = 0;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS)
        total += generateLevel(levelSeed(seed, d), d).enemies.length;
    }
    expect(total, 'enemies should appear across a run').toBeGreaterThan(0);
  });

  it.each(CASES)(
    'stands every spike on a block with headroom for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          if (level.tiles[y][x] === TILE_SPIKE) expectValidSpike(level, x, y);
        }
      }
    },
  );

  it.each(CASES)(
    'never leaves a wall of spikes standing for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (const width of spikeRunWidths(level)) {
        expect(width, 'spike run').toBeLessThan(SPIKE_BREAK_RUN);
      }
    },
  );

  it.each(CASES)(
    'never presses a spike against solid ground for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (let y = 0; y < level.height; y++) {
        for (let x = 1; x < level.width - 1; x++) {
          if (level.tiles[y][x] !== TILE_SPIKE) continue;
          expect(
            isSolidTile(level.tiles[y][x - 1]) ||
              isSolidTile(level.tiles[y][x + 1]),
            `spike at ${x}:${y} is wedged against a wall`,
          ).toBe(false);
        }
      }
    },
  );

  it.each(SEEDS)('walks the first level of %s bare', (seed) => {
    const level = generateLevel(levelSeed(seed, SPIKE_CLEAR_LEVEL), 0);
    expect(countSpikes(level), 'floor spikes').toBe(0);
    expect(countTiles(level, TILE_SPIKE_CEILING), 'ceiling spikes').toBe(0);
  });

  it('scatters spikes across the rest of a run', () => {
    let total = 0;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS)
        total += countSpikes(generateLevel(levelSeed(seed, d), d));
    }
    expect(total, 'spikes should appear across a run').toBeGreaterThan(0);
  });

  it('thins the early levels and leaves the late ones whole', () => {
    let halved = 0;
    let whole = 0;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS) {
        const spikes = countSpikes(generateLevel(levelSeed(seed, d), d));
        if (d === SPIKE_CLEAR_LEVEL) continue;
        if (d <= SPIKE_HALVED_UNTIL_LEVEL) halved += spikes;
        else whole += spikes;
      }
    }
    expect(halved, 'the thinned levels still carry some').toBeGreaterThan(0);
    expect(whole).toBeGreaterThan(halved);
  });

  it.each(SEEDS)('offers a single distinct chest item for %s', (seed) => {
    const { chestItems } = generateLevel(seed, 2);
    expect(chestItems).toHaveLength(CHEST_ITEM_COUNT);
    expect(new Set(chestItems.map((item) => item.id)).size).toBe(
      CHEST_ITEM_COUNT,
    );
    for (const item of chestItems) {
      expect(ITEM_CATALOG.some((entry) => entry.item.id === item.id)).toBe(
        true,
      );
    }
  });
});

describe('generateLevelSet', () => {
  it('produces eight distinct levels, deterministically', () => {
    const levels = generateLevelSet('RUN-SEED');
    expect(levels).toHaveLength(LEVELS_PER_SEED);
    expect(new Set(levels.map((l) => JSON.stringify(l))).size).toBe(
      LEVELS_PER_SEED,
    );
    expect(levels).toEqual(generateLevelSet('RUN-SEED'));
  });
});

describe('dailyDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(dailyDate(new Date(Date.UTC(2026, 6, 19)))).toBe('2026-07-19');
    expect(dailyDate(new Date(Date.UTC(2026, 0, 5)))).toBe('2026-01-05');
  });
});

describe('dailySeed', () => {
  it('is a 14-character hash of letters and numbers', () => {
    expect(dailySeed(new Date())).toMatch(/^[\dA-Z]{14}$/u);
    expect(dailySeed(new Date(Date.UTC(2026, 6, 19)))).toMatch(
      /^[\dA-Z]{14}$/u,
    );
  });

  it('is deterministic for a given date', () => {
    expect(dailySeed(new Date(Date.UTC(2026, 6, 19)))).toBe(
      dailySeed(new Date(Date.UTC(2026, 6, 19))),
    );
  });

  it('is unique across three years of consecutive dates', () => {
    const seeds = new Set<string>();
    const count = 3 * 365;
    for (let i = 0; i < count; i++) {
      seeds.add(dailySeed(new Date(2025, 0, 1 + i)));
    }
    expect(seeds.size).toBe(count);
  });
});

describe('rollChestItems', () => {
  it('is deterministic for the same rng seed', () => {
    expect(rollChestItems(createRng('ROLL'))).toEqual(
      rollChestItems(createRng('ROLL')),
    );
  });
});

describe('levelSeed', () => {
  it('derives a distinct seed per level index', () => {
    expect(levelSeed('ABC', 0)).toBe('ABC#0');
    expect(levelSeed('ABC', 1)).not.toBe(levelSeed('ABC', 0));
  });
});

describe('rollStructure', () => {
  it('is deterministic for the same rng state and returns a pool member', () => {
    const a = rollStructure(createRng('SAME'), 'NORMAL');
    const b = rollStructure(createRng('SAME'), 'NORMAL');
    expect(a).toBe(b);
    expect(NORMAL_STRUCTURES).toContain(a);
  });
});
