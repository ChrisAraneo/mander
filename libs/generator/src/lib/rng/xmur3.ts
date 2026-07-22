export function xmur3(input: string): () => number {
  let hashState = 1779033703 ^ input.length;
  for (let index = 0; index < input.length; index++) {
    hashState = Math.imul(hashState ^ input.charCodeAt(index), 3432918353);
    hashState = (hashState << 13) | (hashState >>> 19);
  }
  return () => {
    hashState = Math.imul(hashState ^ (hashState >>> 16), 2246822507);
    hashState = Math.imul(hashState ^ (hashState >>> 13), 3266489909);
    hashState ^= hashState >>> 16;
    return hashState >>> 0;
  };
}
