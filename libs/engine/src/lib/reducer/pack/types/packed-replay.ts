export type PackedEntry = number[];

export interface PackedReplay {
  worldName: string;
  steps: number;
  entries: PackedEntry[];
}
