export function levelSeed(baseSeed: string, levelIndex: number): string {
  return `${baseSeed}#${levelIndex}`;
}
