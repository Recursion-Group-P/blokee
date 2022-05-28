const PIECES = [
    "C",
    "CO",
    "CO\n O",
    "OCO",
    "CO\nOO",
    "OCOO",
    " O\nOCO",
    " CX\nOO",
    "O\nOCOO",
    "O\n O\nOCO",
    "O\nO\nCOO",
    "COO\nOO",
    " O\nOCO\nO",
    "OOCOO",
    "O\nCO\nOO",
    "OO\nOC\nO",
    "OO\nC\nOO",
    "OO\nOC\n O",
    "O\nOCO\n O",
    "O\nOCOO",
];

function getCoordinatesFromCenter(array) {
    let centerCoordinate = null;
    const otherCoordinates = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < line[i].length; j++) {
            if (array[i][j] == "C") {
                centerCoordinate = [i, j];
            } else if (array[i][j] == "O") {
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
        allPieceCoordinates.push(getCoordinatesFromCenter(piece.split("\n")));
    }

    return allPieceCoordinates;
}

export const allPiecesCoordinates = getAllPieces(PIECES);

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
//     { pieceId: 0 }
//     { pieceId: 1 }
// { pieceId: 2 }
// { pieceId: 3 }
// { pieceId: 4 }
// { pieceId: 5 }
// { pieceId: 6 }
// { pieceId: 7 }
// { pieceId: 0 }
// { pieceId: 0 }
// { pieceId: 0 }
// { pieceId: 0 }
// { pieceId: 0 }
// { pieceId: 0 }
// { pieceId: 0 }
// { pieceId: 0 }
//   ]