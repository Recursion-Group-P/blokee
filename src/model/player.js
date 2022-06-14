import { getAllPieces, PIECES } from './piece';

export class Player {
  constructor(color, name, isAI = false) {
    this.name = name;
    this.score = -89;
    this.color = color;
    this.remainingPieces = getAllPieces(PIECES);
    this.selectedPieceId = -1;
    this.outOfGame = false;
    this.isAI = isAI;
  }
}

export class AIPlayer extends Player {
  constructor(color, name, totalCells, isAI = true) {
    super(color, name, isAI);
    this.totalCells = totalCells;
  }

  getRandomMoves(boardState) {
    const randomMoves = [];
    for (let row = 0; row < this.totalCells; row++) {
      for (let col = 0; col < this.totalCells; col++) {
        if (boardState[row][col] === 0) {
          randomMoves.push([row, col]);
        }
      }
    }
    randomMoves.sort(() => Math.random() - 0.5);
    return randomMoves;
  }

  getPossiblePlacementsFromCorner(row, col, seen, moves, boardState) {
    const min_row = Math.max(0, row - 2);
    const max_row = Math.min(this.totalCells - 1, row + 2);
    const min_col = Math.max(0, col - 2);
    const max_col = Math.min(this.totalCells - 1, col + 2);

    let curr_row = min_row;
    let curr_col = min_col;

    while (curr_row <= max_row) {
      while (curr_col <= max_col) {
        const setVal = [curr_row, curr_col].toString();
        if (!seen.has(setVal) && boardState[curr_row][curr_col] === 0) {
          moves.push([curr_row, curr_col]);
          seen.add(setVal);
        }
        curr_col++;
      }
      curr_row++;
      curr_col = min_col;
    }
  }

  getMovesOptimized(availableMoves, boardState) {
    const moves = [];
    const seen = new Set();
    for (let row = 0; row < this.totalCells; row++) {
      for (let col = 0; col < this.totalCells; col++) {
        if (availableMoves[row][col] === 1) {
          this.getPossiblePlacementsFromCorner(row, col, seen, moves, boardState);
        }
      }
    }
    console.log('seen', seen);
    console.log('possible moves', moves);

    let sortedMoves = new Array(moves.length);
    const center = this.totalCells / 2;
    for (let i = 0; i < moves.length; i++) {
      let dist = Math.pow(center - moves[i][0], 2) + Math.pow(center - moves[i][1], 2);
      sortedMoves[i] = [dist, [moves[i][0], moves[i][1]]];
    }
    sortedMoves.sort(this.sortByClosetToCenter);
    sortedMoves = sortedMoves.map((move) => move[1]);
    console.log('sorted moves: ', sortedMoves);
    return sortedMoves;
  }

  sortByClosetToCenter(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  }

  getPieceOptions() {
    return Object.keys(this.remainingPieces)
      .reverse()
      .reduce((filtered, pieceId) => {
        if (!this.remainingPieces[pieceId].isUsed) {
          filtered.push(parseInt(pieceId));
        }
        return filtered;
      }, []);
  }
}
