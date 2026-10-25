export const formatStructureDeclaration = (
  name: string,
  type: string,
  text: string,
): string => `export const ${name}: ${type} = ${text};`;
