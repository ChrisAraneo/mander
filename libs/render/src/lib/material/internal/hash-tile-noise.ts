const COLUMN_PRIME = 73856093;

const PLANK_ROW_PRIME = 19349663;

const NOISE_MODULUS = 9973;

export const hashTileNoise = (column: number, plankRow: number): number =>
  (((column * COLUMN_PRIME) ^ (plankRow * PLANK_ROW_PRIME)) >>> 0) %
  NOISE_MODULUS;
