export const maxJumpColumns = (rise: number): number => {
  if (rise <= -1) return 6;
  if (rise === 0) return 5;
  if (rise === 1 || rise === 2) return 3;
  if (rise === 3) return 2;
  return 0;
};
