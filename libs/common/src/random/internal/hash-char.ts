import { pipe } from 'remeda';

const CHAR_MULTIPLIER = 3_432_918_353;

export const hashChar = (hashState: number, character: string): number =>
  pipe(
    character.charCodeAt(0),
    (code) => Math.imul(hashState ^ code, CHAR_MULTIPLIER),
    (mixed) => (mixed << 13) | (mixed >>> 19),
  );
