import type { Action } from '@mander/engine';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { addGameAction } from './add-game-action';
import type { Game } from './types/game';

describe('addGameAction', () => {
  it('should hand the action to the game when it is added', () => {
    const actions = new Subject<Action>();
    const received: Action[] = [];
    actions.subscribe((action) => received.push(action));

    addGameAction({ actions } as unknown as Game, { type: 'CLOSE' });

    expect(received).toEqual([{ type: 'CLOSE' }]);
  });
});
