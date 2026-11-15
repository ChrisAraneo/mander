import type { Player } from '@mander/model';
import { createPlayer } from '../player/create-player';
import { createRespawnTestLevel } from './create-respawn-test-level';

const CARRIED_HEARTS = 1;

export const createRespawnTestPlayer = (): Player =>
  createPlayer(createRespawnTestLevel(), {
    hearts: { value: CARRIED_HEARTS },
  });
