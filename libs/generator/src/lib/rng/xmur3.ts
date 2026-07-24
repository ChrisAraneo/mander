import { reduce } from 'lodash-es';

const mixChar = (hashState: number, character: string): number => {
  const mixed = Math.imul(hashState ^ character.charCodeAt(0), 3_432_918_353);
  return (mixed << 13) | (mixed >>> 19);
};

export const xmur3 = (input: string): (() => number) => {
  let hashState = reduce(input, mixChar, 1_779_033_703 ^ input.length);
  return () => {
    hashState = Math.imul(hashState ^ (hashState >>> 16), 2_246_822_507);
    hashState = Math.imul(hashState ^ (hashState >>> 13), 3_266_489_909);
    hashState ^= hashState >>> 16;
    return hashState >>> 0;
  };
};
