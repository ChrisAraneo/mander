import type { PackedEntry } from './packed-entry';

export interface PackedReplay {
  worldName: string;
  steps: number;
  entries: PackedEntry[];
}
