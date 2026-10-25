import type { GameLevel } from '@mander/engine';
import type { Palette } from '@mander/render';
import type { Observable } from 'rxjs';
import type { CanvasCell } from '../../canvas';
import type { RunRecord } from '../../storage';
import type { AnimationFrame } from '../../tick';

export interface ReplayStage {
  cell: CanvasCell;
  palette: Palette;
  levels: GameLevel[];
  score: number;
  rivals: RunRecord[];
  frames: Observable<AnimationFrame>;
}
