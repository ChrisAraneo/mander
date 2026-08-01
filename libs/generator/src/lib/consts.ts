import { SECTOR_WIDTH } from '@mander/structures';

export const LEVEL_HEIGHT = 80;
export const LEVELS_PER_SEED = 8;

export const BASE_GROUND = 6;

export const INTRO_WIDTH = 20;
export const OUTRO_WIDTH = 20;
export const SECTOR_COUNT = 4;

/** A sector apiece for the structures, with hand-built ground either side. */
export const LEVEL_WIDTH =
  INTRO_WIDTH + SECTOR_COUNT * SECTOR_WIDTH + OUTRO_WIDTH;

/**
 * Air blocks a solid block needs above it before a spike grows there, counting
 * the block the spike itself stands in. Anything tighter is a crawlspace, and
 * a spike in one is unavoidable rather than difficult.
 */
export const SPIKE_HEADROOM = 3;

/**
 * A run this long has its middle broken out, leaving a landing the player can
 * drop into. Breaking repeats until nothing is longer, so a whole flat field
 * comes apart into clumps rather than staying a wall with one notch in it.
 */
export const SPIKE_BREAK_RUN = 4;
export const SPIKE_BREAK_WIDTH = 2;

/** Rows between a ceiling spike and the ground spike it squeezes shut. */
export const SPIKE_SQUEEZE_ROWS = 3;

/** The level that opens a run is walked bare, to teach the controls. */
export const SPIKE_CLEAR_LEVEL = 0;
/** Up to and including this level, a coin decides whether a spike stays. */
export const SPIKE_HALVED_UNTIL_LEVEL = 3;
export const SPIKE_KEEP_CHANCE = 0.5;
