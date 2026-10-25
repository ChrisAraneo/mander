import type { RunRecord } from '../types/run-record';

export const isPlayable = (run: RunRecord): boolean => run.day !== '';
