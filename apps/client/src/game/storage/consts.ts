/**
 * V2 stores runs as inputs on a fixed step. V1 replays were lists of frame
 * deltas and cannot be replayed by the fixed-step engine, so the key moves on
 * and those runs are left behind rather than migrated.
 */
export const STORAGE_KEY = 'MANDER:SAVE:V2';

export const REPLAYS_KEPT = 5;

export const PLAYED_WORLDS_KEPT = 50;

export const RUNS_KEPT = 20;

export const GHOSTS_SHOWN = 4;
