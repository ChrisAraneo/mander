// a sector is painted in two layers: the front the level is played against,
// and the back drawn dimmed behind it. A sector with nothing behind it leaves
// its back layer empty.
type Row = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

type Grid = [
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
];

type VerticalGrid = [
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
  Row,
];

// a back layer is read cell by cell and stands for air wherever it stops, so
// it may be left empty or cut short
export type Layer = readonly (readonly number[])[];

export type Structure = readonly [Grid, Layer];

export type VerticalStructure = readonly [VerticalGrid, Layer];

export type Sector = readonly [front: Layer, back: Layer];
