import type { KeyBinding } from './key-binding';

export const BINDINGS: KeyBinding[] = [
  {
    code: 'ArrowLeft',
    start: { type: 'MOVE_LEFT_START' },
    stop: { type: 'MOVE_LEFT_STOP' },
  },
  {
    code: 'KeyA',
    start: { type: 'MOVE_LEFT_START' },
    stop: { type: 'MOVE_LEFT_STOP' },
  },
  {
    code: 'ArrowRight',
    start: { type: 'MOVE_RIGHT_START' },
    stop: { type: 'MOVE_RIGHT_STOP' },
  },
  {
    code: 'KeyD',
    start: { type: 'MOVE_RIGHT_START' },
    stop: { type: 'MOVE_RIGHT_STOP' },
  },
  {
    code: 'ArrowUp',
    start: { type: 'JUMP_START' },
    stop: { type: 'JUMP_STOP' },
  },
  { code: 'KeyW', start: { type: 'JUMP_START' }, stop: { type: 'JUMP_STOP' } },
  { code: 'KeyE', start: { type: 'INTERACT' } },
  { code: 'Enter', start: { type: 'INTERACT' } },
  { code: 'Escape', start: { type: 'CLOSE' } },
  { code: 'KeyR', start: { type: 'RESPAWN' } },
  { code: 'Space', start: { type: 'USE_STAR' } },
  { code: 'KeyZ', start: { type: 'USE_STAR' } },
  { code: 'Period', start: { type: 'USE_STAR' } },
  { code: 'KeyX', start: { type: 'SHOOT' } },
  { code: 'Slash', start: { type: 'SHOOT' } },
  { code: 'Digit1', start: { type: 'CHOOSE_ITEM', index: 0 } },
  { code: 'Digit2', start: { type: 'CHOOSE_ITEM', index: 1 } },
  { code: 'Digit3', start: { type: 'CHOOSE_ITEM', index: 2 } },
];
