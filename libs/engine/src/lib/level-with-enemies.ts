import type { Level } from "@mander/model";
import type { Point } from "@mander/utils";

export interface LevelWithEnemies extends Level {
    enemies: Point[];
}