export function xmur3(input: string): () => number {
  let hashState = 1_779_033_703 ^ input.length;
  for (let index = 0; index < input.length; index++) {
    hashState = Math.imul(hashState ^ input.charCodeAt(index), 3_432_918_353);
    hashState = (hashState << 13) | (hashState >>> 19);
  }
  return () => {
    hashState = Math.imul(hashState ^ (hashState >>> 16), 2_246_822_507);
    hashState = Math.imul(hashState ^ (hashState >>> 13), 3_266_489_909);
    hashState ^= hashState >>> 16;
    return hashState >>> 0;
  };
}
