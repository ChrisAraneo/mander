export const createBlockPattern = (name: string): RegExp =>
  new RegExp(
    `export const ${name}: (?:Vertical)?Structure = \\[[\\s\\S]*?\\n\\];`,
  );
