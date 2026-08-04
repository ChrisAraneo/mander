import type { PackedReplay } from '@mander/engine';

export interface CompletedWorld {
  name: string;
  day: string;
  score: number;
  seconds: number;
  replay: PackedReplay | null;
}

export interface SaveData {
  score: number;
  completedWorlds: CompletedWorld[];
}
