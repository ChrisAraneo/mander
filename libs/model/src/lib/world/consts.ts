export const MAX_JUMP_TILES = 5;

export const GRAVITY = 1800;
export const TERMINAL_VELOCITY = 1150;
export const MAX_TICK_SECONDS = 1 / 25;

/**
 * The simulation runs on this fixed step, never on the wall-clock frame delta.
 * The physics in `stepPlayer` is semi-implicit Euler, so trajectories depend on
 * the step size: with variable deltas a 240Hz player jumps ~11px higher than a
 * 60Hz one, and a replay can never be reproduced. Fixing the step makes runs
 * identical on every machine, which is what lets a replay record only inputs.
 */
export const FIXED_STEP_SECONDS = 1 / 60;

export const FIXED_STEP_MS = 1000 * FIXED_STEP_SECONDS;
