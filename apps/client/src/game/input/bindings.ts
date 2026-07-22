import type { KeyBinding } from './key-binding';

export const BINDINGS: Record<string, KeyBinding> = {
  ArrowLeft: { start: { type: 'MOVE_LEFT_START' }, stop: { type: 'MOVE_LEFT_STOP' } },
  KeyA: { start: { type: 'MOVE_LEFT_START' }, stop: { type: 'MOVE_LEFT_STOP' } },
  ArrowRight: { start: { type: 'MOVE_RIGHT_START' }, stop: { type: 'MOVE_RIGHT_STOP' } },
  KeyD: { start: { type: 'MOVE_RIGHT_START' }, stop: { type: 'MOVE_RIGHT_STOP' } },
  ArrowUp: { start: { type: 'JUMP_START' }, stop: { type: 'JUMP_STOP' } },
  KeyW: { start: { type: 'JUMP_START' }, stop: { type: 'JUMP_STOP' } },
  Space: { start: { type: 'JUMP_START' }, stop: { type: 'JUMP_STOP' } },
  KeyE: { start: { type: 'INTERACT' } },
  Enter: { start: { type: 'INTERACT' } },
  Escape: { start: { type: 'CLOSE' } },
  KeyR: { start: { type: 'RESPAWN' } },
};
