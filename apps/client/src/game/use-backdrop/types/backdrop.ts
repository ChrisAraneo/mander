import type { GameState } from '@mander/engine';
import type { Focus, Palette } from '@mander/render';
import type { Subscription } from 'rxjs';
import type { ShallowRef } from 'vue';
import type { CanvasCell } from '../../canvas';
import type { BackdropFrame } from './backdrop-frame';

export interface Backdrop {
  cell: CanvasCell;
  palette: Palette;
  focus: Focus;
  idle: GameState;
  frame: ShallowRef<BackdropFrame>;
  subscription: ShallowRef<Subscription | null>;
}
