export type PackedEntry = number[];

export interface PackedReplay {
  worldName: string;
  entries: PackedEntry[];
}
