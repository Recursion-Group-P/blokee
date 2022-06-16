import { getAllPieces, PIECES } from './piece';
import { HORIZONTAL_DIRS, DIAG_DIRS } from 'src/constants';

export class Player {
  constructor(color, name, isAI = false) {
    this.name = name;
    this.score = 0;
    this.color = color;
    this.remainingPieces = getAllPieces(PIECES);
    this.selectedPieceId = -1;
    this.outOfGame = false;
    this.isAI = isAI;
    this.remainingTime = 0;
  }
}

export class AIPlayer extends Player {
  constructor(color, name, totalCells, isAI = true) {
    super(color, name, isAI);
    this.totalCells = totalCells;
    this.possibleDIRS = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [0, 2],
      [2, 0],
      [-2, 0],
      [0, -2],
    ];
  }

  inBounds(row, col) {
    return col >= 0 && row >= 0 && col < this.totalCells && row < this.totalCells;
  }

  getCurrentAvailableMoves(playerId, availableMoves, boardState) {
    const moves = [];
    const seen = new Set();
    for (let row = 0; row < this.totalCells; row++) {
      for (let col = 0; col < this.totalCells; col++) {
        if (availableMoves[row][col] === 1) {
          moves.push([row, col]);
          seen.add([row, col].toString());
          for (const possibleDIR of this.possibleDIRS) {
            const curr_row = row + possibleDIR[0];
            const curr_col = col + possibleDIR[1];
            const curr_str = [curr_row, curr_col].toString();
            if (
              !seen.has(curr_str) &&
              this.inBounds(curr_row, curr_col) &&
              boardState[curr_row][curr_col] === 0
            ) {
              let isValid = true;
              for (const HORI_DIR of HORIZONTAL_DIRS) {
                const hori_i = curr_row + HORI_DIR[0];
                const hori_j = curr_col + HORI_DIR[1];
                if (this.inBounds(hori_i, hori_j)) {
                  isValid = boardState[hori_i][hori_j] !== playerId + 1;
                }
              }
              if (isValid) {
                moves.push([curr_row, curr_col]);
              }
              seen.add(curr_str);
            }
          }
        }
      }
    }
    return moves;
  }

  getRandomMoves(playerId, availableMoves, boardState) {
    return this.getCurrentAvailableMoves(playerId, availableMoves, boardState).sort(
      () => Math.random() - 0.5
    );
  }

  getPieceOptions() {
    return Object.keys(this.remainingPieces).reduce((filtered, pieceId) => {
      if (!this.remainingPieces[pieceId].isUsed) {
        filtered.push(parseInt(pieceId));
      }
      return filtered;
    }, []);
  }
}

// Random
export class RandomAIPlayer extends AIPlayer {
  constructor(color, name, totalCells, isAI = true) {
    super(color, name, totalCells, isAI);
    this.type = 'random';
  }

  getRandomPieces() {
    const pieceOptions = this.getPieceOptions();
    return pieceOptions.sort(() => Math.random() - 0.5);
  }
}

// Random with highest point piece
export class MediumRandomAIPlayer extends AIPlayer {
  constructor(color, name, totalCells, isAI = true) {
    super(color, name, totalCells, isAI);
    this.type = 'medium random';
  }

  getPieces() {
    return this.getPieceOptions().reverse();
  }
}

// Greedy
export class GreedyAIPlayer extends AIPlayer {
  constructor(color, name, totalCells, isAI = true) {
    super(color, name, totalCells, isAI);
    this.type = 'greedy';
  }

  getCornerDifferenceWithOpponent(opponentAvailableMove, pieceCoordsOnBoard) {
    let cnt = 0;
    for (const pieceCoord of pieceCoordsOnBoard) {
      const curr_row = pieceCoord[0];
      const curr_col = pieceCoord[1];
      if (opponentAvailableMove[curr_row][curr_col] === 1) {
        cnt--;
      }
    }

    return cnt;
  }

  getCornerDifference(playerId, currPlayerAvailableMoves, pieceCoordsOnBoard, boardState) {
    let cnt = 0;
    for (const pieceCoord of pieceCoordsOnBoard) {
      const curr_row = pieceCoord[0];
      const curr_col = pieceCoord[1];

      if (currPlayerAvailableMoves[curr_row][curr_col] === 1) {
        cnt--;
      }

      for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
        let hori_i = curr_row + HORIZONTAL_DIR[0];
        let hori_j = curr_col + HORIZONTAL_DIR[1];
        if (
          this.inBounds(hori_i, hori_j) &&
          boardState[hori_i][hori_j] !== playerId + 1 &&
          currPlayerAvailableMoves[hori_i][hori_j] === 1
        ) {
          cnt--;
        }
      }

      for (const DIAG_DIR of DIAG_DIRS) {
        let canPlace = false;
        let diag_i = curr_row + DIAG_DIR[0];
        let diag_j = curr_col + DIAG_DIR[1];

        if (
          this.inBounds(diag_i, diag_j) &&
          boardState[diag_i][diag_j] === 0 &&
          currPlayerAvailableMoves[diag_i][diag_j] !== 1
        ) {
          canPlace = true;
          for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
            let hori_i = diag_i + HORIZONTAL_DIR[0];
            let hori_j = diag_j + HORIZONTAL_DIR[1];
            if (this.inBounds(hori_i, hori_j)) {
              canPlace = canPlace && boardState[hori_i][hori_j] !== playerId + 1;
            }
          }
        }

        if (canPlace) {
          cnt++;
        }
      }
    }

    return cnt;
  }

  getPieces() {
    return this.getPieceOptions().reverse();
  }
}
