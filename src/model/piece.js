export const PIECES = [
  'C', // [], i1
  'CO', // [ [ 0, 1 ] ], i2
  'OCO', // [ [ 0, -1 ], [ 0, 1 ] ], i3
  ' O\nOC', // [ [ -1, 0 ], [ 0, -1 ] ], v3
  'OCOO', // [ [ 0, -1 ], [ 0, 1 ], [ 0, 2 ] ], i4
  'O\nCOO', // [ [ -1, 0 ], [ 0, 1 ], [ 0, 2 ] ], j4
  'OO\nCO', // [ [ -1, 0 ], [ -1, 1 ], [ 0, 1 ] ], square
  'OO\n CO', // [ [ -1, -1 ], [ -1, 0 ], [ 0, 1 ] ], z4
  ' O \nOCO', // [ [ -1, 0 ], [ 0, -1 ], [ 0, 1 ] ], T4
  'O O\nOCO', // [ [ -1, -1 ], [ -1, 1 ], [ 0, -1 ], [ 0, 1 ] ], c
  'OO\nCO\nO', // [ [ -1, 0 ], [ -1, 1 ], [ 0, 1 ], [ 1, 0 ] ], p
  'OOCOO', // [ [ 0, -2 ], [ 0, -1 ], [ 0, 1 ], [ 0, 2 ] ], i5
  'O\nOCOO', // [ [ -1, -1 ], [ 0, -1 ], [ 0, 1 ], [ 0, 2 ] ], j5
  '  O\nOCO\n  O', // [ [ -1, 1 ], [ 0, -1 ], [ 0, 1 ], [ 1, 1 ] ], T5
  ' O \nOCO\n O', // [ [ -1, 0 ], [ 0, -1 ], [ 0, 1 ], [ 1, 0 ] ], x
  ' O\nOC\n OO', // [ [ -1, 0 ], [ 0, -1 ], [ 1, 0 ], [ 1, 1 ] ], k5
  ' OO\n C\nOO', // [ [ -1, 0 ], [ -1, 1 ], [ 1, -1 ], [ 1, 0 ] ], z5
  'OCO\n  OO', // [ [ 0, -1 ], [ 0, 1 ], [ 1, 1 ], [ 1, 2 ] ], z5wide
  ' C\nOOOO', // [ [ 1, -1 ], [ 1, 0 ], [ 1, 1 ], [ 1, 2 ] ], y
  'O\nOC\n OO', // [ [ -1, -1 ], [ 0, -1 ], [ 1, 0 ], [ 1, 1 ] ], w
  'O  \nC  \nOOO', // [ [ -1, -2 ], [ -1, -1 ], [ -1, 0 ], [ 1, 0 ] ] v5
];

function getCoordinatesFromCenter(array) {
  let centerCoordinate = null;
  const otherCoordinates = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] == 'C') {
        centerCoordinate = [i, j];
      } else if (array[i][j] == 'O') {
        otherCoordinates.push([i, j]);
      }
    }
  }

  return otherCoordinates.map((coordPair) => [
    coordPair[0] - centerCoordinate[0],
    coordPair[1] - centerCoordinate[1],
  ]);
}

export function getAllPieces(pieces) {
  const allPieceCoordinates = {};
  for (let i = 0; i < pieces.length; i++) {
    const currPiece = {
      pieceCoords: null,
      isUsed: false,
    };
    currPiece['pieceCoords'] = getCoordinatesFromCenter(pieces[i].split('\n'));
    allPieceCoordinates[i] = currPiece;
  }

  return allPieceCoordinates;
}
