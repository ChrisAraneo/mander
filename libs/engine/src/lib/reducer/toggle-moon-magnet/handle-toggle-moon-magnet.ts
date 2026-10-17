import { match } from 'ts-pattern';
import type { GameState } from '../../types/game-state';
import { hasMoonMagnet } from './has-moon-magnet';
import { patchFlippedMoonMagnet } from './internal/patch-flipped-moon-magnet';

export const handleToggleMoonMagnet = (state: GameState): GameState =>
  match({
    status: state.status,
    isOwned: hasMoonMagnet(state.inventory),
  })
    .with({ status: 'PLAYING', isOwned: true }, (): GameState =>
      patchFlippedMoonMagnet(state),
    )
    .otherwise((): GameState => state);
