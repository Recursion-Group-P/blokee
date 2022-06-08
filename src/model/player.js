import { getAllPieces, PIECES } from './piece';

export class Player {
  constructor(color, time) {
    this.score = -89;
    this.color = color;
    // this.time = time;
    this.remainingPieces = getAllPieces(PIECES);
    this.selectedPieceId = -1;
    this.outOfGame = false;
  }
}
