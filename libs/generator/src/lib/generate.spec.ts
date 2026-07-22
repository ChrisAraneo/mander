import { describe, expect, it } from 'vitest';

import {
  BASE_GROUND,
  INTRO_WIDTH,
  LEVEL_WIDTH,
  LEVELS_PER_SEED,
  OUTRO_WIDTH,
  SECTOR_COUNT,
  SECTOR_WIDTH,
  SPIKE_CLEARANCE,
  SPIKE_MIN_ENEMY_DISTANCE,
  SPIKE_MIN_GAP,
} from './consts';
import {
  dailyDate,
  dailySeed,
  generateLevel,
  generateLevelSet,
  levelSeed,
} from './generate';
import { CHEST_ITEM_COUNT, ITEM_CATALOG, rollChestItems } from './items';
import { createRng } from './rng';
import { maxJumpColumns } from './structures/grid';
import { type Level, TILE_SIZE, TILE_SOLID, TILE_SPIKE } from './types';

function groundHeights(level: Level): number[] {
  const heights: number[] = [];
  for (let x = 0; x < level.width; x++) {
    let h = 0;
    for (let y = level.height - 1; y >= 0; y--) {
      if (level.tiles[y][x] !== TILE_SOLID) break;
      h++;
    }
    heights.push(h);
  }
  return heights;
}

function countSpikes(level: Level): number {
  let count = 0;
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++)
      if (level.tiles[y][x] === TILE_SPIKE) count++;
  }
  return count;
}

interface HoleRun {
  start: number;
  width: number;
}

function holeRuns(level: Level): HoleRun[] {
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
}

interface Surface {
  c: number;
  r: number;
}

function reachableSurfaces(level: Level, from: Surface): Set<string> {
  const surfaces: Surface[] = [];
  const byId = new Map<string, Surface>();
  for (let c = 1; c < level.width - 1; c++) {
    for (let r = 0; r < level.height; r++) {
      if (level.tiles[r][c] !== TILE_SOLID) continue;
      if (r > 0 && level.tiles[r - 1][c] === TILE_SOLID) continue;
      const surface = { c, r };
      surfaces.push(surface);
      byId.set(`${c}:${r}`, surface);
    }
  }

  const visited = new Set<string>();
  const queue: Surface[] = [];
  const startId = `${from.c}:${from.r}`;
  if (!byId.has(startId)) return visited;
  visited.add(startId);
  queue.push(from);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const target of surfaces) {
      const id = `${target.c}:${target.r}`;
      if (visited.has(id)) continue;
      const dc = Math.abs(target.c - current.c);
      if (dc === 0 || dc > 6) continue;
      const rise = current.r - target.r;
      if (dc <= maxJumpColumns(rise)) {
        visited.add(id);
        queue.push(target);
      }
    }
  }
  return visited;
}

function surfaceUnder(level: Level, centerX: number, fromY: number): Surface {
  const c = Math.floor(centerX / TILE_SIZE);
  for (let r = Math.floor(fromY / TILE_SIZE); r < level.height; r++) {
    if (level.tiles[r][c] === TILE_SOLID) return { c, r };
  }
  throw new Error(`no surface under column ${c}`);
}

function keySurface(level: Level): Surface {
  return surfaceUnder(
    level,
    level.key.x + level.key.width / 2,
    level.key.y + level.key.height,
  );
}

function chestSurface(level: Level): Surface {
  return surfaceUnder(
    level,
    level.chest.x + level.chest.width / 2,
    level.chest.y + level.chest.height,
  );
}

function spawnSurface(level: Level): Surface {
  return surfaceUnder(level, level.spawn.x, level.spawn.y);
}

const SEEDS = Array.from({ length: 12 }, (_, i) => `sample-seed-${i}`);
const ALL_LEVELS = Array.from({ length: LEVELS_PER_SEED }, (_, i) => i);
const CASES: Array<[string, number]> = SEEDS.flatMap((seed) =>
  ALL_LEVELS.map((d): [string, number] => [seed, d]),
);

