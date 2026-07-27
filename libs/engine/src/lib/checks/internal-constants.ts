import { MAX_TICK_SECONDS } from '../physics/constants';

export const FRAME_SECONDS = MAX_TICK_SECONDS;
export const POSITION_QUANTUM = 32;
export const NODE_KEY_STRIDE = 1024;
export const MAX_PLAN_FRAMES = 60;
export const MAX_GROUNDED_FRAMES = 8;
export const MAX_NODES = 6000;
export const JUMP_HOLD_FRAMES = [0, 3, MAX_PLAN_FRAMES];
