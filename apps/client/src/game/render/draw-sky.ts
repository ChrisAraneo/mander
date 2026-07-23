import { VIEW_HEIGHT, VIEW_WIDTH } from './constants';

export const drawSky = (context: CanvasRenderingContext2D): void => {
  const sky = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, '#1b2033');
  sky.addColorStop(0.6, '#2b3a52');
  sky.addColorStop(1, '#3c5161');
  context.fillStyle = sky;
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
};
