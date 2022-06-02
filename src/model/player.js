import { allPiecesCoordinates } from './piece';

export class Player {
  constructor(color) {
    this.score = -89;
    this.color = color;
    this.time = 0;
    this.remainingPieces = allPiecesCoordinates;
    this.selectedPieceId = -1;
  }
}
