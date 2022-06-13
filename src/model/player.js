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

  getRandomMoves() {
    const randomMoves = [];
    for (let row = 0; row < this.totalCells; row++) {
      for (let col = 0; col < this.totalCells; col++) {
        randomMoves.push([row, col]);
      }
    }
    randomMoves.sort(() => Math.random() - 0.5);
    return randomMoves;
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