describe('generateLevel', () => {
  it('is deterministic for the same seed and difficulty', () => {
    expect(generateLevel('mander', 3)).toEqual(generateLevel('mander', 3));
  });

  it('produces different levels for different seeds and difficulties', () => {
    expect(JSON.stringify(generateLevel('seed-a', 0))).not.toEqual(
      JSON.stringify(generateLevel('seed-b', 0)),
    );
    expect(JSON.stringify(generateLevel('seed-a', 0))).not.toEqual(
      JSON.stringify(generateLevel('seed-a', 5)),
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
            level.tiles[r][x],
            `floating tile at intro column ${x}`,
          ).not.toBe(TILE_SOLID);
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
      const groundTop = (level.height - outroHeight) * TILE_SIZE;
      expect(level.chest.x).toBe((level.width - 9) * TILE_SIZE + 3);
      expect(level.chest.y).toBe(groundTop - 22);
      expect(level.portal.x).toBe((level.width - 4) * TILE_SIZE);
      expect(level.portal.y).toBe(groundTop - 64);
    },
  );

  it.each(CASES)(
    'never lets connected ground step more than one tile for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const heights = groundHeights(level);
      for (let x = 1; x < level.width - 2; x++) {
        if (heights[x] === 0 || heights[x + 1] === 0) continue;
        if (heights[x] === level.height || heights[x + 1] === level.height)
          continue;
        const rise = Math.abs(heights[x + 1] - heights[x]);
        expect(rise, `rise of ${rise} at column ${x}`).toBeLessThanOrEqual(1);
      }
    },
  );

  it.each(CASES)(
    'bridges every hole with a platform the player can cross for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (const run of holeRuns(level)) {
        expect(run.start, `hole at ${run.start}`).toBeGreaterThanOrEqual(
          INTRO_WIDTH,
        );
        expect(
          run.start + run.width,
          `hole at ${run.start}`,
        ).toBeLessThanOrEqual(level.width - OUTRO_WIDTH);
        let floating = 0;
        for (let x = run.start; x < run.start + run.width; x++) {
          for (let r = 0; r < level.height; r++) {
            if (level.tiles[r][x] === TILE_SOLID) floating++;
          }
        }
        expect(floating, `no bridge over hole at ${run.start}`).toBeGreaterThan(
          0,
        );
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
    let rose = false;
    let anyBelowBase = false;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS) {
        const level = generateLevel(levelSeed(seed, d), d);
        const heights = groundHeights(level);
        const outroHeight = heights[level.width - OUTRO_WIDTH];
        if (outroHeight > BASE_GROUND) rose = true;
        if (outroHeight < BASE_GROUND) anyBelowBase = true;
      }
    }
    expect(rose, 'some level should end raised above the spawn height').toBe(
      true,
    );
    expect(anyBelowBase, 'the level never sinks below the spawn height').toBe(
      false,
    );
  });

  it.each(CASES)(
    'hides the key in the middle of the level for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const column = Math.floor(
        (level.key.x + level.key.width / 2) / TILE_SIZE,
      );
      expect(column).toBeGreaterThanOrEqual(Math.floor(level.width * 0.25));
      expect(column).toBeLessThan(level.width - OUTRO_WIDTH);
      expect(level.key.y).toBeGreaterThan(0);
    },
  );

  it.each(CASES)(
    'spawns every enemy on solid ground inside the sector band for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      for (const enemy of level.enemies) {
        const col = Math.floor(enemy.x / TILE_SIZE);
        const row = Math.floor(enemy.y / TILE_SIZE);
        expect(col, `enemy column ${col}`).toBeGreaterThanOrEqual(INTRO_WIDTH);
        expect(col, `enemy column ${col}`).toBeLessThan(
          LEVEL_WIDTH - OUTRO_WIDTH,
        );
        expect(level.tiles[row][col]).not.toBe(TILE_SOLID);
        expect(level.tiles[row + 1][col], `ground under enemy at ${col}`).toBe(
          TILE_SOLID,
        );
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
    'places every spike on flat ground with clearance, away from enemies, for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const heights = groundHeights(level);
      const enemyColumns = level.enemies.map((e) =>
        Math.floor(e.x / TILE_SIZE),
      );
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          if (level.tiles[y][x] !== TILE_SPIKE) continue;
          expect(x).toBeGreaterThanOrEqual(INTRO_WIDTH);
          expect(x).toBeLessThan(LEVEL_WIDTH - OUTRO_WIDTH);
          expect(y + 1, `spike sits on the ground at ${x}`).toBe(
            level.height - heights[x],
          );
          expect(heights[x - 1], `left footing at ${x}`).toBeGreaterThanOrEqual(
            heights[x],
          );
          expect(
            heights[x + 1],
            `right footing at ${x}`,
          ).toBeGreaterThanOrEqual(heights[x]);
          for (let r = y; r >= y - SPIKE_CLEARANCE; r--) {
            expect(level.tiles[r][x], `clearance at row ${r}`).not.toBe(
              TILE_SOLID,
            );
          }
          for (const ec of enemyColumns) {
            expect(
              Math.abs(ec - x),
              `spike ${x} near enemy ${ec}`,
            ).toBeGreaterThanOrEqual(SPIKE_MIN_ENEMY_DISTANCE);
          }
        }
      }
    },
  );

  it.each(CASES)(
    'keeps at least SPIKE_MIN_GAP ground blocks between spikes for %s level %i',
    (seed, d) => {
      const level = generateLevel(levelSeed(seed, d), d);
      const spikeColumns: number[] = [];
      for (let x = 0; x < level.width; x++) {
        for (let y = 0; y < level.height; y++) {
          if (level.tiles[y][x] === TILE_SPIKE) {
            spikeColumns.push(x);
            break;
          }
        }
      }
      for (let i = 1; i < spikeColumns.length; i++) {
        const gap = spikeColumns[i] - spikeColumns[i - 1] - 1;
        expect(
          gap,
          `gap between spikes at ${spikeColumns[i - 1]} and ${spikeColumns[i]}`,
        ).toBeGreaterThanOrEqual(SPIKE_MIN_GAP);
      }
    },
  );

  it('scatters spikes across a run of levels', () => {
    let total = 0;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS)
        total += countSpikes(generateLevel(levelSeed(seed, d), d));
    }
    expect(total, 'spikes should appear across a run').toBeGreaterThan(0);
  });

  it('grows more spikes on hard levels than normal ones', () => {
    let normal = 0;
    let hard = 0;
    for (const seed of SEEDS) {
      for (const d of ALL_LEVELS) {
        const spikes = countSpikes(generateLevel(levelSeed(seed, d), d));
        if (d <= 3) normal += spikes;
        else hard += spikes;
      }
    }
    expect(hard).toBeGreaterThan(normal);
  });

  it.each(SEEDS)('offers five distinct chest items for %s', (seed) => {
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
    const levels = generateLevelSet('run-seed');
    expect(levels).toHaveLength(LEVELS_PER_SEED);
    expect(new Set(levels.map((l) => JSON.stringify(l))).size).toBe(
      LEVELS_PER_SEED,
    );
    expect(levels).toEqual(generateLevelSet('run-seed'));
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
    expect(dailySeed(new Date())).toMatch(/^[\dA-Z]{14}$/);
    expect(dailySeed(new Date(Date.UTC(2026, 6, 19)))).toMatch(/^[\dA-Z]{14}$/);
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
    expect(rollChestItems(createRng('roll'))).toEqual(
      rollChestItems(createRng('roll')),
    );
  });
});

describe('levelSeed', () => {
  it('derives a distinct seed per level index', () => {
    expect(levelSeed('abc', 0)).toBe('abc#0');
    expect(levelSeed('abc', 1)).not.toBe(levelSeed('abc', 0));
  });
});
