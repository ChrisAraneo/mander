import type { AnimationFrame } from '../types/animation-frame';

export const computeFrameDelta = ([previous, current]: [
  AnimationFrame,
  AnimationFrame,
]): number => current.timestamp - previous.timestamp;
