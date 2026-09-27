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

export type Layer = readonly (readonly number[])[];

export type Structure = readonly [Grid, Layer];

export type VerticalStructure = readonly [VerticalGrid, Layer];

export type Sector = readonly [front: Layer, back: Layer];
