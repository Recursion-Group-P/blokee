import { getAllPieces, PIECES } from './piece';

export class Player {
  constructor(color) {
    this.score = -89;
    this.color = color;
    this.remainingPieces = getAllPieces(PIECES);
    this.selectedPieceId = -1;
    this.outOfGame = false;
  }
}
