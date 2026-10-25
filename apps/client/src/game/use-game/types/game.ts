import type { Action, GameState, RecorderState } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import type { Subject, Subscription } from 'rxjs';
import type { ShallowRef } from 'vue';
import type { Keyboard } from '../../input';
import type { ReplaySession } from '../../use-replay';
import type { GameFrame } from './game-frame';

export interface Game {
  world: RenderedWorld;
  day: string;
  storage: Storage | undefined;
  state: ShallowRef<GameState>;
  frame: ShallowRef<GameFrame>;
  actions: Subject<Action>;
  recorder: ShallowRef<RecorderState>;
  isRunSaved: ShallowRef<boolean>;
  keyboard: ShallowRef<Keyboard | null>;
  subscription: ShallowRef<Subscription | null>;
  replay: ReplaySession;
}
