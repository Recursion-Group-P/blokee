const PIECES = [
    'C',
    'CO',
    'OCO',
    ' O\nOC',
    'OCOO',
    'O\nOCO',
    'CO\nOO',
    'CO\n OO',
    ' O \nOCO',
    'O O\nOCO',
    'OO\nCO\nO',
    'OOCOO',
    'O\nOCOO',
    '  O  \n  O  \nOCO',
    'OOC\n  O\n  O',
    ' O \nOCO\n O',
    ' O\nOC\n OO',
    ' OO\n C\nOO',
    'OOC\n  OO',
    'OO\nCO\nO',
    ' O\nOCOO',
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

function getAllPieces(pieces) {
    const allPieceCoordinates = [];
    for (const piece of pieces) {
        allPieceCoordinates.push(getCoordinatesFromCenter(piece.split('\n')));
    }

    return allPieceCoordinates;
}

export const allPiecesCoordinates = getAllPieces(PIECES);
export const allPiecesStates = Object.entries(allPiecesCoordinates).map(function([i, ]) {
  return {pieceId: parseInt(i), direction: 0};
})



// horizontal flip

// flipPairs
// [
// [0, 4],
// [1, 7],
// [2, 6],
// [3, 5]
// ];

// flipPairs.includes(somePiece.direction => 0);
// matchedPair = [0,4]
// if direction == matchedPair[0] ? matchedPair[1] : matchedPair[0];





// allPiecesCoordinates
// [
//     [],
//     [[0, 1]],
//     [[0, -1], [1, 0]],
//     [[0, -1], [0, 1]],
//     [[0, 1], [1, 0], [1, 1]],
//     [[-1, 0], [0, -1], [0, 1]],
//     [[0, -1], [0, 1], [0, 2]],
//     [[-1, 1], [0, -1], [0, 1]],
//     [[0, 1], [1, -1], [1, 0]],
//     [[-1, -1], [0, -1], [0, 1], [0, 2]],
//     [[-2, 0], [-1, 0], [0, -1], [0, 1]],
//     [[-2, 0], [-1, 0], [0, 1], [0, 2]],
//     [[0, 1], [0, 2], [1, -1], [1, 0]],
//     [[-1, 1], [0, -1], [0, 1], [1, -1]],
//     [[0, -2], [0, -1], [0, 1], [0, 2]],
//     [[-1, 0], [0, 1], [1, 0], [1, 1]],
//     [[-1, 0], [-1, 1], [0, -1], [1, -1]],
//     [[-1, 0], [-1, 1], [1, 0], [1, 1]],
//     [[-1, 0], [-1, 1], [0, -1], [1, 0]],
//     [[-1, 0], [0, -1], [0, 1], [1, 0]],
//     [[-1, 0], [0, -1], [0, 1], [0, 2]]
// ]


// [
// { pieceId: 0, direction: 0}
// { pieceId: 1, direction: 0}
// { pieceId: 2, direction: 0}
// { pieceId: 3, direction: 0}
// { pieceId: 4, direction: 0}
// { pieceId: 5, direction: 0}
// { pieceId: 6, direction: 0}
// { pieceId: 7, direction: 0}
// ]
