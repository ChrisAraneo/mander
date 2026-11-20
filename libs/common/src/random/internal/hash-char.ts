import { pipe } from 'remeda';

const CHAR_MULTIPLIER = 3_432_918_353;

const WORD_BITS = 32;

const ROTATION_BITS = 13;

export const hashChar = (hashState: number, character: string): number =>
  pipe(
    character.charCodeAt(0),
    (code) => Math.imul(hashState ^ code, CHAR_MULTIPLIER),
    (mixed) =>
      (mixed << ROTATION_BITS) | (mixed >>> (WORD_BITS - ROTATION_BITS)),
  );
