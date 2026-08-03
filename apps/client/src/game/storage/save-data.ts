export interface CompletedWorld {
  name: string;
  score: number;
}

export interface SaveData {
  score: number;
  completedWorlds: CompletedWorld[];
}
