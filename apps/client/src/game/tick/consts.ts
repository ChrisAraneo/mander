export const TIME_SCALE = 1.0;

/**
 * A frame that took longer than this many steps has already been dropped; we
 * simulate the cap and let the rest of the time go, rather than trying to catch
 * up and spiralling. Tab-switches are what this is for.
 */
export const MAX_STEPS_PER_FRAME = 5;
