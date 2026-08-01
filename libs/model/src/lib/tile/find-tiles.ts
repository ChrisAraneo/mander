import type { Point } from '@mander/utils';
import type { Level } from '../level/level';
import type { Tile } from './tile';

export const findTiles = (level: Level, tile: Tile): Point[] => {
    const points = [];

    for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
            if (level.tiles[y][x] === tile) {
                points.push({ x, y });
            }
        }
    }

    return points;
};
