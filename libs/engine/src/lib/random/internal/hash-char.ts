import { pipe } from 'remeda';

export const hashChar = (hashState: number, character: string): number =>
  pipe(
    character.charCodeAt(0),
    (code) => Math.imul(hashState ^ code, 3_432_918_353),
    (mixed) => (mixed << 13) | (mixed >>> 19),
  );
