const STRUCTURE_NAME = /^(NORMAL|HARD|VERTICAL)_\d{3,}$/;

export const isStructureName = (name: string): boolean =>
  STRUCTURE_NAME.test(name);
