import { hashString } from '../rng';
import { dailyDate } from './daily-date';

export const dailySeed = (date?: Date): string => hashString(dailyDate(date));
