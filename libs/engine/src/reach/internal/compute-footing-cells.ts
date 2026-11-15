import type { Level, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { findSolidFootingCells } from './find-solid-footing-cells';

export const computeFootingCells = (level: Level, player: Player): number[] =>
  match(player.statuses.isGrounded)
    .with(false, (): number[] => [])
    .otherwise(() => findSolidFootingCells(level, player));
